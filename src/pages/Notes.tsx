import React, { useState } from 'react';
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
    <div className={styles.notesPage}>
      <div className={styles.notesContainer}>
        {/* Header */}
        <div className={styles.notesHeader}>
          <div className={styles.notesTitleSection}>
            <h1 className={styles.notesTitle}>Beleške</h1>
            <p className={styles.notesSubtitle}>Organizuj svoje učenje kroz strukturirane beleške</p>
          </div>
          <button className={styles.notesCreateBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14m-7-7h14"/>
            </svg>
            Nova beleška
          </button>
        </div>

        {/* Filters */}
        <div className={styles.notesFilters}>
          <div className={styles.notesSearch}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Pretraži beleške..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.notesSearchInput}
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className={styles.notesSubjectFilter}
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        {/* Notes Grid */}
        <div className={styles.notesGrid}>
          {filteredNotes.map(note => (
            <div key={note.id} className={styles.noteCard}>
              <div className={styles.noteCardHeader}>
                <h3 className={styles.noteTitle}>{note.title}</h3>
                <div className={styles.noteActions}>
                  <button className={styles.noteActionBtn}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    </svg>
                  </button>
                  <button className={styles.noteActionBtn}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className={styles.noteContentPreview}>
                {note.content.substring(0, 120)}...
              </div>
              
              <div className={styles.noteMeta}>
                <div className={styles.noteSubjectLesson}>
                  <span className={styles.noteSubject}>{note.subject}</span>
                  <span className={styles.noteLesson}>{note.lesson}</span>
                </div>
                <div className={styles.noteDates}>
                  <span className={styles.noteUpdated}>Ažurirano {note.updatedAt}</span>
                </div>
              </div>
              
              <div className={styles.noteTags}>
                {note.tags.map(tag => (
                  <span key={tag} className={styles.noteTag}>#{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className={styles.notesEmptyState}>
            <div className={styles.emptyStateIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <h3 className={styles.emptyStateTitle}>Nema rezultata</h3>
            <p className={styles.emptyStateDescription}>
              Pokušajte sa drugim pretraživanjem ili izaberite drugi predmet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;