import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/admin/AdminAuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import FacultyModal from './FacultyModal';

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

  const handleDeleteCity = async (cityId: string, cityName: string) => {
    if (!window.confirm(`Da li ste sigurni da želite da obrišete grad "${cityName}"? Ova akcija će obrisati i sve fakultete u gradu.`)) {
      return;
    }

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

  const handleFacultyClick = (facultyId: string) => {
    setSelectedFacultyId(facultyId);
    setIsFacultyModalOpen(true);
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
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Dodaj novi grad</DialogTitle>
                  <DialogDescription>
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
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {cities.map((city) => (
            <div key={city._id} className="bg-white rounded-xl shadow-lg border border-gray-200">
              {/* City Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{city.name}</h2>
                  
                  <div className="flex items-center gap-2">
                    <Dialog open={isAddFacultyModalOpen} onOpenChange={setIsAddFacultyModalOpen}>
                      <Button
                        variant="outline"
                        className="border-gray-200 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700"
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
                        className="border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                        onClick={() => handleDeleteCity(city._id, city.name)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                          <path d="M3 6h18"/>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                        Obriši Grad
                      </Button>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Dodaj novi fakultet</DialogTitle>
                          <DialogDescription>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {getFilteredFaculties(city).map((faculty) => (
                      <Card
                        key={faculty._id}
                        className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white hover:bg-white"
                        onClick={() => handleFacultyClick(faculty._id)}
                      >
                        <CardContent className="p-4 flex items-center justify-between">
                          <span className="font-medium text-gray-900">{faculty.name}</span>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-gray-400"
                          >
                            <path d="M9 18l6-6-6-6"/>
                          </svg>
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
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <p className="text-gray-600 mb-2">Nema fakulteta</p>
                      <p className="text-sm text-gray-500">Klikni 'Dodaj Fakultet' da dodaš prvi fakultet</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ))}

          {cities.length === 0 && (
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
    </div>
  );
};

export default MaterialManagement;