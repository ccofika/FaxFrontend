import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services';
import styles from './Home.module.css';
import { TooltipProvider } from '../components/ui/tooltip';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

type ChatMode = 'explain' | 'solve' | 'summary' | 'tests' | 'learning';

interface Lesson {
  id: string;
  title: string;
  description: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  faculty: string;
  year: number;
  semester: number;
  lessons: Lesson[];
}

interface SelectedContent {
  subject: Subject;
  lessons: Lesson[];
}

interface ModeConfig {
  id: ChatMode;
  name: string;
  description: string;
  color: string;
}

const chatModes: ModeConfig[] = [
  { id: 'explain', name: 'Explain', description: 'Get detailed explanations', color: '#4E3CFA' },
  { id: 'solve', name: 'Solve', description: 'Find solutions to problems', color: '#F59E0B' },
  { id: 'summary', name: 'Summary', description: 'Get concise summaries', color: '#10B981' },
  { id: 'tests', name: 'Tests', description: 'Generate tests and quizzes', color: '#EF4444' },
  { id: 'learning', name: 'Learning', description: 'Interactive learning assistance', color: '#3B82F6' },
];

// Demo data - filter by user's faculty, year, semester in real implementation
const demoSubjects: Subject[] = [
  // Elektrotehnički fakultet
  {
    id: 'math1',
    name: 'Matematika 1',
    code: 'MAT101',
    faculty: 'Elektrotehnički fakultet',
    year: 1,
    semester: 1,
    lessons: [
      { id: 'l1', title: 'Funkcije i njihove osobine', description: 'Uvod u matematičke funkcije' },
      { id: 'l2', title: 'Granične vrednosti', description: 'Računanje graničnih vrednosti funkcija' },
      { id: 'l3', title: 'Izvodi funkcija', description: 'Osnove diferencijacije' },
      { id: 'l4', title: 'Integrali', description: 'Neodređeni i određeni integrali' },
      { id: 'l5', title: 'Diferencijalne jednačine', description: 'Rešavanje osnovnih diferencijalnih jednačina' }
    ]
  },
  {
    id: 'prog1',
    name: 'Programiranje 1',
    code: 'PROG101',
    faculty: 'Elektrotehnički fakultet',
    year: 1,
    semester: 1,
    lessons: [
      { id: 'p1', title: 'Uvod u programiranje', description: 'Osnovi algoritma i programiranja' },
      { id: 'p2', title: 'Promenljive i tipovi podataka', description: 'Rad sa osnovnim tipovima podataka' },
      { id: 'p3', title: 'Kontrola toka', description: 'If-else, switch, petlje' },
      { id: 'p4', title: 'Funkcije', description: 'Definisanje i korišćenje funkcija' },
      { id: 'p5', title: 'Nizovi', description: 'Jednodimenzioni i višedimenzioni nizovi' }
    ]
  },
  {
    id: 'phys1',
    name: 'Fizika 1',
    code: 'FIZ101',
    faculty: 'Elektrotehnički fakultet',
    year: 1,
    semester: 2,
    lessons: [
      { id: 'f1', title: 'Kinematika', description: 'Kretanje tela u prostoru' },
      { id: 'f2', title: 'Dinamika', description: 'Njutnovi zakoni' },
      { id: 'f3', title: 'Rad i energija', description: 'Kinetička i potencijalna energija' },
      { id: 'f4', title: 'Oscilacije', description: 'Harmonijske oscilacije' }
    ]
  },
  {
    id: 'struct1',
    name: 'Strukture podataka',
    code: 'STP201',
    faculty: 'Elektrotehnički fakultet',
    year: 2,
    semester: 1,
    lessons: [
      { id: 's1', title: 'Liste', description: 'Jednostruko i dvostruko povezane liste' },
      { id: 's2', title: 'Stekovi i redovi', description: 'LIFO i FIFO strukture' },
      { id: 's3', title: 'Stabla', description: 'Binarna stabla i AVL stabla' },
      { id: 's4', title: 'Hash tabele', description: 'Algoritmi heširanja' }
    ]
  },
  
  // Fakultet organizacionih nauka
  {
    id: 'info_sys1',
    name: 'Informacioni sistemi 1',
    code: 'IS101',
    faculty: 'Fakultet organizacionih nauka',
    year: 1,
    semester: 1,
    lessons: [
      { id: 'is1', title: 'Uvod u informacione sisteme', description: 'Osnovi IS i njihova uloga' },
      { id: 'is2', title: 'Modelovanje sistema', description: 'UML dijagrami i modelovanje' },
      { id: 'is3', title: 'Baze podataka', description: 'Relacione baze i SQL' },
      { id: 'is4', title: 'Sistemska analiza', description: 'Analiza zahteva sistema' }
    ]
  },
  {
    id: 'management1',
    name: 'Osnove menadžmenta',
    code: 'MNG101',
    faculty: 'Fakultet organizacionih nauka',
    year: 1,
    semester: 1,
    lessons: [
      { id: 'm1', title: 'Funkcije menadžmenta', description: 'Planiranje, organizovanje, vođenje, kontrola' },
      { id: 'm2', title: 'Organizacione strukture', description: 'Tipovi organizacionih struktura' },
      { id: 'm3', title: 'Liderstvo', description: 'Stilovi liderstva i motivacija' },
      { id: 'm4', title: 'Donošenje odluka', description: 'Proces donošenja odluka' }
    ]
  },

  // Ekonomski fakultet
  {
    id: 'microecon1',
    name: 'Mikroekonomija',
    code: 'ECON101',
    faculty: 'Ekonomski fakultet',
    year: 1,
    semester: 1,
    lessons: [
      { id: 'me1', title: 'Ponuda i tražnja', description: 'Osnovi tržišnih mehanizama' },
      { id: 'me2', title: 'Elastičnost', description: 'Cenovne i dohodovne elastičnosti' },
      { id: 'me3', title: 'Teorija potrošnje', description: 'Korisnost i potrošačko ponašanje' },
      { id: 'me4', title: 'Teorija proizvodnje', description: 'Proizvodni faktori i troškovi' }
    ]
  },
  {
    id: 'accounting1',
    name: 'Osnove računovodstva',
    code: 'ACC101',
    faculty: 'Ekonomski fakultet',
    year: 1,
    semester: 1,
    lessons: [
      { id: 'ac1', title: 'Računovodstvena jednačina', description: 'Aktiva = Pasiva + Kapital' },
      { id: 'ac2', title: 'Dvostruko knjigovodstvo', description: 'Duguje i Potražuje' },
      { id: 'ac3', title: 'Bilans stanja', description: 'Struktura i analiza bilansa' },
      { id: 'ac4', title: 'Bilans uspeha', description: 'Prihodi i rashodi' }
    ]
  }
];


const Home: React.FC = () => {
  const { user, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [selectedMode, setSelectedMode] = useState<ChatMode>('explain');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{top: number, left: number, width: number}>({top: 0, left: 0, width: 0});
  const modeButtonRef = React.useRef<HTMLButtonElement>(null);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<SelectedContent | null>(null);
  const [modalStep, setModalStep] = useState<'subject' | 'lessons'>('subject');
  const [tempSelectedSubject, setTempSelectedSubject] = useState<Subject | null>(null);
  const [tempSelectedLessons, setTempSelectedLessons] = useState<Lesson[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [isLoadingRecentChats, setIsLoadingRecentChats] = useState(false);
  const maxChars = 1000;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setMessage(value);
      setCharCount(value.length);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isCreatingChat) return;

    try {
      setIsCreatingChat(true);

      // Generate chat title from message
      const title = chatService.generateChatTitle(message.trim(), selectedMode);

      // Prepare chat data
      const chatData = {
        title,
        mode: selectedMode,
        subject: selectedContent?.subject ? {
          id: selectedContent.subject.id,
          name: selectedContent.subject.name,
          code: selectedContent.subject.code,
          faculty: selectedContent.subject.faculty
        } : undefined,
        lessons: selectedContent?.lessons || [],
        initialMessage: message.trim()
      };

      // Create chat
      const response = await chatService.createChat(chatData);
      
      // Navigate to the new chat
      navigate(`/chat/${response.chat.id}`);
      
      // Clear form
      setMessage('');
      setCharCount(0);
      setSelectedContent(null);
    } catch (error) {
      console.error('Error creating chat:', error);
      // You might want to show an error notification here
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleModeSelect = (mode: ChatMode) => {
    setSelectedMode(mode);
    setShowModeDropdown(false);
  };

  const handleModeButtonClick = () => {
    if (!showModeDropdown && modeButtonRef.current) {
      const rect = modeButtonRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 250; // Estimated height
      
      let top = rect.bottom + 8; // Default to below
      
      // If not enough space below, show above
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        top = rect.top - dropdownHeight - 8;
      }
      
      setDropdownPosition({
        top: top,
        left: rect.left,
        width: rect.width
      });
    }
    setShowModeDropdown(!showModeDropdown);
  };

  const handleOpenSubjectModal = () => {
    setShowSubjectModal(true);
    setModalStep('subject');
    setTempSelectedSubject(null);
    setTempSelectedLessons([]);
    setShowModeDropdown(false); // Close mode dropdown when modal opens
  };

  const handleCloseSubjectModal = () => {
    setShowSubjectModal(false);
    setModalStep('subject');
    setTempSelectedSubject(null);
    setTempSelectedLessons([]);
  };

  const handleSubjectSelect = (subject: Subject) => {
    setTempSelectedSubject(subject);
    setModalStep('lessons');
    setTempSelectedLessons([]);
  };

  const handleLessonToggle = (lesson: Lesson) => {
    setTempSelectedLessons(prev => {
      const isSelected = prev.some(l => l.id === lesson.id);
      if (isSelected) {
        return prev.filter(l => l.id !== lesson.id);
      } else {
        return [...prev, lesson];
      }
    });
  };

  const handleConfirmSelection = () => {
    if (tempSelectedSubject && tempSelectedLessons.length > 0) {
      setSelectedContent({
        subject: tempSelectedSubject,
        lessons: tempSelectedLessons
      });
      handleCloseSubjectModal();
    }
  };

  const handleBackToSubjects = () => {
    setModalStep('subject');
    setTempSelectedSubject(null);
    setTempSelectedLessons([]);
  };

  const selectedModeConfig = chatModes.find(mode => mode.id === selectedMode);
  const isInputEmpty = message.trim().length === 0;

  // Load user profile data and filter subjects
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          await fetchProfile();
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      }
    };
    
    loadData();
  }, []);

  // Filter subjects based on user's faculty and academic year
  useEffect(() => {
    if (user?.faculty && user?.academicYear) {
      const userYear = parseInt(user.academicYear.match(/\d+/)?.[0] || '1');
      const filtered = demoSubjects.filter(subject => 
        subject.faculty === user.faculty && subject.year === userYear
      );
      setFilteredSubjects(filtered);
    } else {
      // If no user data, show all subjects
      setFilteredSubjects(demoSubjects);
    }
  }, [user?.faculty, user?.academicYear]);

  // Close dropdown when clicking outside or on scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if click is on the mode button or dropdown
      if (modeButtonRef.current && !modeButtonRef.current.contains(target) && 
          !target.closest('[data-dropdown="mode-dropdown"]')) {
        setShowModeDropdown(false);
      }
    };

    const handleScroll = () => {
      if (showModeDropdown) {
        setShowModeDropdown(false);
      }
    };

    if (showModeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [showModeDropdown]);

  // Helper function to get user's display name
  const getUserDisplayName = (): string => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.username) {
      return user.username;
    }
    return 'Korisnik';
  };

  // Helper function to get personalized greeting based on time of day
  const getPersonalizedGreeting = (): string => {
    const hour = new Date().getHours();
    const name = getUserDisplayName();
    
    if (hour < 12) {
      return `Dobro jutro, ${name}!`;
    } else if (hour < 18) {
      return `Dobar dan, ${name}!`;
    } else {
      return `Dobro veče, ${name}!`;
    }
  };

  // Helper function to get personalized subtitle
  const getPersonalizedSubtitle = (): string => {
    if (user?.faculty) {
      const facultyShort = user.faculty.replace('Fakultet', '').trim();
      const year = user.academicYear || 'godina';
      return `${facultyShort} • ${year} • Spremni za učenje?`;
    }
    return 'Šta želite da naučite danas?';
  };

  // Helper function to format chat timestamp
  const formatChatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Pre manje od sata';
    if (diffHours < 24) return `Pre ${diffHours} ${diffHours === 1 ? 'sat' : 'sati'}`;
    if (diffDays === 1) return 'Juče';
    if (diffDays < 7) return `Pre ${diffDays} dana`;
    return date.toLocaleDateString('sr-RS');
  };

  // Load recent chats
  useEffect(() => {
    const loadRecentChats = async () => {
      if (!user) return;
      
      try {
        setIsLoadingRecentChats(true);
        const response = await chatService.getUserChats(1, 3); // Get first 3 chats
        setRecentChats(response.chats);
      } catch (error) {
        console.error('Error loading recent chats:', error);
      } finally {
        setIsLoadingRecentChats(false);
      }
    };

    loadRecentChats();
  }, [user]);

  return (
    <TooltipProvider>
      <div className="w-full min-h-screen relative overflow-hidden bg-[#0B0F1A] text-white font-sans">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4E3CFA]/3 via-[#0B0F1A] to-[#4E3CFA]/1 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(2px_2px_at_20px_30px,rgba(78,60,250,0.3),transparent),radial-gradient(2px_2px_at_40px_70px,rgba(78,60,250,0.2),transparent)] bg-repeat bg-[length:150px_150px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-20 mt-16">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-br from-white via-white/90 to-white/70 bg-clip-text text-transparent leading-tight mb-3">
              {getPersonalizedGreeting()}
            </h1>
            <p className="text-base font-medium text-gray-400/80 max-w-xl mx-auto leading-relaxed">
              {getPersonalizedSubtitle()}
            </p>
          </div>

          {/* Input Section */}
          <div className="mb-16 flex justify-center">
            <div className={`w-full max-w-3xl bg-white/5 border backdrop-blur-xl rounded-2xl overflow-visible transition-all duration-300 hover:shadow-2xl relative ${
              selectedMode === 'explain' ? 'border-[#4E3CFA]/20 shadow-xl shadow-[#4E3CFA]/20 hover:border-[#4E3CFA]/40' :
              selectedMode === 'solve' ? 'border-orange-500/20 shadow-xl shadow-orange-500/20 hover:border-orange-500/40' :
              selectedMode === 'summary' ? 'border-green-500/20 shadow-xl shadow-green-500/20 hover:border-green-500/40' :
              selectedMode === 'tests' ? 'border-red-500/20 shadow-xl shadow-red-500/20 hover:border-red-500/40' :
              selectedMode === 'learning' ? 'border-blue-500/20 shadow-xl shadow-blue-500/20 hover:border-blue-500/40' :
              'border-[#4E3CFA]/20 shadow-xl shadow-[#4E3CFA]/20 hover:border-[#4E3CFA]/40'
            }`}>
              <textarea
                className="w-full min-h-[120px] p-6 bg-transparent text-white placeholder:text-gray-400 resize-none outline-none text-lg leading-relaxed rounded-tl-2xl rounded-tr-2xl"
                placeholder="Postavite pitanje ili opišite problem koji vas zanima..."
                value={message}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              <div className="flex justify-between items-center p-6 bg-white/5 border-t border-white/10 gap-4 flex-wrap rounded-b-2xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <button 
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-gray-400 hover:text-white transition-all duration-300 min-w-32 max-w-48"
                    onClick={handleOpenSubjectModal}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                    {selectedContent ? (
                      <span className="text-sm font-medium truncate">
                        {selectedContent.subject.name} ({selectedContent.lessons.length} lekcija)
                      </span>
                    ) : (
                      <span className="text-sm font-medium">Izaberi predmet</span>
                    )}
                  </button>
                  <div className="relative">
                    <button 
                      ref={modeButtonRef}
                      className={`flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-[#4E3CFA]/30 rounded-xl text-white font-medium transition-all duration-300 min-w-24 ${showModeDropdown ? 'bg-[#4E3CFA]/10 border-[#4E3CFA]/30' : ''}`}
                      onClick={handleModeButtonClick}
                    >
                      <span className="text-sm">{selectedModeConfig?.name}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6,9 12,15 18,9"/>
                      </svg>
                    </button>
                  </div>
                  
                  <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 hover:border-[#4E3CFA]/30 rounded-lg text-gray-400 hover:text-white transition-all duration-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                    </svg>
                    <span className="text-sm font-medium">Attachment</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 hover:border-[#4E3CFA]/30 rounded-lg text-gray-400 hover:text-white transition-all duration-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21,15 16,10 5,21"/>
                    </svg>
                    <span className="text-sm font-medium">Image</span>
                  </button>
              </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 whitespace-nowrap">{charCount}/{maxChars}</span>
                  <button 
                    className="w-11 h-11 bg-gradient-to-r from-[#4E3CFA] via-[#4E3CFA] to-[#4E3CFA]/90 hover:from-[#4E3CFA]/90 hover:via-[#4E3CFA] hover:to-[#4E3CFA] text-white rounded-xl transition-all duration-300 shadow-lg shadow-[#4E3CFA]/30 hover:shadow-[#4E3CFA]/50 hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center"
                    onClick={handleSendMessage}
                    disabled={isInputEmpty || isCreatingChat}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                    </svg>
                  </button>
                </div>
            </div>
          </div>
        </div>

          {/* Recent Chats */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Nedavne konverzacije
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {isLoadingRecentChats ? (
                <div className="col-span-full text-center py-20">
                  <div className="w-8 h-8 border-2 border-[#4E3CFA]/30 border-t-[#4E3CFA] rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Učitavam nedavne konverzacije...</p>
                </div>
              ) : recentChats.length > 0 ? (
                recentChats.map((chat) => (
                  <Card 
                    key={chat.id} 
                    className="group cursor-pointer transition-all duration-700 text-left backdrop-blur-xl relative overflow-hidden hover:-translate-y-4 hover:scale-105 border-[#4E3CFA]/20 shadow-xl shadow-[#4E3CFA]/20 bg-gradient-to-br from-[#4E3CFA]/8 via-[#4E3CFA]/5 to-[#020117]/70 hover:shadow-[#4E3CFA]/40"
                    onClick={() => navigate(`/chat/${chat.id}`)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4E3CFA]/0 via-[#4E3CFA]/5 to-[#4E3CFA]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-[#4E3CFA]/30 via-[#4E3CFA]/20 to-[#4E3CFA]/10 rounded-xl w-fit shadow-lg group-hover:shadow-[#4E3CFA]/40 group-hover:scale-110 transition-all duration-500 relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                          <svg className="w-4 h-4 text-[#4E3CFA] group-hover:text-[#4E3CFA]/90 transition-colors duration-300 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12,6 12,12 16,14"/>
                          </svg>
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatChatTimestamp(chat.lastMessageAt)}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#4E3CFA] transition-colors duration-300 line-clamp-2">
                        {chat.title}
                      </h3>
                      {chat.subject && (
                        <Badge variant="secondary" className="bg-[#4E3CFA]/20 text-[#4E3CFA] hover:bg-[#4E3CFA]/30 w-fit">
                          {chat.subject.name} ({chat.subject.code})
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="mx-auto mb-6 p-6 bg-gradient-to-br from-[#4E3CFA]/20 via-[#4E3CFA]/10 to-[#4E3CFA]/5 rounded-3xl w-fit shadow-lg relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
                    <svg className="w-16 h-16 text-[#4E3CFA]/70 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Još nema konverzacija</h3>
                  <p className="text-lg text-gray-400 leading-relaxed max-w-md mx-auto">
                    Započnite svoju prvю konverzaciju postavljanjem pitanja gore!
                  </p>
                </div>
              )}
          </div>
        </div>

        {/* Subject/Lesson Selection Modal */}
        {showSubjectModal && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-5" onClick={handleCloseSubjectModal}>
            <div className="bg-[#020117]/95 backdrop-blur-xl border border-[#4E3CFA]/20 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl shadow-[#4E3CFA]/20" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center p-6 border-b border-[#4E3CFA]/10">
                <h2 className="text-xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                  {modalStep === 'subject' ? 'Izaberi predmet' : `Izaberi lekcije - ${tempSelectedSubject?.name}`}
                </h2>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#4E3CFA]/30 transition-all duration-300 text-gray-400 hover:text-white" onClick={handleCloseSubjectModal}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {modalStep === 'subject' ? (
                  <div className="space-y-3">
                    {filteredSubjects.length > 0 ? (
                      filteredSubjects.map(subject => (
                      <Card 
                        key={subject.id} 
                        className="cursor-pointer transition-all duration-300 hover:shadow-lg backdrop-blur-xl border border-[#4E3CFA]/20 hover:border-[#4E3CFA]/40 bg-gradient-to-br from-[#4E3CFA]/5 via-[#020117]/90 to-[#020117]/70 hover:shadow-[#4E3CFA]/20"
                        onClick={() => handleSubjectSelect(subject)}
                      >
                        <CardContent className="p-4">
                          <h3 className="text-lg font-bold text-white mb-2">{subject.name}</h3>
                          <div className="flex items-center gap-3 text-sm">
                            <Badge variant="secondary" className="bg-[#4E3CFA]/20 text-[#4E3CFA] border-[#4E3CFA]/30">{subject.code}</Badge>
                            <span className="text-gray-400">{subject.year}. godina • {subject.semester}. semestar</span>
                            <span className="text-gray-400 ml-auto">{subject.lessons.length} lekcija</span>
                          </div>
                        </CardContent>
                      </Card>
                      ))
                    ) : (
                      <div className="text-center py-20">
                        <div className="mx-auto mb-6 p-6 bg-gradient-to-br from-[#4E3CFA]/20 via-[#4E3CFA]/10 to-[#4E3CFA]/5 rounded-3xl w-fit shadow-lg relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
                          <svg className="w-16 h-16 text-[#4E3CFA]/70 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Nema dostupnih predmeta</h3>
                        <p className="text-gray-400">
                          {user?.faculty && user?.academicYear 
                            ? `Nema predmeta za ${user.faculty}, ${user.academicYear}.` 
                            : 'Molimo ažurirajte informacije o fakultetu u profilu.'}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tempSelectedSubject?.lessons.map(lesson => (
                      <Card 
                        key={lesson.id}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg backdrop-blur-xl border ${tempSelectedLessons.some(l => l.id === lesson.id) ? 'border-[#4E3CFA]/40 bg-gradient-to-br from-[#4E3CFA]/10 via-[#4E3CFA]/5 to-[#020117]/70 shadow-[#4E3CFA]/20' : 'border-[#4E3CFA]/20 hover:border-[#4E3CFA]/40 bg-gradient-to-br from-[#4E3CFA]/5 via-[#020117]/90 to-[#020117]/70'} hover:shadow-[#4E3CFA]/20`}
                        onClick={() => handleLessonToggle(lesson)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="mt-1">
                              <div className={`w-5 h-5 border-2 rounded border-[#4E3CFA]/40 flex items-center justify-center transition-all duration-300 ${
                                tempSelectedLessons.some(l => l.id === lesson.id) 
                                  ? 'bg-[#4E3CFA] border-[#4E3CFA] text-white' 
                                  : 'bg-transparent'
                              }`}>
                                {tempSelectedLessons.some(l => l.id === lesson.id) && (
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="20,6 9,17 4,12"/>
                                  </svg>
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-base font-semibold text-white mb-2 leading-tight">{lesson.title}</h4>
                              <p className="text-sm text-gray-400 leading-relaxed">{lesson.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center p-6 border-t border-primary/10 gap-4">
                {modalStep === 'lessons' && (
                  <Button variant="secondary" onClick={handleBackToSubjects} className="bg-white/5 border-white/10 hover:border-[#4E3CFA]/30 text-white hover:text-[#4E3CFA]">
                    Nazad
                  </Button>
                )}
                <div className="flex items-center gap-4 ml-auto">
                  {modalStep === 'lessons' && (
                    <>
                      <span className="text-sm text-gray-400 whitespace-nowrap">
                        {tempSelectedLessons.length} od {tempSelectedSubject?.lessons.length} lekcija izabrano
                      </span>
                      <Button 
                        onClick={handleConfirmSelection}
                        disabled={tempSelectedLessons.length === 0}
                        className="bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                      >
                        Potvrdi izbor
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dropdown portal - FIXED to be on top of everything */}
        {showModeDropdown && (
          <div 
            data-dropdown="mode-dropdown"
            className="fixed bg-[#1C212B] backdrop-blur-xl border border-[#4E3CFA]/30 rounded-xl shadow-2xl shadow-black/50 z-[9999] overflow-hidden w-64 max-h-80"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`
            }}
          >
            {chatModes.map((mode) => (
              <button
                key={mode.id}
                className={`w-full px-4 py-3 text-left bg-transparent border-none text-white hover:bg-white/10 transition-all duration-300 border-b border-white/10 last:border-b-0 ${mode.id === selectedMode ? 'bg-[#4E3CFA]/20' : ''}`}
                onClick={() => handleModeSelect(mode.id)}
              >
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-semibold">{mode.name}</div>
                  <div className="text-xs text-gray-400">{mode.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Home;