import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { TooltipProvider } from '../components/ui/tooltip';
import { Plus, Search, Edit, Trash2, FileText, BookOpen } from 'lucide-react';
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
      <div className="w-full min-h-screen relative bg-background text-foreground font-inter">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/2 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(2px_2px_at_20px_30px,rgba(78,60,250,0.3),transparent),radial-gradient(2px_2px_at_40px_70px,rgba(78,60,250,0.2),transparent)] bg-repeat bg-[length:150px_150px] pointer-events-none" />
        
        <div className={styles.notesContainer}>
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Beleške
              </h1>
              <p className="text-lg text-muted-foreground">
                Organizuj svoje učenje kroz strukturirane beleške
              </p>
            </div>
            <Button className="group bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nova beleška
              </span>
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-6 mb-12 flex-wrap items-center">
            <div className="relative flex-1 min-w-80">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Pretraži beleške..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-white/5 border-white/20 hover:border-white/40 focus:border-primary/50 text-foreground placeholder:text-muted-foreground rounded-2xl backdrop-blur-xl"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48 h-12 bg-white/5 border-white/20 hover:border-white/40 focus:border-primary/50 text-foreground rounded-2xl backdrop-blur-xl">
                <SelectValue placeholder="Izaberi predmet" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-xl border-white/20">
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject} className="text-foreground hover:bg-primary/10">
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNotes.map(note => (
              <Card key={note.id} className="group cursor-pointer transition-all duration-700 text-left backdrop-blur-xl relative overflow-hidden hover:-translate-y-4 hover:scale-105 border-primary/20 shadow-xl shadow-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-background/70">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <CardHeader className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-2xl w-fit shadow-lg group-hover:shadow-primary/40 group-hover:scale-110 transition-all duration-500 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                      <FileText className="w-6 h-6 text-primary group-hover:text-primary/90 transition-colors duration-300 relative z-10" />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/20 text-muted-foreground hover:text-primary">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-500/20 text-muted-foreground hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {note.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 relative z-10">
                  <p className="text-base text-muted-foreground leading-relaxed group-hover:text-muted-foreground/90 transition-colors duration-300 mb-4">
                    {note.content.substring(0, 120)}...
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col gap-1">
                      <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 w-fit">
                        {note.subject}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{note.lesson}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Ažurirano {note.updatedAt}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs border-primary/30 text-primary/80 hover:bg-primary/10">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-20 col-span-full">
              <div className="mx-auto mb-6 p-6 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-3xl w-fit shadow-lg relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
                <Search className="w-16 h-16 text-primary/70 relative z-10" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Nema rezultata</h3>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
                Pokušajte sa drugim pretraživanjem ili izaberite drugi predmet
              </p>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Notes;