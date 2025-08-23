import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/admin/AdminAuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import FacultyModal from './FacultyModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { motion, AnimatePresence } from 'motion/react';

interface City {
  _id: string;
  name: string;
}

interface Faculty {
  _id: string;
  name: string;
  cityId: string;
}

interface CityWithFaculties extends City {
  faculties: Faculty[];
}

interface DocumentSection {
  _id: string;
  sectionId: string;
  title: string;
  path: string;
  level: number;
  pageStart: number;
  pageEnd: number;
  charStart: number;
  charEnd: number;
  content: string;
  docId: string;
  subjectId: string;
  createdAt: string;
  updatedAt: string;
}

interface AIAnalysisResult {
  sections: Array<{
    title: string;
    level: number;
    pageStart: number;
    pageEnd: number;
    parentSectionId?: string;
    semanticType: 'chapter' | 'section' | 'subsection' | 'paragraph';
  }>;
}

const MaterialManagement: React.FC = () => {
  const { admin, isAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  
  const [cities, setCities] = useState<CityWithFaculties[]>([]);
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isAddingCity, setIsAddingCity] = useState(false);
  const [isAddingFaculty, setIsAddingFaculty] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [newFacultyName, setNewFacultyName] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [error, setError] = useState('');
  const [isAddCityModalOpen, setIsAddCityModalOpen] = useState(false);
  const [isAddFacultyModalOpen, setIsAddFacultyModalOpen] = useState(false);
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{type: string, id: string, name: string, cityId?: string} | null>(null);
  const [showSectionsPreview, setShowSectionsPreview] = useState(false);
  const [sections, setSections] = useState<DocumentSection[]>([]);
  const [loadingSections, setLoadingSections] = useState(false);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number | null>(null);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [loadingAIAnalysis, setLoadingAIAnalysis] = useState(false);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Load cities
      const citiesResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/cities`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!citiesResponse.ok) {
        throw new Error('Failed to load cities');
      }
      
      const citiesData = await citiesResponse.json();
      
      // Load faculties for each city
      const citiesWithFaculties: CityWithFaculties[] = [];
      
      for (const city of citiesData.cities) {
        const facultiesResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/faculties?cityId=${city._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (facultiesResponse.ok) {
          const facultiesData = await facultiesResponse.json();
          citiesWithFaculties.push({
            ...city,
            faculties: facultiesData.faculties || []
          });
        } else {
          citiesWithFaculties.push({
            ...city,
            faculties: []
          });
        }
      }
      
      setCities(citiesWithFaculties);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Greška pri učitavanju podataka');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Early returns after hooks
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleCityInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsAddCityModalOpen(false);
      setNewCityName('');
      setError('');
    } else if (e.key === 'Enter' && newCityName.trim() && !isAddingCity) {
      handleAddCity();
    }
  };

  const handleAddCity = async () => {
    if (!newCityName.trim()) {
      setError('Naziv grada je obavezan');
      return;
    }

    setIsAddingCity(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/cities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCityName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create city');
      }

      const data = await response.json();
      setCities(prev => [...prev, { ...data.city, faculties: [] }]);
      setNewCityName('');
      setIsAddCityModalOpen(false);
      setError('');
    } catch (error: any) {
      setError(error.message || 'Greška pri dodavanju grada');
    } finally {
      setIsAddingCity(false);
    }
  };

  const handleFacultyInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsAddFacultyModalOpen(false);
      setNewFacultyName('');
      setSelectedCityId('');
      setError('');
    } else if (e.key === 'Enter' && newFacultyName.trim() && selectedCityId && !isAddingFaculty) {
      handleAddFaculty();
    }
  };

  const handleAddFaculty = async () => {
    if (!newFacultyName.trim() || !selectedCityId) {
      setError('Naziv fakulteta i grad su obavezni');
      return;
    }

    setIsAddingFaculty(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/faculties`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: newFacultyName.trim(),
          cityId: selectedCityId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create faculty');
      }

      const data = await response.json();
      setCities(prev => prev.map(city => 
        city._id === selectedCityId 
          ? { ...city, faculties: [...city.faculties, data.faculty] }
          : city
      ));
      setNewFacultyName('');
      setSelectedCityId('');
      setIsAddFacultyModalOpen(false);
      setError('');
    } catch (error: any) {
      setError(error.message || 'Greška pri dodavanju fakulteta');
    } finally {
      setIsAddingFaculty(false);
    }
  };

  const handleSearchChange = (cityId: string, term: string) => {
    setSearchTerms(prev => ({ ...prev, [cityId]: term }));
  };

  const getFilteredFaculties = (city: CityWithFaculties) => {
    const searchTerm = searchTerms[city._id] || '';
    if (!searchTerm) return city.faculties;
    
    return city.faculties.filter(faculty =>
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleDeleteCity = (cityId: string, cityName: string) => {
    setDeleteItem({ type: 'city', id: cityId, name: cityName });
    setDeleteConfirmOpen(true);
  };

  const executeDeleteCity = async (cityId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/cities/${cityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete city');
      }

      setCities(prev => prev.filter(city => city._id !== cityId));
    } catch (error: any) {
      setError(error.message || 'Greška pri brisanju grada');
    }
  };

  const loadSections = async () => {
    setLoadingSections(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ingestion/sections`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load sections');
      }

      const data = await response.json();
      setSections(data.sections || []);
      console.log('Loaded sections:', data.sections);
    } catch (error: any) {
      console.error('Error loading sections:', error);
      setError(error.message || 'Greška pri učitavanju sekcija');
    } finally {
      setLoadingSections(false);
    }
  };

  const loadAIAnalysis = async () => {
    setLoadingAIAnalysis(true);
    // Reset previous data
    setAiAnalysisResult(null);
    setError('');
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ingestion/ai-analysis?t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load AI analysis');
      }

      const data = await response.json();
      setAiAnalysisResult(data.aiAnalysis || null);
      console.log('Loaded AI analysis:', data.aiAnalysis);
    } catch (error: any) {
      console.error('Error loading AI analysis:', error);
      setError(error.message || 'Greška pri učitavanju AI analize');
    } finally {
      setLoadingAIAnalysis(false);
    }
  };

  const handleFacultyClick = (facultyId: string) => {
    setSelectedFacultyId(facultyId);
    setIsFacultyModalOpen(true);
  };

  const handleDeleteFaculty = (facultyId: string, facultyName: string, cityId: string) => {
    setDeleteItem({ type: 'faculty', id: facultyId, name: facultyName, cityId });
    setDeleteConfirmOpen(true);
  };

  const executeDeleteFaculty = async (facultyId: string, cityId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/faculties/${facultyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete faculty');
      }

      setCities(prev => prev.map(city => 
        city._id === cityId 
          ? { ...city, faculties: city.faculties.filter(faculty => faculty._id !== facultyId) }
          : city
      ));
    } catch (error: any) {
      setError(error.message || 'Greška pri brisanju fakulteta');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5m7-7l-7 7 7 7"/>
                </svg>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Material Management</h1>
                <p className="text-sm text-gray-600">Upravljanje gradovima i fakultetima</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant={showAIAnalysis ? "default" : "outline"}
                onClick={() => {
                  setShowAIAnalysis(!showAIAnalysis);
                  if (!showAIAnalysis) {
                    loadAIAnalysis();
                  }
                }}
                className={showAIAnalysis ? "bg-purple-600 hover:bg-purple-700 text-white" : "border-purple-300 text-purple-700 hover:bg-purple-50"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                {showAIAnalysis ? 'Sakrij AI Analizu' : 'AI Analiza TOC'}
              </Button>

              <Button
                variant={showSectionsPreview ? "default" : "outline"}
                onClick={() => {
                  setShowSectionsPreview(!showSectionsPreview);
                  if (!showSectionsPreview) {
                    loadSections();
                  }
                }}
                className={showSectionsPreview ? "bg-blue-600 hover:bg-blue-700 text-white" : "border-blue-300 text-blue-700 hover:bg-blue-50"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
                {showSectionsPreview ? 'Sakrij Sekcije' : 'Prikaži Sekcije'}
              </Button>

              <Dialog open={isAddCityModalOpen} onOpenChange={setIsAddCityModalOpen}>
                <Button 
                  className="bg-black hover:bg-gray-800 text-white"
                  onClick={() => setIsAddCityModalOpen(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                    <path d="M12 5v14m-7-7h14"/>
                  </svg>
                  Dodaj Grad
                </Button>
              <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Dodaj novi grad</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Unesite naziv novog grada
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cityName" className="text-sm font-medium text-gray-700">
                      Naziv grada
                    </label>
                    <Input
                      id="cityName"
                      value={newCityName}
                      onChange={(e) => setNewCityName(e.target.value)}
                      onKeyDown={handleCityInputKeyDown}
                      placeholder="Unesite naziv grada..."
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                      disabled={isAddingCity}
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
                      disabled={isAddingCity}
                      onClick={() => {
                        setIsAddCityModalOpen(false);
                        setNewCityName('');
                        setError('');
                      }}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      Otkaži
                    </Button>
                    <Button
                      onClick={handleAddCity}
                      disabled={isAddingCity || !newCityName.trim()}
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      {isAddingCity ? 'Dodavanje...' : 'Dodaj'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Analysis Display */}
        {showAIAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <Card className="bg-white shadow-lg border border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">AI TOC Analysis Results</h2>
                    <p className="text-sm text-gray-600">Rezultati AI analize table of contents</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadAIAnalysis}
                      disabled={loadingAIAnalysis}
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                        <path d="M21 3v5h-5"/>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                        <path d="M3 21v-5h5"/>
                      </svg>
                      {loadingAIAnalysis ? 'Učitavanje...' : 'Osvežava'}
                    </Button>
                  </div>
                </div>

                {loadingAIAnalysis ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : aiAnalysisResult && aiAnalysisResult.sections && aiAnalysisResult.sections.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">
                      AI Extracted Sections ({aiAnalysisResult.sections.length})
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                      <div className="space-y-3">
                        {aiAnalysisResult.sections.map((section, index) => (
                          <div
                            key={index}
                            className="bg-white p-4 rounded-md border border-gray-200 shadow-sm"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    section.level === 1 ? 'bg-blue-100 text-blue-800' :
                                    section.level === 2 ? 'bg-green-100 text-green-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    Level {section.level}
                                  </span>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {section.semanticType}
                                  </span>
                                </div>
                                <h4 className="font-medium text-gray-900 mb-1">{section.title}</h4>
                                <div className="text-xs text-gray-500 space-y-1">
                                  <p>Pages: {section.pageStart} - {section.pageEnd}</p>
                                  {section.parentSectionId && (
                                    <p>Parent Section: {section.parentSectionId}</p>
                                  )}
                                </div>
                              </div>
                              <div className="text-xs text-gray-400 ml-2">
                                #{index + 1}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Raw JSON Display */}
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-900 mb-2">Raw JSON Response</h3>
                      <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                          {JSON.stringify(aiAnalysisResult, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-4 text-gray-400">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No AI Analysis</h3>
                    <p className="text-gray-500">Process a document with AI to see analysis results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Sections Preview */}
        {showSectionsPreview && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <Card className="bg-white shadow-lg border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Document Sections Preview</h2>
                    <p className="text-sm text-gray-600">Izvučene sekcije iz PDF dokumenata za testiranje</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadSections}
                      disabled={loadingSections}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                        <path d="M21 3v5h-5"/>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                        <path d="M3 21v-5h5"/>
                      </svg>
                      {loadingSections ? 'Učitavanje...' : 'Osvežava'}
                    </Button>
                  </div>
                </div>

                {loadingSections ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : sections.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sections List */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Sekcije ({sections.length})</h3>
                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {sections.map((section, index) => (
                          <motion.div
                            key={section._id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedSectionIndex === index
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedSectionIndex(index)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{section.title}</h4>
                                <p className="text-xs text-gray-500 mt-1">
                                  Path: {section.path} | Level: {section.level} | Pages: {section.pageStart}-{section.pageEnd}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Characters: {section.charStart}-{section.charEnd} ({section.charEnd - section.charStart} chars)
                                </p>
                              </div>
                              <div className="text-xs text-gray-400 ml-2">
                                #{index + 1}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Section Content Preview */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">
                        Sadržaj sekcije {selectedSectionIndex !== null ? `#${selectedSectionIndex + 1}` : ''}
                      </h3>
                      {selectedSectionIndex !== null && sections[selectedSectionIndex] ? (
                        <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                          <div className="mb-3 pb-3 border-b border-gray-300">
                            <h4 className="font-medium text-gray-900">{sections[selectedSectionIndex].title}</h4>
                            <div className="text-xs text-gray-500 mt-1 space-y-1">
                              <p>Section ID: {sections[selectedSectionIndex].sectionId}</p>
                              <p>Path: {sections[selectedSectionIndex].path}</p>
                              <p>Level: {sections[selectedSectionIndex].level}</p>
                              <p>Pages: {sections[selectedSectionIndex].pageStart} - {sections[selectedSectionIndex].pageEnd}</p>
                              <p>Characters: {sections[selectedSectionIndex].charStart} - {sections[selectedSectionIndex].charEnd}</p>
                              <p>Content length: {sections[selectedSectionIndex].content.length} chars</p>
                            </div>
                          </div>
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                            {sections[selectedSectionIndex].content}
                          </pre>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-8 rounded-lg text-center">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-4 text-gray-400">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                          </svg>
                          <p className="text-gray-600">Izaberite sekciju da vidite njen sadržaj</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-4 text-gray-400">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Nema sekcija</h3>
                    <p className="text-gray-500">Dodajte PDF materijal i pokrenite obradu da vidite sekcije</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="space-y-8">
          <AnimatePresence>
            {cities.map((city, index) => (
              <motion.div 
                key={city._id} 
                className="bg-white rounded-xl shadow-lg border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
              {/* City Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{city.name}</h2>
                  
                  <div className="flex items-center gap-2">
                    <Dialog open={isAddFacultyModalOpen} onOpenChange={setIsAddFacultyModalOpen}>
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900"
                        onClick={() => {
                          setSelectedCityId(city._id);
                          setIsAddFacultyModalOpen(true);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                          <path d="M12 5v14m-7-7h14"/>
                        </svg>
                        Dodaj Fakultet
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 hover:text-red-900"
                        onClick={() => handleDeleteCity(city._id, city.name)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                          <path d="M3 6h18"/>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                        Obriši Grad
                      </Button>
                      <DialogContent className="sm:max-w-md bg-white">
                        <DialogHeader>
                          <DialogTitle className="text-gray-900">Dodaj novi fakultet</DialogTitle>
                          <DialogDescription className="text-gray-600">
                            Dodavanje fakulteta u grad: {city.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="facultyName" className="text-sm font-medium text-gray-700">
                              Naziv fakulteta
                            </label>
                            <Input
                              id="facultyName"
                              value={newFacultyName}
                              onChange={(e) => setNewFacultyName(e.target.value)}
                              onKeyDown={handleFacultyInputKeyDown}
                              placeholder="Unesite naziv fakulteta..."
                              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                              disabled={isAddingFaculty}
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
                              disabled={isAddingFaculty}
                              onClick={() => {
                                setIsAddFacultyModalOpen(false);
                                setNewFacultyName('');
                                setSelectedCityId('');
                                setError('');
                              }}
                              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            >
                              Otkaži
                            </Button>
                            <Button
                              onClick={handleAddFaculty}
                              disabled={isAddingFaculty || !newFacultyName.trim()}
                              className="bg-black hover:bg-gray-800 text-white"
                            >
                              {isAddingFaculty ? 'Dodavanje...' : 'Dodaj'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                  <Input
                    placeholder="Search"
                    value={searchTerms[city._id] || ''}
                    onChange={(e) => handleSearchChange(city._id, e.target.value)}
                    className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Faculties Grid */}
              <div className="p-6">
                {getFilteredFaculties(city).length > 0 ? (
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {getFilteredFaculties(city).map((faculty) => (
                        <motion.div
                          key={`${faculty._id}-${searchTerms[city._id] || 'all'}`}
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                          }}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, scale: 0.95 }}
                          whileHover={{ y: -4, transition: { duration: 0.2 } }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white hover:bg-white"
                          >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span 
                              className="font-medium text-gray-900 cursor-pointer hover:text-gray-700 flex-1"
                              onClick={() => handleFacultyClick(faculty._id)}
                            >
                              {faculty.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFaculty(faculty._id, faculty.name, city._id);
                                }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M3 6h18"/>
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                </svg>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                onClick={() => handleFacultyClick(faculty._id)}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M9 18l6-6-6-6"/>
                                </svg>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
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
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <p className="text-gray-600 mb-2">Nema fakulteta</p>
                        <p className="text-sm text-gray-500">Klikni 'Dodaj Fakultet' da dodaš prvi fakultet</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {cities.length === 0 && (
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
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Nema gradova</h3>
                  <p className="text-gray-500 mb-4">Počni sa dodavanjem prvog grada</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>

      {/* Faculty Modal */}
      {isFacultyModalOpen && selectedFacultyId && (
        <FacultyModal
          facultyId={selectedFacultyId}
          isOpen={isFacultyModalOpen}
          onClose={() => {
            setIsFacultyModalOpen(false);
            setSelectedFacultyId('');
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setDeleteItem(null);
        }}
        onConfirm={async () => {
          if (deleteItem) {
            if (deleteItem.type === 'city') {
              await executeDeleteCity(deleteItem.id);
            } else if (deleteItem.type === 'faculty') {
              await executeDeleteFaculty(deleteItem.id, deleteItem.cityId!);
            }
          }
          setDeleteConfirmOpen(false);
          setDeleteItem(null);
        }}
        title={`Obriši ${deleteItem?.type === 'city' ? 'grad' : 'fakultet'}`}
        description={`Da li ste sigurni da želite da obrišete ${deleteItem?.type === 'city' ? 'grad' : 'fakultet'} "${deleteItem?.name}"? ${deleteItem?.type === 'city' ? 'Ova akcija će obrisati i sve fakultete u gradu.' : 'Ova akcija će obrisati i sve smerove i predmete fakulteta.'}`}
        confirmText="Obriši"
        cancelText="Otkaži"
      />
    </div>
  );
};

export default MaterialManagement;