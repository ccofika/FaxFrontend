import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ChatMode = 'explain' | 'solve' | 'summary' | 'tests' | 'learning';

interface ModeConfig {
  id: ChatMode;
  name: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}

const chatModes: ModeConfig[] = [
  { 
    id: 'explain', 
    name: 'Explain', 
    description: 'Get detailed explanations', 
    color: '#8B5CF6', 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    )
  },
  { 
    id: 'solve', 
    name: 'Solve', 
    description: 'Find solutions to problems', 
    color: '#F59E0B', 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    )
  },
  { 
    id: 'summary', 
    name: 'Summary', 
    description: 'Get concise summaries', 
    color: '#10B981', 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>
    )
  },
  { 
    id: 'tests', 
    name: 'Tests', 
    description: 'Generate tests and quizzes', 
    color: '#EF4444', 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
        <path d="m9 14 2 2 4-4"/>
      </svg>
    )
  },
  { 
    id: 'learning', 
    name: 'Learning', 
    description: 'Interactive learning assistance', 
    color: '#3B82F6', 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    )
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [quickSearch, setQuickSearch] = useState('');

  const handleQuickSearch = () => {
    if (quickSearch.trim()) {
      console.log('Quick search:', quickSearch);
      navigate('/', { state: { quickQuery: quickSearch } });
    }
  };

  const handleModeClick = (mode: ChatMode) => {
    navigate('/', { state: { selectedMode: mode } });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuickSearch();
    }
  };

  return (
    <div className="main-content">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Brz pristup svim funkcijama i pregled aktivnosti</p>
        </div>

        {/* Quick Search */}
        <div className="quick-search-section">
          <h2 className="section-title">Quick Search</h2>
          <div className="quick-search-container">
            <input
              type="text"
              className="quick-search-input"
              placeholder="Pitaj AI bilo šta..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="quick-search-btn"
              onClick={handleQuickSearch}
              disabled={!quickSearch.trim()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Mode Shortcuts */}
        <div className="mode-shortcuts-section">
          <h2 className="section-title">Chat Modes</h2>
          <div className="mode-shortcuts-grid">
            {chatModes.map((mode) => (
              <button
                key={mode.id}
                className="mode-shortcut-card"
                onClick={() => handleModeClick(mode.id)}
                style={{ '--mode-color': mode.color } as React.CSSProperties}
              >
                <div className="mode-icon">{mode.icon}</div>
                <div className="mode-info">
                  <h3 className="mode-name">{mode.name}</h3>
                  <p className="mode-description">{mode.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Recent Chats */}
          <div className="dashboard-section">
            <h2 className="section-title">Recent Chats</h2>
            <div className="recent-chats-list">
              <div className="chat-item">
                <div className="chat-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div className="chat-content">
                  <div className="chat-title">Kako funkcioniše React Router?</div>
                  <div className="chat-meta">
                    <span className="chat-mode explain">Explain</span>
                    <span className="chat-time">Pre 2 sata</span>
                  </div>
                </div>
              </div>
              
              <div className="chat-item">
                <div className="chat-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div className="chat-content">
                  <div className="chat-title">Objasni algoritme sortiranja</div>
                  <div className="chat-meta">
                    <span className="chat-mode learning">Learning</span>
                    <span className="chat-time">Pre 5 sati</span>
                  </div>
                </div>
              </div>
              
              <div className="chat-item">
                <div className="chat-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div className="chat-content">
                  <div className="chat-title">Test iz matematike - integrali</div>
                  <div className="chat-meta">
                    <span className="chat-mode tests">Tests</span>
                    <span className="chat-time">Juče</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Subjects */}
          <div className="dashboard-section">
            <h2 className="section-title">Moji Predmeti</h2>
            <div className="subjects-list">
              <div className="subject-item">
                <div className="subject-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <div className="subject-content">
                  <div className="subject-name">Informacioni sistemi</div>
                  <div className="subject-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '75%'}}></div>
                    </div>
                    <span className="progress-text">75% završeno</span>
                  </div>
                </div>
              </div>
              
              <div className="subject-item">
                <div className="subject-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                </div>
                <div className="subject-content">
                  <div className="subject-name">Matematička analiza</div>
                  <div className="subject-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '60%'}}></div>
                    </div>
                    <span className="progress-text">60% završeno</span>
                  </div>
                </div>
              </div>
              
              <div className="subject-item">
                <div className="subject-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                </div>
                <div className="subject-content">
                  <div className="subject-name">Programiranje</div>
                  <div className="subject-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '90%'}}></div>
                    </div>
                    <span className="progress-text">90% završeno</span>
                  </div>
                </div>
              </div>
              
              <div className="subject-item">
                <div className="subject-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <div className="subject-content">
                  <div className="subject-name">Statistika</div>
                  <div className="subject-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '45%'}}></div>
                    </div>
                    <span className="progress-text">45% završeno</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;