import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services';
import styles from './Home.module.css';

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
  { id: 'explain', name: 'Explain', description: 'Get detailed explanations', color: '#8B5CF6' },
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`[class*="modeSelector"]`)) {
        setShowModeDropdown(false);
      }
    };

    if (showModeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
    <div className={styles.homePage}>
      <div className={styles.chatInterface}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <h1 className={styles.greeting}>{getPersonalizedGreeting()}</h1>
          <p className={styles.subtitle}>{getPersonalizedSubtitle()}</p>
        </div>

        {/* Input Section */}
        <div className={styles.inputSection}>
          <div className={`${styles.inputContainer} ${styles[`mode${selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)}`]}`}>
            <textarea
              className={styles.chatInput}
              placeholder="Postavite pitanje ili opišite problem koji vas zanima..."
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <div className={styles.inputToolbar}>
              <div className={styles.inputActions}>
                <button 
                  className={styles.subjectSelectorBtn}
                  onClick={handleOpenSubjectModal}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                  {selectedContent ? (
                    <span className={styles.subjectSelectorText}>
                      {selectedContent.subject.name} ({selectedContent.lessons.length} lekcija)
                    </span>
                  ) : (
                    <span className={styles.subjectSelectorText}>Izaberi predmet</span>
                  )}
                </button>
                <div className={styles.modeSelector}>
                  <button 
                    className={`${styles.modeButton} ${showModeDropdown ? styles.active : ''}`}
                    onClick={() => setShowModeDropdown(!showModeDropdown)}
                  >
                    {selectedModeConfig?.name}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6,9 12,15 18,9"/>
                    </svg>
                  </button>
                  {showModeDropdown && (
                    <div className={styles.modeDropdown}>
                      {chatModes.map((mode) => (
                        <button
                          key={mode.id}
                          className={`${styles.modeOption} ${mode.id === selectedMode ? styles.selected : ''}`}
                          onClick={() => handleModeSelect(mode.id)}
                        >
                          <div className={styles.modeDetails}>
                            <div className={styles.modeName}>{mode.name}</div>
                            <div className={styles.modeDescription}>{mode.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button className={styles.inputAction}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                  Add Attachment
                </button>
                <button className={styles.inputAction}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                  Use Image
                </button>
              </div>
              <div className={styles.sendSection}>
                <span className={styles.characterCount}>{charCount}/{maxChars}</span>
                <button 
                  className={styles.sendButton} 
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
        <div className={styles.recentChats}>
          <h2 className={styles.recentChatsTitle}>Nedavne konverzacije</h2>
          <div className={styles.recentChatsGrid}>
            {isLoadingRecentChats ? (
              <div className={styles.recentChatsLoading}>
                <div className={styles.loadingSpinner}></div>
                <p>Učitavam nedavne konverzacije...</p>
              </div>
            ) : recentChats.length > 0 ? (
              recentChats.map((chat) => (
                <div 
                  key={chat.id} 
                  className={styles.chatCard}
                  onClick={() => navigate(`/chat/${chat.id}`)}
                >
                  <div className={styles.chatCardHeader}>
                    <svg className={styles.chatCardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    <span className={styles.chatCardTime}>
                      {formatChatTimestamp(chat.lastMessageAt)}
                    </span>
                  </div>
                  <h3 className={styles.chatCardTitle}>{chat.title}</h3>
                  {chat.subject && (
                    <p className={styles.chatCardSubject}>
                      {chat.subject.name} ({chat.subject.code})
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className={styles.noChatsMessage}>
                <div className={styles.noChatsIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <h3>Još nema konverzacija</h3>
                <p>Započnite svoju prvю konverzaciju postavljanjem pitanja gore!</p>
              </div>
            )}
          </div>
        </div>

        {/* Subject/Lesson Selection Modal */}
        {showSubjectModal && (
          <div className={styles.modalOverlay} onClick={handleCloseSubjectModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>
                  {modalStep === 'subject' ? 'Izaberi predmet' : `Izaberi lekcije - ${tempSelectedSubject?.name}`}
                </h2>
                <button className={styles.modalClose} onClick={handleCloseSubjectModal}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className={styles.modalBody}>
                {modalStep === 'subject' ? (
                  <div className={styles.subjectsList}>
                    {filteredSubjects.length > 0 ? (
                      filteredSubjects.map(subject => (
                      <div 
                        key={subject.id} 
                        className={styles.subjectItem}
                        onClick={() => handleSubjectSelect(subject)}
                      >
                        <h3 className={styles.subjectName}>{subject.name}</h3>
                        <span className={styles.subjectCode}>{subject.code}</span>
                        <span className={styles.subjectInfo}>{subject.year}. godina • {subject.semester}. semestar</span>
                        <span className={styles.lessonsCount}>{subject.lessons.length} lekcija</span>
                      </div>
                      ))
                    ) : (
                      <div className={styles.noSubjectsMessage}>
                        <div className={styles.noSubjectsIcon}>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                          </svg>
                        </div>
                        <h3>Nema dostupnih predmeta</h3>
                        <p>
                          {user?.faculty && user?.academicYear 
                            ? `Nema predmeta za ${user.faculty}, ${user.academicYear}.` 
                            : 'Molimo ažurirajte informacije o fakultetu u profilu.'}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.lessonsSelection}>
                    <div className={styles.lessonsList}>
                      {tempSelectedSubject?.lessons.map(lesson => (
                        <div 
                          key={lesson.id}
                          className={`${styles.lessonItem} ${tempSelectedLessons.some(l => l.id === lesson.id) ? styles.selected : ''}`}
                          onClick={() => handleLessonToggle(lesson)}
                        >
                          <div className={styles.lessonCheckbox}>
                            <div className={styles.checkbox}>
                              {tempSelectedLessons.some(l => l.id === lesson.id) && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <polyline points="20,6 9,17 4,12"/>
                                </svg>
                              )}
                            </div>
                          </div>
                          <div className={styles.lessonContent}>
                            <h4 className={styles.lessonTitle}>{lesson.title}</h4>
                            <p className={styles.lessonDescription}>{lesson.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.modalFooter}>
                {modalStep === 'lessons' && (
                  <button className={styles.btnSecondary} onClick={handleBackToSubjects}>
                    Nazad
                  </button>
                )}
                <div className={styles.modalFooterRight}>
                  {modalStep === 'lessons' && (
                    <>
                      <span className={styles.selectedCount}>
                        {tempSelectedLessons.length} od {tempSelectedSubject?.lessons.length} lekcija izabrano
                      </span>
                      <button 
                        className={styles.btnPrimary}
                        onClick={handleConfirmSelection}
                        disabled={tempSelectedLessons.length === 0}
                      >
                        Potvrdi izbor
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;