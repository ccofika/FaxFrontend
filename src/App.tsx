import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import { Home, Profile, Dashboard, Notes, Calendar } from './pages';
import { 
  MainHome, 
  HowItWorks, 
  SupportedFaculties, 
  Demo, 
  Pricing, 
  FAQ, 
  Contact 
} from './pages/main';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  // Mock chat data - u buducnosti ce ovo doci iz backend-a
  const mockChats = [
    { id: 1, title: "Kako funkcioniše React Router?", timestamp: "Pre 2 sata", mode: "explain" },
    { id: 2, title: "Objasni algoritme sortiranja", timestamp: "Pre 5 sati", mode: "learning" },
    { id: 3, title: "Test iz matematike - integrali", timestamp: "Juče", mode: "tests" },
    { id: 4, title: "Reši jednačinu drugog stepena", timestamp: "Pre 2 dana", mode: "solve" },
    { id: 5, title: "Sažetak ove lekcije", timestamp: "Pre 3 dana", mode: "summary" },
  ];

  const filteredChats = mockChats.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigate = useNavigate();

  const handleNewChat = () => {
    console.log('Kreiranje novog chat-a...');
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Logo and Toggle */}
      <div className="sidebar-header">
        {isCollapsed ? (
          // When collapsed, logo acts as expand button
          <button className="logo-expand-btn" onClick={toggleSidebar}>
            <div className="logo"></div>
          </button>
        ) : (
          // When expanded, show logo and separate minimize button
          <>
            <div className="logo"></div>
            <button className="sidebar-minimize" onClick={toggleSidebar}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {/* New Chat Button */}
      {!isCollapsed ? (
        <div className="sidebar-actions">
          <button className="new-chat-btn" onClick={handleNewChat}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14m-7-7h14"/>
            </svg>
            New Chat
          </button>
        </div>
      ) : (
        <div className="sidebar-collapsed-actions">
          <button className="collapsed-action-btn" onClick={handleNewChat} title="New Chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14m-7-7h14"/>
            </svg>
          </button>
        </div>
      )}

      {/* Search Chats */}
      {!isCollapsed ? (
        <div className="sidebar-search">
          <div className="search-container">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      ) : (
        <div className="sidebar-collapsed-search">
          <button className="collapsed-action-btn" title="Search chats">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>
      )}

      {/* Chats Section */}
      <div className="sidebar-chats">
        <div className="chats-header">
          <h3>Chats</h3>
        </div>
        <div className="chats-list">
          {filteredChats.map((chat) => (
            <div key={chat.id} className="chat-item-sidebar">
              <div className="chat-content-sidebar">
                <div className="chat-title-sidebar">{chat.title}</div>
                <div className="chat-meta-sidebar">
                  <span className={`chat-mode-badge ${chat.mode}`}>{chat.mode}</span>
                  <span className="chat-timestamp">{chat.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Existing Navigation Icons */}
      <div className="sidebar-navigation">
        <div className="sidebar-spacer"></div>
        
        <div className="nav-icons">
          <Link to="/dashboard" className={`sidebar-icon ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            <span>Dashboard</span>
          </Link>
          
          <Link to="/notes" className={`sidebar-icon ${location.pathname === '/notes' ? 'active' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            <span>Beleške</span>
          </Link>
          
          <button className="sidebar-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
            </svg>
            <span>Settings</span>
          </button>
          
          <Link to="/calendar" className={`sidebar-icon ${location.pathname === '/calendar' ? 'active' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>Zadaci i rokovi</span>
          </Link>
        </div>
        
        <div className="bottom-icons">
          <Link to="/profile" className={`sidebar-icon ${location.pathname === '/profile' ? 'active' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Profile</span>
          </Link>
          
          <button className="sidebar-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <span>More</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="App">
      <Sidebar />
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/notes" element={<Layout><Notes /></Layout>} />
        <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
        <Route path="/profile" element={<Profile />} />
        
        <Route path="/main" element={<Navigate to="/main/pocetna" replace />} />
        <Route path="/main/pocetna" element={<MainHome />} />
        <Route path="/main/kako-funkcionise" element={<HowItWorks />} />
        <Route path="/main/podrzani-fakulteti" element={<SupportedFaculties />} />
        <Route path="/main/demonstracija" element={<Demo />} />
        <Route path="/main/cene" element={<Pricing />} />
        <Route path="/main/faq" element={<FAQ />} />
        <Route path="/main/kontakt" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
