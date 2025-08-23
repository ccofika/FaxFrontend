import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/admin/AdminAuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { motion, AnimatePresence } from 'motion/react';

interface Faculty {
  _id: string;
  name: string;
  cityId: string;
}

interface Department {
  _id: string;
  name: string;
  facultyId: string;
  availableYears: number[];
  order: number;
}

interface Subject {
  _id: string;
  name: string;
  facultyId: string;
  departmentId: string;
  year: number;
  order: number;
}

interface Material {
  _id: string;
  title: string;
  type: 'book' | 'pdf' | 'link' | 'video' | 'notes';
  r2Key?: string;
  bucket?: string;
  url?: string;
  note?: string;
  subjectId: string;
  facultyId: string;
  departmentId: string;
  year: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface FacultyModalProps {
  facultyId: string;
  isOpen: boolean;
  onClose: () => void;
}

const FacultyModal: React.FC<FacultyModalProps> = ({ facultyId, isOpen, onClose }) => {
  const { isAuthenticated } = useAdminAuth();

  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [materials, setMaterials] = useState<{[subjectId: string]: Material[]}>({});
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Add states for modals
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{type: string, id: string, name: string} | null>(null);
  
  // Material states
  const [uploadingMaterials, setUploadingMaterials] = useState<{[subjectId: string]: boolean}>({});
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameMaterial, setRenameMaterial] = useState<{id: string, subjectId: string, currentTitle: string} | null>(null);
  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [isPageSelectionModalOpen, setIsPageSelectionModalOpen] = useState(false);
  const [pageSelectionMaterial, setPageSelectionMaterial] = useState<{id: string, subjectId: string, title: string} | null>(null);
  const [startPage, setStartPage] = useState(1);
  const [maxPages, setMaxPages] = useState(10);
  const [tocPage, setTocPage] = useState<number | undefined>(undefined);
  const [tocToPage, setTocToPage] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!isAuthenticated || !facultyId || !isOpen) return;

    loadData();
  }, [facultyId, isAuthenticated, isOpen]);

  useEffect(() => {
    if (selectedDeptId && selectedYear) {
      loadSubjects();
    } else {
      setSubjects([]);
      setMaterials({});
    }
  }, [selectedDeptId, selectedYear]);

  useEffect(() => {
    if (subjects.length > 0) {
      loadMaterialsForSubjects();
    }
  }, [subjects]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Load faculty details
      const facultyResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/faculties/${facultyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!facultyResponse.ok) {
        throw new Error('Failed to load faculty');
      }
      
      const facultyData = await facultyResponse.json();
      setFaculty(facultyData.faculty);

      // Load departments
      const deptResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/departments?facultyId=${facultyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!deptResponse.ok) {
        throw new Error('Failed to load departments');
      }
      
      const deptData = await deptResponse.json();
      setDepartments(deptData.departments);
      
      // Set default selection if not already set
      if (deptData.departments.length > 0 && !selectedDeptId) {
        const firstDept = deptData.departments[0];
        setSelectedDeptId(firstDept._id);
        setSelectedYear(firstDept.availableYears[0] || 1);
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Greška pri učitavanju podataka');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSubjects = async () => {
    if (!selectedDeptId || !selectedYear) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/materials/subjects?facultyId=${facultyId}&departmentId=${selectedDeptId}&year=${selectedYear}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to load subjects');
      }
      
      const data = await response.json();
      setSubjects(data.subjects);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const handleDepartmentSelect = (deptId: string) => {
    setSelectedDeptId(deptId);
    const dept = departments.find(d => d._id === deptId);
    if (dept && dept.availableYears.length > 0) {
      setSelectedYear(dept.availableYears[0]);
    }
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
  };

  const handleAddDepartment = async () => {
    if (!newDepartmentName.trim()) {
      setError('Naziv smera je obavezan');
      return;
    }

    setIsAddingDepartment(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/departments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newDepartmentName.trim(),
          facultyId: facultyId,
          availableYears: [1, 2, 3, 4]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create department');
      }

      const data = await response.json();
      setDepartments(prev => [...prev, data.department]);
      setNewDepartmentName('');
      setIsAddDepartmentModalOpen(false);
      setError('');
      
      // Select the new department
      setSelectedDeptId(data.department._id);
      setSelectedYear(1);
    } catch (error: any) {
      setError(error.message || 'Greška pri dodavanju smera');
    } finally {
      setIsAddingDepartment(false);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) {
      setError('Naziv predmeta je obavezan');
      return;
    }

    setIsAddingSubject(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/subjects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newSubjectName.trim(),
          facultyId: facultyId,
          departmentId: selectedDeptId,
          year: selectedYear
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create subject');
      }

      const data = await response.json();
      setSubjects(prev => [...prev, data.subject]);
      setNewSubjectName('');
      setIsAddSubjectModalOpen(false);
      setError('');
    } catch (error: any) {
      setError(error.message || 'Greška pri dodavanju predmeta');
    } finally {
      setIsAddingSubject(false);
    }
  };

  const getAvailableYears = () => {
    const selectedDept = departments.find(d => d._id === selectedDeptId);
    return selectedDept ? selectedDept.availableYears : [1, 2, 3, 4];
  };

  const handleDeleteDepartment = (departmentId: string, departmentName: string) => {
    setDeleteItem({ type: 'department', id: departmentId, name: departmentName });
    setDeleteConfirmOpen(true);
  };

  const executeDeleteDepartment = async (departmentId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/departments/${departmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete department');
      }

      setDepartments(prev => prev.filter(dept => dept._id !== departmentId));
      
      // If deleted department was selected, reset selection
      if (selectedDeptId === departmentId) {
        const remainingDepts = departments.filter(dept => dept._id !== departmentId);
        if (remainingDepts.length > 0) {
          setSelectedDeptId(remainingDepts[0]._id);
          setSelectedYear(remainingDepts[0].availableYears[0] || 1);
        } else {
          setSelectedDeptId('');
          setSelectedYear(1);
          setSubjects([]);
        }
      }
    } catch (error: any) {
      setError(error.message || 'Greška pri brisanju smera');
    }
  };

  const handleDeleteSubject = (subjectId: string, subjectName: string) => {
    setDeleteItem({ type: 'subject', id: subjectId, name: subjectName });
    setDeleteConfirmOpen(true);
  };

  const executeDeleteSubject = async (subjectId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/subjects/${subjectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete subject');
      }

      setSubjects(prev => prev.filter(subject => subject._id !== subjectId));
    } catch (error: any) {
      setError(error.message || 'Greška pri brisanju predmeta');
    }
  };

  const loadMaterialsForSubjects = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const materialsData: {[subjectId: string]: Material[]} = {};

      for (const subject of subjects) {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/materials/materials?subjectId=${subject._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          materialsData[subject._id] = data.materials || [];
        }
      }
      
      setMaterials(materialsData);
    } catch (error) {
      console.error('Error loading materials:', error);
    }
  };

  const handlePDFUpload = async (subjectId: string, file: File, title: string) => {
    if (!selectedDeptId || !selectedYear) return;

    setUploadingMaterials(prev => ({ ...prev, [subjectId]: true }));
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('title', title);
      formData.append('subjectId', subjectId);
      formData.append('facultyId', facultyId);
      formData.append('departmentId', selectedDeptId);
      formData.append('year', selectedYear.toString());

      const uploadResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/upload/pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'Failed to upload PDF');
      }

      const uploadData = await uploadResponse.json();

      const materialResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/materials`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          type: 'pdf',
          r2Key: uploadData.r2Key,
          bucket: uploadData.bucket,
          subjectId: subjectId,
          facultyId: facultyId,
          departmentId: selectedDeptId,
          year: selectedYear
        }),
      });

      if (!materialResponse.ok) {
        const errorData = await materialResponse.json();
        throw new Error(errorData.message || 'Failed to create material record');
      }

      const materialData = await materialResponse.json();
      
      setMaterials(prev => ({
        ...prev,
        [subjectId]: [...(prev[subjectId] || []), materialData.material]
      }));

      // Reset file input
      const fileInput = document.getElementById(`pdf-upload-${subjectId}`) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

      // Only for PDF materials, open page selection modal
      if (materialData.material.type === 'pdf') {
        setPageSelectionMaterial({
          id: materialData.material._id,
          subjectId,
          title: materialData.material.title,
        });
        setIsPageSelectionModalOpen(true);
      }

    } catch (error: any) {
      setError(error.message || 'Greška pri dodavanju PDF-a');
    } finally {
      setUploadingMaterials(prev => ({ ...prev, [subjectId]: false }));
    }
  };

  const handleDeleteMaterial = async (materialId: string, subjectId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/materials/${materialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete material');
      }

      setMaterials(prev => ({
        ...prev,
        [subjectId]: prev[subjectId]?.filter(material => material._id !== materialId) || []
      }));
    } catch (error: any) {
      setError(error.message || 'Greška pri brisanju materijala');
    }
  };

  const handleViewMaterial = (material: Material) => {
    if (material.type === 'pdf' && material.r2Key) {
      const viewUrl = `${process.env.REACT_APP_API_URL}/api/upload/view/${encodeURIComponent(material.r2Key)}`;
      window.open(viewUrl, '_blank');
    } else if (material.url) {
      window.open(material.url, '_blank');
    }
  };

  const openRenameModal = (materialId: string, subjectId: string, currentTitle: string) => {
    setRenameMaterial({ id: materialId, subjectId, currentTitle });
    setNewMaterialTitle(currentTitle);
    setIsRenameModalOpen(true);
  };

  const handleRenameMaterial = async () => {
    if (!renameMaterial || !newMaterialTitle.trim()) return;
    
    if (newMaterialTitle.trim() === renameMaterial.currentTitle) {
      setIsRenameModalOpen(false);
      setRenameMaterial(null);
      setNewMaterialTitle('');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/materials/${renameMaterial.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newMaterialTitle.trim()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to rename material');
      }

      const data = await response.json();
      
      // Update materials state
      setMaterials(prev => ({
        ...prev,
        [renameMaterial.subjectId]: prev[renameMaterial.subjectId]?.map(material => 
          material._id === renameMaterial.id 
            ? { ...material, title: data.material.title }
            : material
        ) || []
      }));

      // Close modal
      setIsRenameModalOpen(false);
      setRenameMaterial(null);
      setNewMaterialTitle('');
      setError('');
    } catch (error: any) {
      setError(error.message || 'Greška pri preimenovanju materijala');
    }
  };

  const handleStartProcessing = async () => {
    if (!pageSelectionMaterial) return;

    console.log(`Starting processing for material: ${pageSelectionMaterial.id}, startPage: ${startPage}, maxPages: ${maxPages}`);

    try {
      const token = localStorage.getItem('adminToken');
      const url = `${process.env.REACT_APP_API_URL}/api/ingestion/process/${pageSelectionMaterial.id}`;
      console.log('Making request to:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startPage,
          maxPages,
          tocPage,
          tocToPage,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to start processing');
      }

      const data = await response.json();
      console.log('Processing started successfully:', data);
      
      // Close modal
      setIsPageSelectionModalOpen(false);
      setPageSelectionMaterial(null);
      setStartPage(1);
      setMaxPages(10);
      setError('');

      // Show success message
      alert('Processing started! Check console logs for progress.');
    } catch (error: any) {
      console.error('Processing start error:', error);
      setError(error.message || 'Greška pri pokretanju obrade dokumenta');
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!faculty) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <div className="text-center py-20">
            <p className="text-gray-600">Fakultet nije pronađen</p>
            <Button onClick={onClose} className="mt-4 bg-black hover:bg-gray-800 text-white">
              Zatvori
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0 bg-white [&>button]:hidden">
        {/* Header */}
        <motion.div 
          className="bg-white border-b border-gray-200 px-6 py-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 text-gray-700 hover:text-gray-900"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5m7-7l-7 7 7 7"/>
                </svg>
              </Button>
              <h1 className="text-xl font-bold text-gray-900">{faculty.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <Button
                className="bg-black hover:bg-gray-800 text-white"
                onClick={() => setIsAddSubjectModalOpen(true)}
                disabled={!selectedDeptId}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                  <path d="M12 5v14m-7-7h14"/>
                </svg>
                Dodaj Predmet
              </Button>
            </div>
          </div>

          {/* Department and Year Selection */}
          <div className="mt-4 space-y-4">
            {/* Department Chips */}
            <motion.div 
              className="flex flex-wrap items-center gap-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              <span className="text-sm font-medium text-gray-700 mr-2">Smer:</span>
              {departments.map((dept) => (
                <motion.div
                  key={dept._id}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-1">
                    <Badge
                      variant={selectedDeptId === dept._id ? "default" : "outline"}
                      className={`cursor-pointer px-3 py-1 ${
                        selectedDeptId === dept._id
                          ? 'bg-black text-white hover:bg-gray-800'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900'
                      }`}
                      onClick={() => handleDepartmentSelect(dept._id)}
                    >
                      {dept.name}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-6 w-6 text-gray-400 hover:text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDepartment(dept._id, dept.name);
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                    </Button>
                  </div>
                </motion.div>
              ))}
              
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer px-3 py-1 bg-white border-dashed border-gray-400 text-gray-600 hover:bg-gray-50"
                  onClick={() => setIsAddDepartmentModalOpen(true)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                    <path d="M12 5v14m-7-7h14"/>
                  </svg>
                  Dodaj Smer
                </Badge>
              </motion.div>
            </motion.div>

            {/* Year Chips */}
            <AnimatePresence>
              {selectedDeptId && (
                <motion.div 
                  className="flex flex-wrap items-center gap-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  <span className="text-sm font-medium text-gray-700 mr-2">Godina:</span>
                  {getAvailableYears().map((year) => (
                    <motion.div
                      key={year}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: year * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge
                        variant={selectedYear === year ? "default" : "outline"}
                        className={`cursor-pointer px-3 py-1 ${
                          selectedYear === year
                            ? 'bg-black text-white hover:bg-gray-800'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900'
                        }`}
                        onClick={() => handleYearSelect(year)}
                      >
                        Godina {year}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="overflow-y-auto px-6 py-4" 
          style={{ maxHeight: 'calc(90vh - 200px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {selectedDeptId && selectedYear ? (
              <motion.div 
                key={`${selectedDeptId}-${selectedYear}`}
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Predmeti - {departments.find(d => d._id === selectedDeptId)?.name} - Godina {selectedYear}
                </h3>
                
                {subjects.length > 0 ? (
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                  >
                    {subjects.map((subject) => (
                      <motion.div
                        key={`${subject._id}-${selectedDeptId}-${selectedYear}`}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 }
                        }}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      >
                        <Card className="border border-gray-200 hover:shadow-md transition-shadow bg-white">
                          <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900 text-sm">{subject.name}</h4>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 h-6 w-6 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSubject(subject._id, subject.name);
                                }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M3 6h18"/>
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                </svg>
                              </Button>
                            </div>
                          </div>
                          
                          {/* Materials section */}
                          <div className="space-y-2">
                            {materials[subject._id]?.length > 0 ? (
                              <div className="space-y-2">
                                {materials[subject._id].map((material) => (
                                  <div key={material._id} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600 flex-shrink-0">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14,2 14,8 20,8"/>
                                      </svg>
                                      <span className="truncate font-medium text-gray-700">{material.title}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-1 h-5 w-5 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                                        onClick={() => handleViewMaterial(material)}
                                      >
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                          <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-1 h-5 w-5 text-gray-400 hover:text-orange-600 hover:bg-orange-50"
                                        onClick={() => openRenameModal(material._id, subject._id, material.title)}
                                      >
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                          <path d="m18.5 2.5-6 6"/>
                                        </svg>
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-1 h-5 w-5 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => handleDeleteMaterial(material._id, subject._id)}
                                      >
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <path d="M3 6h18"/>
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                        </svg>
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500">Nema materijala</p>
                              </div>
                            )}
                            
                            {/* Add PDF button */}
                            <div className="mt-2">
                              <input
                                type="file"
                                accept=".pdf"
                                style={{ display: 'none' }}
                                id={`pdf-upload-${subject._id}`}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const defaultTitle = file.name.replace('.pdf', '');
                                    handlePDFUpload(subject._id, file, defaultTitle);
                                  }
                                  e.target.value = '';
                                }}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full h-7 text-xs border-dashed border-gray-400 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                                disabled={uploadingMaterials[subject._id]}
                                onClick={() => document.getElementById(`pdf-upload-${subject._id}`)?.click()}
                              >
                                {uploadingMaterials[subject._id] ? (
                                  <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-600 mr-2"></div>
                                    Dodavanje...
                                  </>
                                ) : (
                                  <>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                                      <path d="M12 5v14m-7-7h14"/>
                                    </svg>
                                    Dodaj PDF
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
                      <CardContent className="p-8 text-center">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mx-auto mb-4 text-gray-400"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10,9 9,9 8,9"/>
                      </svg>
                      <p className="text-gray-600 mb-2">Nema predmeta</p>
                        <p className="text-sm text-gray-500">Dodaj prvi predmet za ovaj smer i godinu</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
                  <CardContent className="p-12 text-center">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mx-auto mb-4 text-gray-400"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Izaberi smer i godinu</h3>
                    <p className="text-gray-600">Prvo dodaj smerove, zatim izaberi smer i godinu da vidiš predmete</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Add Department Modal */}
        <Dialog open={isAddDepartmentModalOpen} onOpenChange={setIsAddDepartmentModalOpen}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Dodaj novi smer</DialogTitle>
              <DialogDescription className="text-gray-600">
                Dodavanje smera za fakultet: {faculty.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="departmentName" className="text-sm font-medium text-gray-700">
                  Naziv smera
                </label>
                <Input
                  id="departmentName"
                  value={newDepartmentName}
                  onChange={(e) => setNewDepartmentName(e.target.value)}
                  placeholder="Unesite naziv smera..."
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                  disabled={isAddingDepartment}
                  autoFocus
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  disabled={isAddingDepartment}
                  onClick={() => {
                    setIsAddDepartmentModalOpen(false);
                    setNewDepartmentName('');
                    setError('');
                  }}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  Otkaži
                </Button>
                <Button
                  onClick={handleAddDepartment}
                  disabled={isAddingDepartment || !newDepartmentName.trim()}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  {isAddingDepartment ? 'Dodavanje...' : 'Dodaj'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Subject Modal */}
        <Dialog open={isAddSubjectModalOpen} onOpenChange={setIsAddSubjectModalOpen}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Dodaj novi predmet</DialogTitle>
              <DialogDescription className="text-gray-600">
                Smer: {departments.find(d => d._id === selectedDeptId)?.name} - Godina: {selectedYear}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="subjectName" className="text-sm font-medium text-gray-700">
                  Naziv predmeta
                </label>
                <Input
                  id="subjectName"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="Unesite naziv predmeta..."
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                  disabled={isAddingSubject}
                  autoFocus
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  disabled={isAddingSubject}
                  onClick={() => {
                    setIsAddSubjectModalOpen(false);
                    setNewSubjectName('');
                    setError('');
                  }}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  Otkaži
                </Button>
                <Button
                  onClick={handleAddSubject}
                  disabled={isAddingSubject || !newSubjectName.trim() || !selectedDeptId}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  {isAddingSubject ? 'Dodavanje...' : 'Dodaj'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteConfirmOpen}
          onClose={() => {
            setDeleteConfirmOpen(false);
            setDeleteItem(null);
          }}
          onConfirm={async () => {
            if (deleteItem) {
              if (deleteItem.type === 'department') {
                await executeDeleteDepartment(deleteItem.id);
              } else if (deleteItem.type === 'subject') {
                await executeDeleteSubject(deleteItem.id);
              }
            }
            setDeleteConfirmOpen(false);
            setDeleteItem(null);
          }}
          title={`Obriši ${
            deleteItem?.type === 'department' ? 'smer' : 
            deleteItem?.type === 'subject' ? 'predmet' : ''
          }`}
          description={`Da li ste sigurni da želite da obrišete ${
            deleteItem?.type === 'department' ? 'smer' : 
            deleteItem?.type === 'subject' ? 'predmet' : ''
          } "${deleteItem?.name}"?${
            deleteItem?.type === 'department' ? ' Ova akcija će obrisati i sve predmete ovog smera.' : ''
          }`}
          confirmText="Obriši"
          cancelText="Otkaži"
        />

        {/* Rename Material Modal */}
        <Dialog open={isRenameModalOpen} onOpenChange={setIsRenameModalOpen}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Preimenuj materijal</DialogTitle>
              <DialogDescription className="text-gray-600">
                Unesite novi naziv za materijal
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="materialTitle" className="text-sm font-medium text-gray-700">
                  Naziv materijala
                </label>
                <Input
                  id="materialTitle"
                  value={newMaterialTitle}
                  onChange={(e) => setNewMaterialTitle(e.target.value)}
                  placeholder="Unesite naziv materijala..."
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                  autoFocus
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsRenameModalOpen(false);
                    setRenameMaterial(null);
                    setNewMaterialTitle('');
                    setError('');
                  }}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  Otkaži
                </Button>
                <Button
                  onClick={handleRenameMaterial}
                  disabled={!newMaterialTitle.trim()}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Preimenuj
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Page Selection Modal */}
        <Dialog open={isPageSelectionModalOpen} onOpenChange={setIsPageSelectionModalOpen}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Izbor stranica za obradu</DialogTitle>
              <DialogDescription className="text-gray-600">
                Materijal: {pageSelectionMaterial?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="startPage" className="text-sm font-medium text-gray-700">
                  Počni od stranice
                </label>
                <Input
                  id="startPage"
                  type="number"
                  value={startPage}
                  onChange={(e) => setStartPage(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tocPage" className="text-sm font-medium text-gray-700">
                    Sadržaj počinje na str.
                  </label>
                  <Input
                    id="tocPage"
                    type="number"
                    value={tocPage || ''}
                    onChange={(e) => setTocPage(e.target.value ? Math.max(1, parseInt(e.target.value) || 1) : undefined)}
                    min="1"
                    placeholder="npr. 2"
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="tocToPage" className="text-sm font-medium text-gray-700">
                    Sadržaj završava na str.
                  </label>
                  <Input
                    id="tocToPage"
                    type="number"
                    value={tocToPage || ''}
                    onChange={(e) => setTocToPage(e.target.value ? Math.max(1, parseInt(e.target.value) || 1) : undefined)}
                    min="1"
                    placeholder="npr. 4"
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                AI će analizirati stranice sadržaja i automatski prepoznati strukture poglavlja
              </p>

              <div>
                <label htmlFor="maxPages" className="text-sm font-medium text-gray-700">
                  Maksimalno stranica (ograničeno na 10 za test)
                </label>
                <Input
                  id="maxPages"
                  type="number"
                  value={maxPages}
                  onChange={(e) => setMaxPages(Math.min(10, Math.max(1, parseInt(e.target.value) || 10)))}
                  min="1"
                  max="10"
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm">
                <p>Obradiće se stranice od {startPage} do {startPage + maxPages - 1}</p>
                <p className="text-xs mt-1">Ograničeno na maksimalno 10 stranica za testiranje</p>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsPageSelectionModalOpen(false);
                    setPageSelectionMaterial(null);
                    setStartPage(1);
                    setMaxPages(10);
                    setError('');
                  }}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  Otkaži
                </Button>
                <Button
                  onClick={handleStartProcessing}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Pokreni obradu
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default FacultyModal;