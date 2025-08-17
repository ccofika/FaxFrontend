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
  ChevronRight, Clock
} from 'lucide-react';
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
      <div className="w-full min-h-screen relative bg-background text-foreground font-inter">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/2 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(2px_2px_at_20px_30px,rgba(78,60,250,0.3),transparent),radial-gradient(2px_2px_at_40px_70px,rgba(78,60,250,0.2),transparent)] bg-repeat bg-[length:150px_150px] pointer-events-none" />
        
        <div className={styles.dashboardContainer}>
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Brz pristup svim funkcijama i pregled aktivnosti
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Brza pretraga</h2>
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Pitaj AI bilo šta..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 h-14 bg-white/5 border-white/20 hover:border-white/40 focus:border-primary/50 text-foreground placeholder:text-muted-foreground rounded-2xl backdrop-blur-xl text-lg"
              />
              <Button 
                onClick={handleQuickSearch}
                disabled={!quickSearch.trim()}
                className="absolute right-2 top-2 h-10 w-10 p-0 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary rounded-xl"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Chat Mode Shortcuts */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">AI Modovi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {chatModes.map((mode) => (
                <Card
                  key={mode.id}
                  className="group cursor-pointer transition-all duration-700 text-center backdrop-blur-xl relative overflow-hidden hover:-translate-y-4 hover:scale-105 border-primary/20 shadow-xl shadow-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-background/70"
                  onClick={() => handleModeClick(mode.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-2xl w-fit shadow-lg group-hover:shadow-primary/40 group-hover:scale-110 transition-all duration-500 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                      <div className="text-primary group-hover:text-primary/90 transition-colors duration-300 relative z-10">
                        {mode.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{mode.name}</h3>
                    <p className="text-sm text-muted-foreground text-center leading-relaxed group-hover:text-muted-foreground/90 transition-colors duration-300">
                      {mode.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Chats */}
            <Card className="backdrop-blur-xl border-primary/20 shadow-xl shadow-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-background/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  Nedavni razgovori
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">Kako funkcioniše React Router?</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="secondary" className="bg-primary/20 text-primary">Objasni</Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pre 2 sata
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">Objasni algoritme sortiranja</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">Učenje</Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pre 5 sati
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">Test iz matematike - integrali</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="secondary" className="bg-red-500/20 text-red-400">Testovi</Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Juče
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Student Subjects */}
            <Card className="backdrop-blur-xl border-primary/20 shadow-xl shadow-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-background/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-primary" />
                  Moji predmeti
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Monitor className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2">Informacioni sistemi</h4>
                    <div className="space-y-1">
                      <Progress value={75} className="h-2" />
                      <span className="text-sm text-muted-foreground">75% završeno</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Calculator className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2">Matematička analiza</h4>
                    <div className="space-y-1">
                      <Progress value={60} className="h-2" />
                      <span className="text-sm text-muted-foreground">60% završeno</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Code className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2">Programiranje</h4>
                    <div className="space-y-1">
                      <Progress value={90} className="h-2" />
                      <span className="text-sm text-muted-foreground">90% završeno</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2">Statistika</h4>
                    <div className="space-y-1">
                      <Progress value={45} className="h-2" />
                      <span className="text-sm text-muted-foreground">45% završeno</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Dashboard;