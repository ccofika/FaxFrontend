import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { TooltipProvider } from '../components/ui/tooltip';
import { Plus, Search, Edit, Trash2, FileText, BookOpen, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Notes.module.css';

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  lesson: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

const Notes: React.FC = () => {
  // Mock data for styling
  const mockNotes: Note[] = [
    {
      id: '1',
      title: 'Teorema Pitagore',
      content: 'Teorema Pitagore kaže da je u pravouglom trouglu kvadrat hipotenuze jednak zbiru kvadrata kateta...',
      subject: 'Matematika 1',
      lesson: 'Osnove geometrije',
      createdAt: 'Pre 2 dana',
      updatedAt: 'Pre 1 dan',
      tags: ['geometrija', 'teorema', 'važno']
    },
    {
      id: '2',
      title: 'Sortiranje nizova',
      content: 'Bubble sort algoritam poredi susedne elemente i menja im mesta ako nisu u dobrom redosledu...',
      subject: 'Programiranje 1',
      lesson: 'Algoritmi sortiranja',
      createdAt: 'Pre 3 dana',
      updatedAt: 'Pre 2 dana',
      tags: ['algoritmi', 'sortiranje', 'bubble-sort']
    },
    {
      id: '3',
      title: 'Njutnovi zakoni',
      content: 'Prvi Njutnov zakon - zakon inercije: Telo u mirovanju ostaje u mirovanju...',
      subject: 'Fizika 1',
      lesson: 'Dinamika',
      createdAt: 'Pre 5 dana',
      updatedAt: 'Pre 4 dana',
      tags: ['fizika', 'newton', 'dinamika']
    },
    {
      id: '4',
      title: 'Integrali funkcija',
      content: 'Neodređeni integral je inverzna operacija izvoda. Označava se simbolom ∫...',
      subject: 'Matematika 1',
      lesson: 'Integralni račun',
      createdAt: 'Pre 1 nedelju',
      updatedAt: 'Pre 6 dana',
      tags: ['matematika', 'integrali', 'calculus']
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Svi predmeti');

  const subjects = ['Svi predmeti', ...Array.from(new Set(mockNotes.map(note => note.subject)))];

  const filteredNotes = mockNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'Svi predmeti' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <TooltipProvider>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full min-h-screen relative bg-zinc-950 text-white font-inter"
      >
        {/* NADRKAN Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/60 via-zinc-950 to-zinc-900/40 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(2px_2px_at_20px_30px,rgba(255,255,255,0.08),transparent),radial-gradient(2px_2px_at_40px_70px,rgba(255,255,255,0.04),transparent)] bg-repeat bg-[length:150px_150px] pointer-events-none opacity-50" />
        
        {/* Floating notes animation */}
        <div className="absolute inset-0 -z-5 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0.5 + Math.random() * 0.5,
              }}
              animate={{
                y: [null, Math.random() * -150, Math.random() * 150],
                rotate: [0, Math.random() * 360],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 15 + 15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 8,
              }}
            >
              <FileText className="w-4 h-4 text-white/20" />
            </motion.div>
          ))}
        </div>
        
        <div className={styles.notesContainer}>
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
                  Beleške
                  <motion.div
                    className="absolute -top-1 -right-8"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.15, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  >
                    <Zap className="w-7 h-7 text-blue-400/70" />
                  </motion.div>
                </h1>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg text-gray-300"
              >
                Organizuj svoje učenje kroz strukturirane beleške
              </motion.p>
            </div>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, duration: 0.8, type: "spring", bounce: 0.6 }}
            >
              <Button 
                className="group bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-600 hover:via-zinc-700 hover:to-zinc-800 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300 shadow-lg shadow-black/50 hover:shadow-black/70 hover:-translate-y-1 relative overflow-hidden"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.7 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Nova beleška
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* NADRKAN Filters */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex gap-6 mb-12 flex-wrap items-center"
          >
            <motion.div 
              className="relative flex-1 min-w-80"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Pretraži beleške..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-zinc-900/50 border-zinc-700/50 hover:border-zinc-600/50 focus:border-blue-500/50 text-white placeholder:text-gray-400 rounded-2xl backdrop-blur-xl"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48 h-12 bg-zinc-900/50 border-zinc-700/50 hover:border-zinc-600/50 focus:border-blue-500/50 text-white rounded-2xl backdrop-blur-xl">
                  <SelectValue placeholder="Izaberi predmet" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900/95 backdrop-blur-xl border-zinc-700/50">
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject} className="text-white hover:bg-zinc-800/50">
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </motion.div>

          {/* NADRKAN Notes Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ y: 100, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -100, opacity: 0, scale: 0.8 }}
                  transition={{ delay: 1.2 + (index * 0.1), duration: 0.8, type: "spring" }}
                  whileHover={{ 
                    y: -10, 
                    scale: 1.05,
                    rotateX: 5,
                    rotateY: 5,
                  }}
                >
                  <Card className="group cursor-pointer text-left backdrop-blur-xl relative overflow-hidden border-zinc-800/50 shadow-xl shadow-black/20 bg-gradient-to-br from-zinc-900/50 via-zinc-800/30 to-zinc-900/40">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    {/* Animated glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl"></div>
                    </div>
                    
                    <CardHeader className="p-6 relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <motion.div 
                          className="p-3 bg-gradient-to-br from-zinc-700/50 via-zinc-600/30 to-zinc-700/20 rounded-2xl w-fit shadow-lg relative"
                          whileHover={{ scale: 1.15, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
                          <FileText className="w-6 h-6 text-blue-400 relative z-10" />
                        </motion.div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-500/20 text-gray-400 hover:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                        {note.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 relative z-10">
                      <p className="text-base text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300 mb-4">
                        {note.content.substring(0, 120)}...
                      </p>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col gap-1">
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 w-fit">
                            {note.subject}
                          </Badge>
                          <span className="text-sm text-gray-400">{note.lesson}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          Ažurirano {note.updatedAt}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map((tag, tagIndex) => (
                          <motion.div
                            key={tag}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.4 + (index * 0.1) + (tagIndex * 0.05), type: "spring", bounce: 0.5 }}
                            whileHover={{ scale: 1.1 }}
                          >
                            <Badge variant="outline" className="text-xs border-zinc-600/50 text-zinc-300 hover:bg-zinc-700/30 hover:border-zinc-500/50">
                              #{tag}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredNotes.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-center py-20 col-span-full"
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
                <Search className="w-16 h-16 text-gray-400 relative z-10" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-3">Nema rezultata</h3>
              <p className="text-lg text-gray-400 leading-relaxed max-w-md mx-auto">
                Pokušajte sa drugim pretraživanjem ili izaberite drugi predmet
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default Notes;