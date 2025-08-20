import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services';
import styles from './Home.module.css';
import { TooltipProvider } from '../components/ui/tooltip';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, BookOpen, Sparkles, Zap, Send, Clock } from 'lucide-react';

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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full min-h-screen relative overflow-hidden bg-zinc-950 text-white font-inter"
      >
        {/* NADRKAN Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/60 via-zinc-950 to-zinc-900/40 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(2px_2px_at_20px_30px,rgba(255,255,255,0.08),transparent),radial-gradient(2px_2px_at_40px_70px,rgba(255,255,255,0.04),transparent)] bg-repeat bg-[length:150px_150px] pointer-events-none opacity-50" />
        
        {/* Floating conversation elements animation */}
        <div className="absolute inset-0 -z-5 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0.3 + Math.random() * 0.7,
              }}
              animate={{
                y: [null, Math.random() * -200, Math.random() * 200],
                x: [null, Math.random() * -100, Math.random() * 100],
                rotate: [0, Math.random() * 360],
                opacity: [0.08, 0.20, 0.08],
              }}
              transition={{
                duration: Math.random() * 25 + 20,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 10,
              }}
            >
              {[MessageCircle, BookOpen, Sparkles][i % 3] && 
                React.createElement([MessageCircle, BookOpen, Sparkles][i % 3], {
                  className: "w-5 h-5 text-white/15"
                })
              }
            </motion.div>
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
          {/* NADRKAN Hero Section */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center mb-20 mt-16"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring", bounce: 0.4 }}
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-br from-white via-gray-100 to-gray-200 bg-clip-text text-transparent leading-tight mb-3 relative">
                {getPersonalizedGreeting()}
                <motion.div
                  className="absolute -top-2 -right-10"
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
                >
                  <Sparkles className="w-8 h-8 text-blue-400/70" />
                </motion.div>
              </h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base font-medium text-gray-300 max-w-xl mx-auto leading-relaxed"
            >
              {getPersonalizedSubtitle()}
            </motion.p>
          </motion.div>

          {/* NADRKAN Input Section */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-16 flex justify-center"
          >
            <motion.div 
              className={`w-full max-w-3xl bg-zinc-900/50 border backdrop-blur-xl rounded-2xl overflow-visible transition-all duration-300 hover:shadow-2xl relative ${
              selectedMode === 'explain' ? 'border-blue-500/30 shadow-xl shadow-blue-500/20 hover:border-blue-500/50' :
              selectedMode === 'solve' ? 'border-orange-500/30 shadow-xl shadow-orange-500/20 hover:border-orange-500/50' :
              selectedMode === 'summary' ? 'border-green-500/30 shadow-xl shadow-green-500/20 hover:border-green-500/50' :
              selectedMode === 'tests' ? 'border-red-500/30 shadow-xl shadow-red-500/20 hover:border-red-500/50' :
              selectedMode === 'learning' ? 'border-purple-500/30 shadow-xl shadow-purple-500/20 hover:border-purple-500/50' :
              'border-zinc-700/50 shadow-xl shadow-black/20 hover:border-zinc-600/50'
            }`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}>
              <motion.textarea
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="w-full min-h-[120px] p-6 bg-transparent text-white placeholder:text-gray-400 resize-none outline-none text-lg leading-relaxed rounded-tl-2xl rounded-tr-2xl"
                placeholder="Postavite pitanje ili opišite problem koji vas zanima..."
                value={message}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="flex justify-between items-center p-6 bg-zinc-800/30 border-t border-zinc-700/30 gap-4 flex-wrap rounded-b-2xl"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <motion.button 
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600/50 rounded-xl text-gray-400 hover:text-white transition-all duration-300 min-w-32 max-w-48"
                    onClick={handleOpenSubjectModal}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BookOpen className="w-4 h-4" />
                    {selectedContent ? (
                      <span className="text-sm font-medium truncate">
                        {selectedContent.subject.name} ({selectedContent.lessons.length} lekcija)
                      </span>
                    ) : (
                      <span className="text-sm font-medium">Izaberi predmet</span>
                    )}
                  </motion.button>
                  <div className="relative">
                    <motion.button 
                      ref={modeButtonRef}
                      className={`flex items-center gap-2 px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 hover:border-blue-500/50 rounded-xl text-white font-medium transition-all duration-300 min-w-24 ${showModeDropdown ? 'bg-blue-500/20 border-blue-500/50' : ''}`}
                      onClick={handleModeButtonClick}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-sm">{selectedModeConfig?.name}</span>
                      <motion.svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        animate={{ rotate: showModeDropdown ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <polyline points="6,9 12,15 18,9"/>
                      </motion.svg>
                    </motion.button>
                  </div>
                  
                  <motion.button 
                    className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600/50 rounded-lg text-gray-400 hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                    </svg>
                    <span className="text-sm font-medium">Attachment</span>
                  </motion.button>
                  <motion.button 
                    className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600/50 rounded-lg text-gray-400 hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21,15 16,10 5,21"/>
                    </svg>
                    <span className="text-sm font-medium">Image</span>
                  </motion.button>
              </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 whitespace-nowrap">{charCount}/{maxChars}</span>
                  <motion.button 
                    className="w-11 h-11 bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-600 hover:via-zinc-700 hover:to-zinc-800 text-white rounded-xl transition-all duration-300 shadow-lg shadow-black/50 hover:shadow-black/70 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center"
                    onClick={handleSendMessage}
                    disabled={isInputEmpty || isCreatingChat}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
            </motion.div>
          </motion.div>
        </motion.div>

          {/* NADRKAN Recent Chats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mb-16"
          >
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="text-3xl font-bold text-center mb-12 bg-gradient-to-br from-white via-gray-100 to-gray-200 bg-clip-text text-transparent"
            >
              Nedavne konverzacije
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {isLoadingRecentChats ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-20"
                >
                  <motion.div 
                    className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="text-gray-400">Učitavam nedavne konverzacije...</p>
                </motion.div>
              ) : recentChats.length > 0 ? (
                <AnimatePresence>
                  {recentChats.map((chat, index) => (
                    <motion.div
                      key={chat.id}
                      initial={{ y: 50, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: -50, opacity: 0, scale: 0.9 }}
                      transition={{ delay: 1.8 + (index * 0.1), duration: 0.8, type: "spring" }}
                      whileHover={{ 
                        y: -10, 
                        scale: 1.05,
                        rotateX: 5,
                      }}
                    >
                      <Card 
                        className="group cursor-pointer transition-all duration-700 text-left backdrop-blur-xl relative overflow-hidden border-zinc-800/50 shadow-xl shadow-black/20 bg-gradient-to-br from-zinc-900/50 via-zinc-800/30 to-zinc-900/40"
                        onClick={() => navigate(`/chat/${chat.id}`)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        
                        {/* Animated glow effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl"></div>
                        </div>
                        
                        <CardContent className="p-6 relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <motion.div 
                              className="p-2 bg-gradient-to-br from-zinc-700/50 via-zinc-600/30 to-zinc-700/20 rounded-xl w-fit shadow-lg relative"
                              whileHover={{ scale: 1.15, rotate: 10 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl"></div>
                              <Clock className="w-4 h-4 text-blue-400 relative z-10" />
                            </motion.div>
                            <span className="text-xs text-gray-400">
                              {formatChatTimestamp(chat.lastMessageAt)}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300 line-clamp-2">
                            {chat.title}
                          </h3>
                          {chat.subject && (
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 w-fit">
                              {chat.subject.name} ({chat.subject.code})
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2, duration: 0.8 }}
                  className="col-span-full text-center py-20"
                >
                  <motion.div 
                    className="mx-auto mb-6 p-6 bg-gradient-to-br from-zinc-800/50 via-zinc-700/30 to-zinc-800/20 rounded-3xl w-fit shadow-lg relative"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0] 
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
                    <MessageCircle className="w-16 h-16 text-gray-400 relative z-10" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-3">Još nema konverzacija</h3>
                  <p className="text-lg text-gray-300 leading-relaxed max-w-md mx-auto">
                    Započnite svoju prvю konverzaciju postavljanjem pitanja gore!
                  </p>
                </motion.div>
              )}
          </motion.div>
        </div>

        {/* NADRKAN Subject/Lesson Selection Modal */}
        <AnimatePresence>
          {showSubjectModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-5" 
              onClick={handleCloseSubjectModal}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-zinc-950/95 backdrop-blur-xl border border-zinc-800/50 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl shadow-black/50" 
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-between items-center p-6 border-b border-zinc-800/50"
                >
                  <h2 className="text-xl font-bold bg-gradient-to-br from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                    {modalStep === 'subject' ? 'Izaberi predmet' : `Izaberi lekcije - ${tempSelectedSubject?.name}`}
                  </h2>
                  <motion.button 
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 text-gray-400 hover:text-white" 
                    onClick={handleCloseSubjectModal}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </motion.button>
                </motion.div>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex-1 overflow-y-auto p-6"
                >
                  {modalStep === 'subject' ? (
                    <div className="space-y-3">
                      {filteredSubjects.length > 0 ? (
                        filteredSubjects.map((subject, index) => (
                        <motion.div
                          key={subject.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 + (index * 0.1) }}
                          whileHover={{ x: 5, scale: 1.02 }}
                        >
                          <Card 
                            className="cursor-pointer transition-all duration-300 hover:shadow-lg backdrop-blur-xl border border-zinc-800/50 hover:border-zinc-700/50 bg-gradient-to-br from-zinc-900/50 via-zinc-800/30 to-zinc-900/40 hover:shadow-black/20"
                            onClick={() => handleSubjectSelect(subject)}
                          >
                            <CardContent className="p-4">
                              <h3 className="text-lg font-bold text-white mb-2">{subject.name}</h3>
                              <div className="flex items-center gap-3 text-sm">
                                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">{subject.code}</Badge>
                                <span className="text-gray-400">{subject.year}. godina • {subject.semester}. semestar</span>
                                <span className="text-gray-400 ml-auto">{subject.lessons.length} lekcija</span>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                        ))
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-20"
                        >
                          <motion.div 
                            className="mx-auto mb-6 p-6 bg-gradient-to-br from-zinc-800/50 via-zinc-700/30 to-zinc-800/20 rounded-3xl w-fit shadow-lg relative"
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0] 
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
                            <BookOpen className="w-16 h-16 text-gray-400 relative z-10" />
                          </motion.div>
                          <h3 className="text-xl font-bold text-white mb-3">Nema dostupnih predmeta</h3>
                          <p className="text-gray-400">
                            {user?.faculty && user?.academicYear 
                              ? `Nema predmeta za ${user.faculty}, ${user.academicYear}.` 
                              : 'Molimo ažurirajte informacije o fakultetu u profilu.'}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tempSelectedSubject?.lessons.map((lesson, index) => (
                        <motion.div
                          key={lesson.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 + (index * 0.05) }}
                          whileHover={{ x: 5, scale: 1.02 }}
                        >
                          <Card 
                            className={`cursor-pointer transition-all duration-300 hover:shadow-lg backdrop-blur-xl border ${tempSelectedLessons.some(l => l.id === lesson.id) ? 'border-blue-500/50 bg-gradient-to-br from-blue-500/20 via-zinc-900/50 to-zinc-800/50 shadow-blue-500/20' : 'border-zinc-800/50 hover:border-zinc-700/50 bg-gradient-to-br from-zinc-900/50 via-zinc-800/30 to-zinc-900/40'} hover:shadow-black/20`}
                            onClick={() => handleLessonToggle(lesson)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="mt-1">
                                  <motion.div 
                                    className={`w-5 h-5 border-2 rounded border-blue-500/50 flex items-center justify-center transition-all duration-300 ${
                                      tempSelectedLessons.some(l => l.id === lesson.id) 
                                        ? 'bg-blue-500 border-blue-500 text-white' 
                                        : 'bg-transparent'
                                    }`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <AnimatePresence>
                                      {tempSelectedLessons.some(l => l.id === lesson.id) && (
                                        <motion.svg 
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          exit={{ scale: 0 }}
                                          width="12" 
                                          height="12" 
                                          viewBox="0 0 24 24" 
                                          fill="none" 
                                          stroke="currentColor" 
                                          strokeWidth="3"
                                        >
                                          <polyline points="20,6 9,17 4,12"/>
                                        </motion.svg>
                                      )}
                                    </AnimatePresence>
                                  </motion.div>
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-base font-semibold text-white mb-2 leading-tight">{lesson.title}</h4>
                                  <p className="text-sm text-gray-400 leading-relaxed">{lesson.description}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-between items-center p-6 border-t border-zinc-800/50 gap-4"
                >
                  {modalStep === 'lessons' && (
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button 
                        variant="secondary" 
                        onClick={handleBackToSubjects} 
                        className="bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600/50 text-white hover:text-blue-400"
                      >
                        Nazad
                      </Button>
                    </motion.div>
                  )}
                  <div className="flex items-center gap-4 ml-auto">
                    {modalStep === 'lessons' && (
                      <>
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="text-sm text-gray-400 whitespace-nowrap"
                        >
                          {tempSelectedLessons.length} od {tempSelectedSubject?.lessons.length} lekcija izabrano
                        </motion.span>
                        <motion.div
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.7 }}
                        >
                          <Button 
                            onClick={handleConfirmSelection}
                            disabled={tempSelectedLessons.length === 0}
                            className="bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-600 hover:via-zinc-700 hover:to-zinc-800 text-white shadow-lg shadow-black/50 hover:shadow-black/70 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                          >
                            Potvrdi izbor
                          </Button>
                        </motion.div>
                      </>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NADRKAN Dropdown portal */}
        <AnimatePresence>
          {showModeDropdown && (
            <motion.div 
              data-dropdown="mode-dropdown"
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-xl shadow-2xl shadow-black/50 z-[9999] overflow-hidden w-64 max-h-80"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`
              }}
            >
              {chatModes.map((mode, index) => (
                <motion.button
                  key={mode.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-full px-4 py-3 text-left bg-transparent border-none text-white hover:bg-zinc-800/50 transition-all duration-300 border-b border-zinc-700/30 last:border-b-0 ${mode.id === selectedMode ? 'bg-blue-500/20' : ''}`}
                  onClick={() => handleModeSelect(mode.id)}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-semibold">{mode.name}</div>
                    <div className="text-xs text-gray-400">{mode.description}</div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </TooltipProvider>
  );
};

export default Home;