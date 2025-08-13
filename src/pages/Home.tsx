import React, { useState, useEffect } from 'react';

type ChatMode = 'explain' | 'solve' | 'summary' | 'tests' | 'learning';

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

const Home: React.FC = () => {
  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [selectedMode, setSelectedMode] = useState<ChatMode>('explain');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
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
              placeholder="Pitaj sta god zelis sem gej pitanja, to ti je blokirano"
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <div className="input-toolbar">
              <div className="input-actions">
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
      </div>
    </div>
  );
};

export default Home;