import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import { Home, Profile, Dashboard, Notes, Calendar, Chat } from './pages';
import { 
  MainHome, 
  HowItWorks, 
  SupportedFaculties, 
  Demo, 
  Pricing, 
  FAQ, 
  Contact,
  Login,
  Register
} from './pages/main';
import { AdminLogin, AdminDashboard, MaterialManagement, FacultyOverlay, AIResponseAdmin } from './pages/admin';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminAuthProvider } from './context/admin/AdminAuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ProtectedAdminRoute } from './components/admin';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { isCollapsed, setIsCollapsed } = React.useContext(SidebarContext);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [chats, setChats] = React.useState<any[]>([]);
  const [isLoadingChats, setIsLoadingChats] = React.useState(false);

  // Load user's chats
  React.useEffect(() => {
    const loadChats = async () => {
      if (!user) return;
      
      try {
        setIsLoadingChats(true);
        const { chatService } = await import('./services');
        const response = await chatService.getUserChats(1, 10); // Get first 10 chats
        setChats(response.chats);
      } catch (error) {
        console.error('Error loading chats:', error);
      } finally {
        setIsLoadingChats(false);
      }
    };

    loadChats();
  }, [user]);

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatChatTimestamp = (dateString: string) => {
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

  const navigate = useNavigate();

  const handleNewChat = () => {
    navigate('/home');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 ease-in-out bg-gradient-to-b from-zinc-950 via-zinc-950/95 to-zinc-950/90 backdrop-blur-xl border-r border-zinc-700/50 shadow-2xl shadow-black/20 flex flex-col ${isCollapsed ? 'w-16' : 'w-72'} md:${isCollapsed ? 'w-16' : 'w-72'} ${isCollapsed ? '' : 'max-md:w-16'}`}>
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-700/50">
        {isCollapsed ? (
          // When collapsed, logo acts as expand button
          <button 
            className="w-8 h-8 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg shadow-primary/20 border border-primary/20" 
            onClick={toggleSidebar}
          >
            <div className="w-4 h-4 bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-full relative">
              <div className="absolute inset-1 bg-white rounded-full"></div>
              <div className="absolute inset-2 bg-primary rounded-full"></div>
            </div>
          </button>
        ) : (
          // When expanded, show logo and separate minimize button
          <>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 border border-primary/20">
                <div className="w-4 h-4 bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-full relative">
                  <div className="absolute inset-1 bg-white rounded-full"></div>
                  <div className="absolute inset-2 bg-primary rounded-full"></div>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-br from-white via-gray-100 to-gray-200 bg-clip-text text-transparent max-md:hidden">FAXit</span>
            </div>
            <button 
              className="w-8 h-8 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 max-md:hidden" 
              onClick={toggleSidebar}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {/* New Chat Button */}
      {!isCollapsed ? (
        <div className="p-4 max-md:hidden">
          <button 
            className="w-full bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-600 hover:via-zinc-700 hover:to-zinc-800 text-white rounded-xl px-4 py-3 font-semibold transition-all duration-200 shadow-lg shadow-black/20 hover:shadow-black/30 hover:-translate-y-0.5 hover:scale-101 relative overflow-hidden group flex items-center gap-3"
            onClick={handleNewChat}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative z-10">
              <path d="M12 5v14m-7-7h14"/>
            </svg>
            <span className="relative z-10">Novi Chat</span>
          </button>
        </div>
      ) : (
        <div className="p-2 flex justify-center">
          <button 
            className="w-12 h-12 bg-gradient-to-r from-zinc-700/50 via-zinc-800/30 to-zinc-900/20 hover:from-zinc-600/60 hover:via-zinc-700/40 hover:to-zinc-800/30 border border-zinc-700/50 hover:border-zinc-600/70 rounded-xl flex items-center justify-center text-white hover:text-gray-200 transition-all duration-200 shadow-lg hover:shadow-black/20 hover:scale-102" 
            onClick={handleNewChat} 
            title="Novi Chat"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14m-7-7h14"/>
            </svg>
          </button>
        </div>
      )}

      {/* Search Chats */}
      {!isCollapsed ? (
        <div className="px-4 pb-4 max-md:hidden">
          <div className="relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Pretraži chatove..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 focus:border-primary/50 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            />
          </div>
        </div>
      ) : (
        <div className="p-2 flex justify-center">
          <button className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300" title="Pretraži chatove">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>
      )}

      {/* Chats Section */}
      {!isCollapsed && (
        <div className="flex-1 flex flex-col px-4 pb-4 overflow-hidden max-md:hidden min-h-0">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Chatovi</h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 chats-list">
              {isLoadingChats ? (
                <div className="flex items-center justify-center py-8 text-gray-400 text-sm">Učitavam chatove...</div>
              ) : filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <div 
                    key={chat.id} 
                    className="group cursor-pointer p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                    onClick={() => navigate(`/chat/${chat.id}`)}
                  >
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-white group-hover:text-primary transition-colors duration-300 line-clamp-2">{chat.title}</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                          chat.mode === 'explain' ? 'bg-primary/10 text-primary border-primary/20' :
                          chat.mode === 'solve' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                          chat.mode === 'summary' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          chat.mode === 'tests' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          chat.mode === 'learning' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                          {chat.mode === 'explain' ? 'Objasni' :
                           chat.mode === 'solve' ? 'Reši' :
                           chat.mode === 'summary' ? 'Sažmi' :
                           chat.mode === 'tests' ? 'Testovi' :
                           chat.mode === 'learning' ? 'Učenje' : chat.mode}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12,6 12,12 16,14"/>
                          </svg>
                          {formatChatTimestamp(chat.lastMessageAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-3 opacity-50">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <p className="text-sm">Još nema chatova</p>
                </div>
              )}
          </div>
        </div>
      )}


      {/* Navigation Icons - All at bottom */}
      <div className="mt-auto pb-4 flex-shrink-0">
        <div className={`${isCollapsed ? 'space-y-1 px-2' : 'space-y-1 px-4'} max-md:space-y-1 max-md:px-2`}>
          <Link 
            to="/dashboard" 
            className={`group flex items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/10 ${
              location.pathname === '/dashboard' 
                ? 'bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 text-primary border border-primary/30 shadow-lg shadow-primary/20' 
                : 'text-gray-400 hover:text-white'
            } ${isCollapsed ? 'justify-center' : ''} max-md:justify-center`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            {!isCollapsed && <span className="text-sm font-medium max-md:hidden">Dashboard</span>}
          </Link>
          
          <Link 
            to="/notes" 
            className={`group flex items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/10 ${
              location.pathname === '/notes' 
                ? 'bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 text-primary border border-primary/30 shadow-lg shadow-primary/20' 
                : 'text-gray-400 hover:text-white'
            } ${isCollapsed ? 'justify-center' : ''} max-md:justify-center`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            {!isCollapsed && <span className="text-sm font-medium max-md:hidden">Beleške</span>}
          </Link>
          
          <Link 
            to="/calendar" 
            className={`group flex items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/10 ${
              location.pathname === '/calendar' 
                ? 'bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 text-primary border border-primary/30 shadow-lg shadow-primary/20' 
                : 'text-gray-400 hover:text-white'
            } ${isCollapsed ? 'justify-center' : ''} max-md:justify-center`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {!isCollapsed && <span className="text-sm font-medium max-md:hidden">Zadaci i rokovi</span>}
          </Link>
          
          <Link 
            to="/profile" 
            className={`group flex items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/10 ${
              location.pathname === '/profile' 
                ? 'bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 text-primary border border-primary/30 shadow-lg shadow-primary/20' 
                : 'text-gray-400 hover:text-white'
            } ${isCollapsed ? 'justify-center' : ''} max-md:justify-center`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {!isCollapsed && <span className="text-sm font-medium max-md:hidden">Profile</span>}
          </Link>
          
          <button className={`group flex items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/10 text-gray-400 hover:text-white ${isCollapsed ? 'justify-center' : ''} max-md:justify-center`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
            </svg>
            {!isCollapsed && <span className="text-sm font-medium max-md:hidden">Settings</span>}
          </button>
          
          <button 
            className={`group flex items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-red-500/10 hover:shadow-lg hover:shadow-red-500/10 text-muted-foreground hover:text-red-400 ${isCollapsed ? 'justify-center' : ''} max-md:justify-center`}
            onClick={logout}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {!isCollapsed && <span className="text-sm font-medium max-md:hidden">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

const SidebarContext = React.createContext<{
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}>({ isCollapsed: false, setIsCollapsed: () => {} });

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  
  // Force collapsed state on mobile
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="min-h-screen bg-background text-foreground">
        <Sidebar />
        <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-16' : 'ml-72'} max-md:ml-16`}>
          {children}
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

const RootRedirect: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <Navigate to="/main/pocetna" replace />;
};

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Router>
        <Routes>
          {/* Root redirect based on auth status */}
          <Route path="/" element={<RootRedirect />} />
          
          {/* Protected authenticated routes */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Layout><Home /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/notes" element={
            <ProtectedRoute>
              <Layout><Notes /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <Layout><Calendar /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/chat/:chatId" element={
            <ProtectedRoute>
              <Layout><Chat /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Public main routes */}
          <Route path="/main" element={<Navigate to="/main/pocetna" replace />} />
          <Route path="/main/pocetna" element={<MainHome />} />
          <Route path="/main/kako-funkcionise" element={<HowItWorks />} />
          <Route path="/main/podrzani-fakulteti" element={<SupportedFaculties />} />
          <Route path="/main/demonstracija" element={<Demo />} />
          <Route path="/main/cene" element={<Pricing />} />
          <Route path="/main/faq" element={<FAQ />} />
          <Route path="/main/kontakt" element={<Contact />} />
          <Route path="/main/login" element={<Login />} />
          <Route path="/main/register" element={<Register />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/materials" element={
            <ProtectedAdminRoute>
              <MaterialManagement />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/materials/faculty/:facultyId" element={
            <ProtectedAdminRoute>
              <FacultyOverlay />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/ai-response" element={
            <ProtectedAdminRoute>
              <AIResponseAdmin />
            </ProtectedAdminRoute>
          } />
        </Routes>
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
