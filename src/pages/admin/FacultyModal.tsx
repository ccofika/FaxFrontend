import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/admin/AdminAuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';

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

  useEffect(() => {
    if (!isAuthenticated || !facultyId || !isOpen) return;

    loadData();
  }, [facultyId, isAuthenticated, isOpen]);

  useEffect(() => {
    if (selectedDeptId && selectedYear) {
      loadSubjects();
    }
  }, [selectedDeptId, selectedYear]);

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
            <Button onClick={onClose} className="mt-4">
              Zatvori
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={onClose}
                className="p-2 hover:bg-gray-100"
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700 mr-2">Smer:</span>
              {departments.map((dept) => (
                <Badge
                  key={dept._id}
                  variant={selectedDeptId === dept._id ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-1 ${
                    selectedDeptId === dept._id
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700'
                  }`}
                  onClick={() => handleDepartmentSelect(dept._id)}
                >
                  {dept.name}
                </Badge>
              ))}
              
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
            </div>

            {/* Year Chips */}
            {selectedDeptId && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Godina:</span>
                {getAvailableYears().map((year) => (
                  <Badge
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    className={`cursor-pointer px-3 py-1 ${
                      selectedYear === year
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700'
                    }`}
                    onClick={() => handleYearSelect(year)}
                  >
                    Godina {year}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {selectedDeptId && selectedYear ? (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Predmeti - {departments.find(d => d._id === selectedDeptId)?.name} - Godina {selectedYear}
                </h3>
                
                {subjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {subjects.map((subject) => (
                      <Card key={subject._id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900 text-sm">{subject.name}</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-200 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 text-xs px-2 py-1"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                                <path d="M12 5v14m-7-7h14"/>
                              </svg>
                              dodaj material
                            </Button>
                          </div>
                          
                          {/* Materials placeholder */}
                          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500">Nema materijala</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          ) : (
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
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Izaberi smer i godinu</h3>
                <p className="text-gray-500">Prvo dodaj smerove, zatim izaberi smer i godinu da vidiš predmete</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Add Department Modal */}
        <Dialog open={isAddDepartmentModalOpen} onOpenChange={setIsAddDepartmentModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Dodaj novi smer</DialogTitle>
              <DialogDescription>
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
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Dodaj novi predmet</DialogTitle>
              <DialogDescription>
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
      </DialogContent>
    </Dialog>
  );
};

export default FacultyModal;