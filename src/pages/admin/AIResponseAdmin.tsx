import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/admin/AdminAuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
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

interface Department {
  _id: string;
  name: string;
  facultyId: string;
  availableYears: number[];
}

interface Subject {
  _id: string;
  name: string;
  facultyId: string;
  departmentId: string;
  year: number;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  mode?: string;
  context?: {
    facultyName?: string;
    departmentName?: string;
    year?: number;
    subjectName?: string;
  };
}

type AIMode = 'explain' | 'learn' | 'test' | 'summary' | 'solve';

interface AIModeConfig {
  value: AIMode;
  label: string;
  description: string;
  icon: string;
  color: string;
}

const AIResponseAdmin: React.FC = () => {
  const { admin, isAuthenticated, isLoading: authLoading } = useAdminAuth();
  
  // Selection states
  const [cities, setCities] = useState<City[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  
  // AI Mode states
  const [selectedMode, setSelectedMode] = useState<AIMode>('explain');
  
  // Chat states
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoadingMessage] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Loading states
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingFaculties, setLoadingFaculties] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // AI Mode configurations
  const aiModes: AIModeConfig[] = [
    {
      value: 'explain',
      label: 'Objasni',
      description: 'AI objašnjava koncept detaljno sa primerima',
      icon: '💡',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      value: 'learn',
      label: 'Uči',
      description: 'Interaktivno učenje kroz pitanja i odgovore',
      icon: '🎓',
      color: 'text-green-600 bg-green-50'
    },
    {
      value: 'test',
      label: 'Testovi',
      description: 'Generiše pitanja za testiranje znanja',
      icon: '📝',
      color: 'text-red-600 bg-red-50'
    },
    {
      value: 'summary',
      label: 'Sažmi',
      description: 'Pravi kratke sažetke kompleksnih tema',
      icon: '📋',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      value: 'solve',
      label: 'Reši',
      description: 'Rešava probleme i zadatke korak po korak',
      icon: '⚡',
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load cities on component mount
  useEffect(() => {
    loadCities();
  }, []);

  // Load chat history when context changes
  useEffect(() => {
    if (selectedSubject && selectedFaculty && selectedDepartment && selectedYear) {
      // Clear current chat when context changes
      setMessages([]);
      setSessionId('');
      
      // Generate new session ID and try to load existing history
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      loadChatHistory();
    } else {
      // Clear chat when context is incomplete
      setMessages([]);
      setSessionId('');
    }
  }, [selectedSubject, selectedFaculty, selectedDepartment, selectedYear]);

  const loadCities = async () => {
    setLoadingCities(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/cities`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCities(data.cities || []);
      }
    } catch (error) {
      console.error('Error loading cities:', error);
    } finally {
      setLoadingCities(false);
    }
  };

  const loadFaculties = async (cityId: string) => {
    setLoadingFaculties(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/faculties?cityId=${cityId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFaculties(data.faculties || []);
      }
    } catch (error) {
      console.error('Error loading faculties:', error);
    } finally {
      setLoadingFaculties(false);
    }
  };

  const loadDepartments = async (facultyId: string) => {
    setLoadingDepartments(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/materials/departments?facultyId=${facultyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDepartments(data.departments || []);
      }
    } catch (error) {
      console.error('Error loading departments:', error);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const loadSubjects = async (facultyId: string, departmentId: string, year: number) => {
    setLoadingSubjects(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/materials/subjects?facultyId=${facultyId}&departmentId=${departmentId}&year=${year}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSubjects(data.subjects || []);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setLoadingSubjects(false);
    }
  };

  // Selection handlers
  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
    setSelectedFaculty('');
    setSelectedDepartment('');
    setSelectedYear(null);
    setSelectedSubject('');
    setFaculties([]);
    setDepartments([]);
    setSubjects([]);
    setAvailableYears([]);
    
    if (cityId) {
      loadFaculties(cityId);
    }
  };

  const handleFacultyChange = (facultyId: string) => {
    setSelectedFaculty(facultyId);
    setSelectedDepartment('');
    setSelectedYear(null);
    setSelectedSubject('');
    setDepartments([]);
    setSubjects([]);
    setAvailableYears([]);
    
    if (facultyId) {
      loadDepartments(facultyId);
    }
  };

  const handleDepartmentChange = (departmentId: string) => {
    setSelectedDepartment(departmentId);
    setSelectedYear(null);
    setSelectedSubject('');
    setSubjects([]);
    
    const department = departments.find(d => d._id === departmentId);
    if (department) {
      setAvailableYears(department.availableYears);
    }
  };

  const handleYearChange = (year: string) => {
    const yearNum = parseInt(year);
    setSelectedYear(yearNum);
    setSelectedSubject('');
    setSubjects([]);
    
    if (selectedFaculty && selectedDepartment && yearNum) {
      loadSubjects(selectedFaculty, selectedDepartment, yearNum);
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
  };

  // Load chat history for current context
  const loadChatHistory = async () => {
    if (!sessionId) return;
    
    setLoadingHistory(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ai/chat/history/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const chatHistory = data.data;
          const loadedMessages: ChatMessage[] = chatHistory.messages.map((msg: any) => ({
            id: msg.id,
            type: msg.type,
            content: msg.content,
            timestamp: new Date(msg.timestamp),
            mode: msg.mode,
            context: msg.sources ? {
              subjectName: subjects.find(s => s._id === selectedSubject)?.name,
              facultyName: faculties.find(f => f._id === selectedFaculty)?.name,
              departmentName: departments.find(d => d._id === selectedDepartment)?.name,
              year: selectedYear
            } : undefined
          }));
          setMessages(loadedMessages);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Generate session ID for current context
  const generateSessionId = () => {
    if (!selectedSubject || !selectedFaculty || !selectedDepartment || !selectedYear) return '';
    return `admin_${selectedSubject}_${selectedFaculty}_${selectedDepartment}_${selectedYear}_${Date.now()}`;
  };

  // Save messages manually when AI endpoint fails
  const saveMessagesManually = async (sessionId: string, userMessage: ChatMessage, aiMessage: ChatMessage) => {
    try {
      // First, create or get the session
      const createSessionResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/ai/chat/history/${sessionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      // If session doesn't exist, we need to create it by making sure the context is set
      // The backend will auto-create session when we try to save messages

      // Save user message
      const userSaveResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/ai/chat/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({
          sessionId: sessionId,
          type: 'user',
          content: userMessage.content,
          mode: userMessage.mode,
          context: {
            subjectId: selectedSubject,
            facultyId: selectedFaculty,
            departmentId: selectedDepartment,
            year: selectedYear,
          }
        }),
      });

      // Save AI message  
      const aiSaveResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/ai/chat/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({
          sessionId: sessionId,
          type: 'ai',
          content: aiMessage.content,
          mode: userMessage.mode,
          context: {
            subjectId: selectedSubject,
            facultyId: selectedFaculty,
            departmentId: selectedDepartment,
            year: selectedYear,
          }
        }),
      });

      if (userSaveResponse.ok && aiSaveResponse.ok) {
        console.log('Messages saved manually to database');
      } else {
        console.error('Failed to save messages manually');
      }
    } catch (error) {
      console.error('Error saving messages manually:', error);
    }
  };

  // Chat functionality
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Check if context is complete
    if (!selectedSubject || !selectedFaculty || !selectedDepartment || !selectedYear) {
      // Show error message for incomplete context
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'ai',
        content: 'Molim vas odaberite kompletnu kontekst informaciju (grad, fakultet, smer, godinu i predmet) pre slanja poruke.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, {
        id: `user-${Date.now()}`,
        type: 'user',
        content: inputMessage.trim(),
        timestamp: new Date(),
        mode: selectedMode
      }, errorMessage]);
      setInputMessage('');
      return;
    }

    // Generate session ID if not exists
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = generateSessionId();
      setSessionId(currentSessionId);
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
      mode: selectedMode,
      context: selectedSubject ? {
        facultyName: faculties.find(f => f._id === selectedFaculty)?.name,
        departmentName: departments.find(d => d._id === selectedDepartment)?.name,
        year: selectedYear || undefined,
        subjectName: subjects.find(s => s._id === selectedSubject)?.name,
      } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoadingMessage(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({
          message: userMessage.content,
          mode: selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1),
          sessionId: currentSessionId,
          context: {
            subjectId: selectedSubject,
            facultyId: selectedFaculty,
            departmentId: selectedDepartment,
            year: selectedYear,
          }
        }),
      });

      let aiResponse = '';
      let responseSessionId = currentSessionId;
      let messagesSavedAutomatically = false;
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          aiResponse = data.data.message || 'AI odgovor nije dostupan.';
          responseSessionId = data.data.sessionId || currentSessionId;
          setSessionId(responseSessionId);
          messagesSavedAutomatically = true; // Backend je automatically čuvao poruke
        } else {
          aiResponse = 'Greška pri dobijanju AI odgovora.';
        }
      } else {
        // Fallback response
        const selectedModeConfig = aiModes.find(mode => mode.value === selectedMode);
        aiResponse = `Greška pri komunikaciji sa AI sistemom. Backend endpoint možda nije dostupan.\n\nZahtevan mod: ${selectedModeConfig?.label} ${selectedModeConfig?.icon}\nPitanje: "${userMessage.content}"`;
      }

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        context: userMessage.context
      };

      setMessages(prev => [...prev, aiMessage]);

      // Ako backend nije automatski sačuvao poruke, sačuvaj ih ručno
      if (!messagesSavedAutomatically) {
        await saveMessagesManually(currentSessionId, userMessage, aiMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback mock response
      const errorMessage: ChatMessage = {
        id: `ai-error-${Date.now()}`,
        type: 'ai',
        content: 'Izvinjavam se, došlo je do greške pri komunikaciji sa AI sistemom. Ovo je mock odgovor koji pokazuje da frontend funkcionalnost radi.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);

      // Sačuvaj poruke i u slučaju potpunog network error-a
      try {
        await saveMessagesManually(currentSessionId, userMessage, errorMessage);
      } catch (saveError) {
        console.error('Error saving messages manually:', saveError);
      }
    } finally {
      setIsLoadingMessage(false);
    }
  };

  const clearChat = async () => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ai/chat/clear/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        setMessages([]);
        // Reset session ID to start fresh
        setSessionId('');
        // Show success message (optional)
        console.log('Chat history cleared successfully');
      } else {
        console.error('Failed to clear chat history');
        // Still clear local messages even if backend fails
        setMessages([]);
        setSessionId('');
      }
    } catch (error) {
      console.error('Error clearing chat:', error);
      // Still clear local messages even if backend fails
      setMessages([]);
      setSessionId('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Get current context info
  const getContextInfo = () => {
    const context = [];
    if (selectedCity) {
      const city = cities.find(c => c._id === selectedCity);
      if (city) context.push(`Grad: ${city.name}`);
    }
    if (selectedFaculty) {
      const faculty = faculties.find(f => f._id === selectedFaculty);
      if (faculty) context.push(`Fakultet: ${faculty.name}`);
    }
    if (selectedDepartment) {
      const department = departments.find(d => d._id === selectedDepartment);
      if (department) context.push(`Smer: ${department.name}`);
    }
    if (selectedYear) {
      context.push(`Godina: ${selectedYear}`);
    }
    if (selectedSubject) {
      const subject = subjects.find(s => s._id === selectedSubject);
      if (subject) context.push(`Predmet: ${subject.name}`);
    }
    return context;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M9 19c-5 0-7-2-7-5v-4c0-3 2-5 7-5 2 0 3.5.5 4.5 1.5C16 8.5 17.5 10 17.5 12s-1.5 3.5-4 2.5c-1-0.5-2.5-1-4.5-1z"/>
                  <path d="M15 9.5c.5-1 1.5-1.5 2.5-1.5 3 0 5 2 5 5s-2 5-5 5c-1 0-2-.5-2.5-1.5"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Response Admin</h1>
                <p className="text-sm text-gray-600">Test AI funkcionalnost</p>
              </div>
            </div>

            <Button
              onClick={() => window.history.back()}
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              ← Nazad na Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
          
          {/* Left Panel - Context Selection */}
          <div className="lg:col-span-1">
            <Card className="h-full border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  Odaberi kontekst
                </CardTitle>
                <CardDescription>
                  Odaberite fakultet, smer, godinu i predmet za AI chat
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* AI Mode Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">AI Mod</label>
                  <Select value={selectedMode} onValueChange={(value: AIMode) => setSelectedMode(value)}>
                    <SelectTrigger className="w-full text-black">
                      <SelectValue placeholder="Izaberite AI mod">
                        <div className="flex items-center gap-2">
                          <span>{aiModes.find(mode => mode.value === selectedMode)?.icon}</span>
                          <span>{aiModes.find(mode => mode.value === selectedMode)?.label}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-gray-50">
                      {aiModes.map((mode) => (
                        <SelectItem 
                          key={mode.value} 
                          value={mode.value} 
                          className="text-black hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black"
                        >
                          <div className="flex items-start gap-3 py-1">
                            <span className="text-lg">{mode.icon}</span>
                            <div className="flex flex-col">
                              <span className="font-medium">{mode.label}</span>
                              <span className="text-xs text-gray-600 mt-0.5">{mode.description}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Current AI Mode Info */}
                <div className="p-3 rounded-lg border-2" style={{
                  borderColor: selectedMode === 'explain' ? '#3b82f6' : 
                               selectedMode === 'learn' ? '#10b981' :
                               selectedMode === 'test' ? '#ef4444' :
                               selectedMode === 'summary' ? '#8b5cf6' : '#f97316',
                  backgroundColor: selectedMode === 'explain' ? '#eff6ff' : 
                                  selectedMode === 'learn' ? '#ecfdf5' :
                                  selectedMode === 'test' ? '#fef2f2' :
                                  selectedMode === 'summary' ? '#f5f3ff' : '#fff7ed'
                }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{aiModes.find(mode => mode.value === selectedMode)?.icon}</span>
                    <span className="font-medium text-gray-900">
                      {aiModes.find(mode => mode.value === selectedMode)?.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {aiModes.find(mode => mode.value === selectedMode)?.description}
                  </p>
                </div>

                {/* City Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Grad</label>
                  <Select value={selectedCity} onValueChange={handleCityChange}>
                    <SelectTrigger className="w-full text-black">
                      <SelectValue placeholder={loadingCities ? "Učitavam gradove..." : "Izaberite grad"} />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-50">
                      {cities.map((city) => (
                        <SelectItem key={city._id} value={city._id} className="text-black hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black">
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Faculty Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Fakultet</label>
                  <Select value={selectedFaculty} onValueChange={handleFacultyChange} disabled={!selectedCity}>
                    <SelectTrigger className="w-full text-black">
                      <SelectValue placeholder={loadingFaculties ? "Učitavam fakultete..." : "Izaberite fakultet"} />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-50">
                      {faculties.map((faculty) => (
                        <SelectItem key={faculty._id} value={faculty._id} className="text-black hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black">
                          {faculty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Department Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Smer</label>
                  <Select value={selectedDepartment} onValueChange={handleDepartmentChange} disabled={!selectedFaculty}>
                    <SelectTrigger className="w-full text-black">
                      <SelectValue placeholder={loadingDepartments ? "Učitavam smerove..." : "Izaberite smer"} />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-50">
                      {departments.map((department) => (
                        <SelectItem key={department._id} value={department._id} className="text-black hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black">
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Year Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Godina studija</label>
                  <Select value={selectedYear?.toString() || ''} onValueChange={handleYearChange} disabled={!selectedDepartment}>
                    <SelectTrigger className="w-full text-black">
                      <SelectValue placeholder="Izaberite godinu" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-50">
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year.toString()} className="text-black hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black">
                          {year}. godina
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Predmet</label>
                  <Select value={selectedSubject} onValueChange={handleSubjectChange} disabled={!selectedYear}>
                    <SelectTrigger className="w-full text-black">
                      <SelectValue placeholder={loadingSubjects ? "Učitavam predmete..." : "Izaberite predmet"} />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-50">
                      {subjects.map((subject) => (
                        <SelectItem key={subject._id} value={subject._id} className="text-black hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black">
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Current Context */}
                {getContextInfo().length > 0 && (
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="text-sm font-medium text-purple-900 mb-2">Trenutni kontekst:</h4>
                    <div className="space-y-1">
                      {getContextInfo().map((info, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                          {info}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-full border-0 shadow-lg bg-white/80 backdrop-blur-sm flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      AI Chat Test
                    </CardTitle>
                    <CardDescription>
                      Testirajte AI funkcionalnost sa odabranim kontekstom
                    </CardDescription>
                  </div>
                  <Button
                    onClick={clearChat}
                    variant="outline"
                    size="sm"
                    className="text-gray-600 hover:text-red-600"
                  >
                    Očisti chat
                  </Button>
                </div>
              </CardHeader>

              {/* Chat Messages */}
              <CardContent className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                  <AnimatePresence>
                    {loadingHistory ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-gray-500 py-12"
                      >
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p>Učitavam istoriju chat-a...</p>
                      </motion.div>
                    ) : messages.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-gray-500 py-12"
                      >
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 text-gray-300">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        <p>Počnite razgovor sa AI-jem...</p>
                        <p className="text-sm mt-2">Odaberite kontekst levo i započnite chat</p>
                      </motion.div>
                    ) : (
                      messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-3 ${
                              message.type === 'user'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-900 border'
                            }`}
                          >
                            <div className="whitespace-pre-wrap text-sm">
                              {message.content}
                            </div>
                            <div
                              className={`text-xs mt-2 ${
                                message.type === 'user' ? 'text-purple-200' : 'text-gray-500'
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString('sr-RS', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                              {message.mode && (
                                <span className="ml-2">• {aiModes.find(mode => mode.value === message.mode)?.icon} {aiModes.find(mode => mode.value === message.mode)?.label}</span>
                              )}
                              {message.context && message.context.subjectName && (
                                <span className="ml-2">• {message.context.subjectName}</span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 text-gray-900 border rounded-lg px-4 py-3 max-w-[80%]">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                          <span className="text-sm text-gray-500">AI razmišlja...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="flex-shrink-0 border-t pt-4">
                  <div className="flex gap-2">
                    <Textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Unesite poruku za AI..."
                      className="flex-1 min-h-[80px] max-h-[120px] resize-none text-black"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                      </svg>
                    </Button>
                  </div>
                  
                  {!selectedSubject && (
                    <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      Preporučuje se da odaberete predmet za bolji kontekst AI odgovora
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIResponseAdmin;