import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { TooltipProvider } from '../components/ui/tooltip';
import { 
  Search, BookOpen, Zap, FileText, GraduationCap, 
  MessageCircle, Monitor, Calculator, Code, TrendingUp,
  ChevronRight, Clock, Sparkles, Rocket, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Dashboard.module.css';

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
    name: 'Objasni', 
    description: 'Detaljno objašnjavanje gradiva', 
    color: '#4E3CFA', 
    icon: <BookOpen className="w-6 h-6" />
  },
  { 
    id: 'solve', 
    name: 'Reši', 
    description: 'Pronađi rešenja problema', 
    color: '#F59E0B', 
    icon: <Zap className="w-6 h-6" />
  },
  { 
    id: 'summary', 
    name: 'Sažmi', 
    description: 'Kratak pregled gradiva', 
    color: '#10B981', 
    icon: <FileText className="w-6 h-6" />
  },
  { 
    id: 'tests', 
    name: 'Testovi', 
    description: 'Generiši testove i kvizove', 
    color: '#EF4444', 
    icon: <GraduationCap className="w-6 h-6" />
  },
  { 
    id: 'learning', 
    name: 'Učenje', 
    description: 'Interaktivna pomoć u učenju', 
    color: '#3B82F6', 
    icon: <TrendingUp className="w-6 h-6" />
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [quickSearch, setQuickSearch] = useState('');

  const handleQuickSearch = () => {
    if (quickSearch.trim()) {
      console.log('Quick search:', quickSearch);
      navigate('/home', { state: { quickQuery: quickSearch } });
    }
  };

  const handleModeClick = (mode: ChatMode) => {
    navigate('/home', { state: { selectedMode: mode } });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuickSearch();
    }
  };

  return (
    <TooltipProvider>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full min-h-screen relative bg-zinc-950 text-white font-inter"
      >
        {/* NADRKAN Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/70 via-zinc-950 to-zinc-900/50 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(2px_2px_at_20px_30px,rgba(255,255,255,0.06),transparent),radial-gradient(2px_2px_at_40px_70px,rgba(255,255,255,0.03),transparent)] bg-repeat bg-[length:150px_150px] pointer-events-none opacity-60" />
        
        {/* Floating dashboard elements animation */}
        <div className="absolute inset-0 -z-5 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
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
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 10,
              }}
            >
              {[Monitor, Calculator, Code, BookOpen][i % 4] && 
                React.createElement([Monitor, Calculator, Code, BookOpen][i % 4], {
                  className: "w-6 h-6 text-white/10"
                })
              }
            </motion.div>
          ))}
        </div>
        
        <div className={styles.dashboardContainer}>
          {/* NADRKAN Header */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8, type: "spring", bounce: 0.4 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2 relative">
                  Dashboard
                  <motion.div
                    className="absolute -top-1 -right-8"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.15, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  >
                    <Rocket className="w-7 h-7 text-blue-400/70" />
                  </motion.div>
                </h1>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg text-gray-300"
              >
                Brz pristup svim funkcijama i pregled aktivnosti
              </motion.p>
            </div>
          </motion.div>

          {/* NADRKAN Quick Search */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-16"
          >
            <motion.h2 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-2xl font-bold bg-gradient-to-br from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-6"
            >
              Brza pretraga
            </motion.h2>
            <motion.div 
              className="relative max-w-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Pitaj AI bilo šta..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 h-14 bg-zinc-900/50 border-zinc-700/50 hover:border-zinc-600/50 focus:border-blue-500/50 text-white placeholder:text-gray-400 rounded-2xl backdrop-blur-xl text-lg"
              />
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  onClick={handleQuickSearch}
                  disabled={!quickSearch.trim()}
                  className="absolute right-2 top-2 h-10 w-10 p-0 bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-600 hover:via-zinc-700 hover:to-zinc-800 disabled:from-zinc-800 disabled:via-zinc-900 disabled:to-zinc-950 rounded-xl transition-all duration-300"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* NADRKAN Chat Mode Shortcuts */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mb-16"
          >
            <motion.h2 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="text-2xl font-bold bg-gradient-to-br from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-6"
            >
              AI Modovi
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {chatModes.map((mode, index) => (
                <motion.div
                  key={mode.id}
                  initial={{ y: 50, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6 + (index * 0.1), duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    y: -10, 
                    scale: 1.05,
                    rotateX: 5,
                  }}
                >
                  <Card
                    className="group cursor-pointer transition-all duration-700 text-center backdrop-blur-xl relative overflow-hidden border-zinc-800/50 shadow-xl shadow-black/20 bg-gradient-to-br from-zinc-900/50 via-zinc-800/30 to-zinc-900/40"
                    onClick={() => handleModeClick(mode.id)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    {/* Animated glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl"></div>
                    </div>
                    
                    <CardContent className="p-6 relative z-10">
                      <motion.div 
                        className="mx-auto mb-4 p-4 bg-gradient-to-br from-zinc-700/50 via-zinc-600/30 to-zinc-700/20 rounded-2xl w-fit shadow-lg relative"
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
                        <div className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300 relative z-10">
                          {mode.icon}
                        </div>
                      </motion.div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">{mode.name}</h3>
                      <p className="text-sm text-gray-300 text-center leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        {mode.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* NADRKAN Dashboard Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* NADRKAN Recent Chats */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.8 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className="backdrop-blur-xl border-zinc-800/50 shadow-xl shadow-black/20 bg-gradient-to-br from-zinc-900/50 via-zinc-800/30 to-zinc-900/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, delay: 3 }}
                    >
                      <MessageCircle className="w-6 h-6 text-blue-400" />
                    </motion.div>
                    <span className="bg-gradient-to-br from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                      Nedavni razgovori
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 2.4, duration: 0.6 }}
                    whileHover={{ x: 5, scale: 1.02 }}
                    className="flex items-center gap-4 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30 hover:bg-zinc-700/30 transition-colors cursor-pointer"
                  >
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">Kako funkcioniše React Router?</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">Objasni</Badge>
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pre 2 sata
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </motion.div>
                  
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 2.6, duration: 0.6 }}
                    whileHover={{ x: 5, scale: 1.02 }}
                    className="flex items-center gap-4 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30 hover:bg-zinc-700/30 transition-colors cursor-pointer"
                  >
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">Objasni algoritme sortiranja</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">Učenje</Badge>
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pre 5 sati
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </motion.div>
                  
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 2.8, duration: 0.6 }}
                    whileHover={{ x: 5, scale: 1.02 }}
                    className="flex items-center gap-4 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30 hover:bg-zinc-700/30 transition-colors cursor-pointer"
                  >
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">Test iz matematike - integrali</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="secondary" className="bg-red-500/20 text-red-400">Testovi</Badge>
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Juče
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* NADRKAN Student Subjects */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.8 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className="backdrop-blur-xl border-zinc-800/50 shadow-xl shadow-black/20 bg-gradient-to-br from-zinc-900/50 via-zinc-800/30 to-zinc-900/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 4 }}
                    >
                      <GraduationCap className="w-6 h-6 text-green-400" />
                    </motion.div>
                    <span className="bg-gradient-to-br from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                      Moji predmeti
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 3, duration: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30"
                  >
                    <motion.div 
                      className="p-2 bg-blue-500/20 rounded-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Monitor className="w-5 h-5 text-blue-400" />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2">Informacioni sistemi</h4>
                      <div className="space-y-1">
                        <Progress value={75} className="h-2" />
                        <span className="text-sm text-gray-400">75% završeno</span>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 3.2, duration: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30"
                  >
                    <motion.div 
                      className="p-2 bg-orange-500/20 rounded-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Calculator className="w-5 h-5 text-orange-400" />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2">Matematička analiza</h4>
                      <div className="space-y-1">
                        <Progress value={60} className="h-2" />
                        <span className="text-sm text-gray-400">60% završeno</span>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 3.4, duration: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30"
                  >
                    <motion.div 
                      className="p-2 bg-green-500/20 rounded-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Code className="w-5 h-5 text-green-400" />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2">Programiranje</h4>
                      <div className="space-y-1">
                        <Progress value={90} className="h-2" />
                        <span className="text-sm text-gray-400">90% završeno</span>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 3.6, duration: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30"
                  >
                    <motion.div 
                      className="p-2 bg-purple-500/20 rounded-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2">Statistika</h4>
                      <div className="space-y-1">
                        <Progress value={45} className="h-2" />
                        <span className="text-sm text-gray-400">45% završeno</span>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default Dashboard;