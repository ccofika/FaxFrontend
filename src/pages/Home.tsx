import React, { useState, useEffect } from 'react';

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
  }
];

const Home: React.FC = () => {
  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [selectedMode, setSelectedMode] = useState<ChatMode>('explain');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<SelectedContent | null>(null);
  const [modalStep, setModalStep] = useState<'subject' | 'lessons'>('subject');
  const [tempSelectedSubject, setTempSelectedSubject] = useState<Subject | null>(null);
  const [tempSelectedLessons, setTempSelectedLessons] = useState<Lesson[]>([]);
  const maxChars = 1000;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setMessage(value);
      setCharCount(value.length);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
      setCharCount(0);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mode-selector')) {
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

  return (
    <div className="main-content">
      <div className="chat-interface">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="greeting">Hey! Vanja Gayanovic</h1>
          <p className="subtitle">Necu ti pusim kurac pedercino</p>
        </div>

        {/* Input Section */}
        <div className="input-section">
          <div className={`input-container mode-${selectedMode}`}>
            <textarea
              className="chat-input"
              placeholder="Filip pedercina"
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <div className="input-toolbar">
              <div className="input-actions">
                <button 
                  className="subject-selector-btn"
                  onClick={handleOpenSubjectModal}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                  {selectedContent ? (
                    <span className="subject-selector-text">
                      {selectedContent.subject.name} ({selectedContent.lessons.length} lekcija)
                    </span>
                  ) : (
                    <span className="subject-selector-text">Izaberi predmet</span>
                  )}
                </button>
                <div className="mode-selector">
                  <button 
                    className={`mode-button ${showModeDropdown ? 'active' : ''}`}
                    onClick={() => setShowModeDropdown(!showModeDropdown)}
                  >
                    {selectedModeConfig?.name}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6,9 12,15 18,9"/>
                    </svg>
                  </button>
                  {showModeDropdown && (
                    <div className="mode-dropdown">
                      {chatModes.map((mode) => (
                        <button
                          key={mode.id}
                          className={`mode-option ${mode.id === selectedMode ? 'selected' : ''}`}
                          onClick={() => handleModeSelect(mode.id)}
                        >
                          <div className="mode-details">
                            <div className="mode-name">{mode.name}</div>
                            <div className="mode-description">{mode.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button className="input-action">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                  Add Attachment
                </button>
                <button className="input-action">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                  Use Image
                </button>
              </div>
              <div className="send-section">
                <span className="character-count">{charCount}/{maxChars}</span>
                <button 
                  className="send-button" 
                  onClick={handleSendMessage}
                  disabled={isInputEmpty}
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
        <div className="recent-chats">
          <h2 className="recent-chats-title">Tvoje dosadasnje gej konverzacije</h2>
          <div className="recent-chats-grid">
            <div className="chat-card">
              <div className="chat-card-header">
                <svg className="chat-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span className="chat-card-time">6 Hours</span>
              </div>
              <h3 className="chat-card-title">Da li su gej pornici dobri za testosteron?</h3>
            </div>
            
            <div className="chat-card">
              <div className="chat-card-header">
                <svg className="chat-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span className="chat-card-time">12 Hours</span>
              </div>
              <h3 className="chat-card-title">Kako da smuvam Sophie Rain 2025 easy guide?</h3>
            </div>
            
            <div className="chat-card">
              <div className="chat-card-header">
                <svg className="chat-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span className="chat-card-time">18 Hours</span>
              </div>
              <h3 className="chat-card-title">Cao, napisi mi esej o kidnapovanju male dece iz studentskog parka</h3>
            </div>
          </div>
        </div>

        {/* Subject/Lesson Selection Modal */}
        {showSubjectModal && (
          <div className="modal-overlay" onClick={handleCloseSubjectModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  {modalStep === 'subject' ? 'Izaberi predmet' : `Izaberi lekcije - ${tempSelectedSubject?.name}`}
                </h2>
                <button className="modal-close" onClick={handleCloseSubjectModal}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="modal-body">
                {modalStep === 'subject' ? (
                  <div className="subjects-list">
                    {demoSubjects.map(subject => (
                      <div 
                        key={subject.id} 
                        className="subject-item"
                        onClick={() => handleSubjectSelect(subject)}
                      >
                        <h3 className="subject-name">{subject.name}</h3>
                        <span className="subject-code">{subject.code}</span>
                        <span className="subject-info">{subject.year}. godina • {subject.semester}. semestar</span>
                        <span className="lessons-count">{subject.lessons.length} lekcija</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="lessons-selection">
                    <div className="lessons-list">
                      {tempSelectedSubject?.lessons.map(lesson => (
                        <div 
                          key={lesson.id}
                          className={`lesson-item ${tempSelectedLessons.some(l => l.id === lesson.id) ? 'selected' : ''}`}
                          onClick={() => handleLessonToggle(lesson)}
                        >
                          <div className="lesson-checkbox">
                            <div className="checkbox">
                              {tempSelectedLessons.some(l => l.id === lesson.id) && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <polyline points="20,6 9,17 4,12"/>
                                </svg>
                              )}
                            </div>
                          </div>
                          <div className="lesson-content">
                            <h4 className="lesson-title">{lesson.title}</h4>
                            <p className="lesson-description">{lesson.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                {modalStep === 'lessons' && (
                  <button className="btn-secondary" onClick={handleBackToSubjects}>
                    Nazad
                  </button>
                )}
                <div className="modal-footer-right">
                  {modalStep === 'lessons' && (
                    <>
                      <span className="selected-count">
                        {tempSelectedLessons.length} od {tempSelectedSubject?.lessons.length} lekcija izabrano
                      </span>
                      <button 
                        className="btn-primary"
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