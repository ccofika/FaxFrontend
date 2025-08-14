import React, { useState } from 'react';
import styles from './Calendar.module.css';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'kolokvijum' | 'zadatak' | 'ispit';
  subject: string;
  description?: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [userEvents, setUserEvents] = useState<CalendarEvent[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  // Mock data for demonstration
  const mockEvents: CalendarEvent[] = [
    // January events
    {
      id: '1',
      title: 'Kolokvijum iz Matematike 1',
      date: new Date(2025, 0, 15), // January 15, 2025
      type: 'kolokvijum',
      subject: 'Matematika 1',
      description: 'Kolokvijum pokriva materiju o funkcijama i izvodima'
    },
    {
      id: '2',
      title: 'Zadatak - Implementacija algoritma',
      date: new Date(2025, 0, 18), // January 18, 2025
      type: 'zadatak',
      subject: 'Programiranje 1',
      description: 'Implementirati bubble sort algoritam u C++'
    },
    {
      id: '3',
      title: 'Ispit iz Fizike 1',
      date: new Date(2025, 0, 22), // January 22, 2025
      type: 'ispit',
      subject: 'Fizika 1',
      description: 'Završni ispit iz fizike - kinematika i dinamika'
    },
    {
      id: '4',
      title: 'Kolokvijum iz Programiranja',
      date: new Date(2025, 0, 25), // January 25, 2025
      type: 'kolokvijum',
      subject: 'Programiranje 1',
      description: 'Kolokvijum iz osnova programiranja'
    },
    {
      id: '5',
      title: 'Zadatak - Esej',
      date: new Date(2025, 0, 28), // January 28, 2025
      type: 'zadatak',
      subject: 'Srpski jezik',
      description: 'Napisati esej o savremenim tendencijama u literaturi'
    },
    {
      id: '6',
      title: 'Zadatak - Domaći rad',
      date: new Date(2025, 0, 8), // January 8, 2025
      type: 'zadatak',
      subject: 'Engleski jezik',
      description: 'Prevod naučnog teksta sa engleskog na srpski'
    },
    {
      id: '7',
      title: 'Kolokvijum iz Fizike',
      date: new Date(2025, 0, 12), // January 12, 2025
      type: 'kolokvijum',
      subject: 'Fizika 1',
      description: 'Prvi kolokvijum - kinematika'
    },
    {
      id: '8',
      title: 'Zadatak - SQL upiti',
      date: new Date(2025, 0, 30), // January 30, 2025
      type: 'zadatak',
      subject: 'Baze podataka',
      description: 'Kreirati kompleksne SQL upite za zadatu bazu'
    },
    
    // February events
    {
      id: '9',
      title: 'Ispit iz Matematike 1',
      date: new Date(2025, 1, 3), // February 3, 2025
      type: 'ispit',
      subject: 'Matematika 1',
      description: 'Završni ispit iz matematike'
    },
    {
      id: '10',
      title: 'Kolokvijum iz Struktura podataka',
      date: new Date(2025, 1, 7), // February 7, 2025
      type: 'kolokvijum',
      subject: 'Strukture podataka',
      description: 'Kolokvijum iz lista i stabala'
    },
    {
      id: '11',
      title: 'Zadatak - Prezentacija',
      date: new Date(2025, 1, 14), // February 14, 2025
      type: 'zadatak',
      subject: 'Komunikologija',
      description: 'Pripremiti prezentaciju o digitalnim medijima'
    },
    {
      id: '12',
      title: 'Ispit iz Programiranja 1',
      date: new Date(2025, 1, 18), // February 18, 2025
      type: 'ispit',
      subject: 'Programiranje 1',
      description: 'Praktični deo ispita - programiranje u C++'
    },
    {
      id: '13',
      title: 'Zadatak - Laboratorijska vežba',
      date: new Date(2025, 1, 21), // February 21, 2025
      type: 'zadatak',
      subject: 'Fizika 1',
      description: 'Izveštaj sa laboratorijske vežbe - oscilacije'
    },
    {
      id: '14',
      title: 'Kolokvijum iz Statistike',
      date: new Date(2025, 1, 25), // February 25, 2025
      type: 'kolokvijum',
      subject: 'Statistika',
      description: 'Kolokvijum iz deskriptivne statistike'
    },
    {
      id: '15',
      title: 'Ispit iz Srpskog jezika',
      date: new Date(2025, 1, 28), // February 28, 2025
      type: 'ispit',
      subject: 'Srpski jezik',
      description: 'Završni ispit iz srpskog jezika i književnosti'
    },

    // March events
    {
      id: '16',
      title: 'Zadatak - Web aplikacija',
      date: new Date(2025, 2, 5), // March 5, 2025
      type: 'zadatak',
      subject: 'Web programiranje',
      description: 'Kreirati jednostavnu web aplikaciju u React-u'
    },
    {
      id: '17',
      title: 'Kolokvijum iz Diskretne matematike',
      date: new Date(2025, 2, 12), // March 12, 2025
      type: 'kolokvijum',
      subject: 'Diskretna matematika',
      description: 'Kolokvijum iz teorije grafova'
    },
    {
      id: '18',
      title: 'Ispit iz Baza podataka',
      date: new Date(2025, 2, 19), // March 19, 2025
      type: 'ispit',
      subject: 'Baze podataka',
      description: 'Teorijski i praktični deo ispita'
    },
    {
      id: '19',
      title: 'Zadatak - Analiza slučaja',
      date: new Date(2025, 2, 26), // March 26, 2025
      type: 'zadatak',
      subject: 'Ekonomija',
      description: 'Analiza ekonomskog slučaja iz prakse'
    },

    // October 2025 events
    {
      id: '20',
      title: 'Kolokvijum iz Matematike 2',
      date: new Date(2025, 9, 3), // October 3, 2025
      type: 'kolokvijum',
      subject: 'Matematika 2',
      description: 'Prvi kolokvijum - diferencijalne jednačine'
    },
    {
      id: '21',
      title: 'Zadatak - Android aplikacija',
      date: new Date(2025, 9, 7), // October 7, 2025
      type: 'zadatak',
      subject: 'Mobilno programiranje',
      description: 'Kreirati osnovnu Android aplikaciju u Java/Kotlin'
    },
    {
      id: '22',
      title: 'Ispit iz Operativnih sistema',
      date: new Date(2025, 9, 10), // October 10, 2025
      type: 'ispit',
      subject: 'Operativni sistemi',
      description: 'Završni ispit - procesi, niti i upravljanje memorijom'
    },
    {
      id: '23',
      title: 'Kolokvijum iz Algoritma',
      date: new Date(2025, 9, 14), // October 14, 2025
      type: 'kolokvijum',
      subject: 'Algoritmi i strukture podataka',
      description: 'Kolokvijum iz kompleksnosti algoritma'
    },
    {
      id: '24',
      title: 'Zadatak - Seminarski rad',
      date: new Date(2025, 9, 18), // October 18, 2025
      type: 'zadatak',
      subject: 'Softversko inženjerstvo',
      description: 'Seminarski rad o metodologijama razvoja softvera'
    },
    {
      id: '25',
      title: 'Ispit iz Fizike 2',
      date: new Date(2025, 9, 22), // October 22, 2025
      type: 'ispit',
      subject: 'Fizika 2',
      description: 'Završni ispit - elektromagnetizam i optika'
    },
    {
      id: '26',
      title: 'Kolokvijum iz Web tehnologija',
      date: new Date(2025, 9, 25), // October 25, 2025
      type: 'kolokvijum',
      subject: 'Web tehnologije',
      description: 'Kolokvijum iz JavaScript-a i Node.js'
    },
    {
      id: '27',
      title: 'Zadatak - Machine Learning model',
      date: new Date(2025, 9, 29), // October 29, 2025
      type: 'zadatak',
      subject: 'Mašinsko učenje',
      description: 'Implementirati i trenirati osnovni ML model'
    }
  ];

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Combine mock events with user events
  const allEvents = [...mockEvents, ...userEvents];

  // Get events for current month
  const monthEvents = allEvents.filter(event => 
    event.date.getMonth() === currentMonth && 
    event.date.getFullYear() === currentYear
  );

  // Get upcoming events (next 30 days)
  const upcomingEvents = allEvents
    .filter(event => event.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventForDate = (day: number) => {
    return monthEvents.find(event => event.date.getDate() === day);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('sr-RS', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTimeUntil = (date: Date) => {
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Danas';
    if (diffDays === 1) return 'Sutra';
    if (diffDays <= 7) return `Za ${diffDays} dana`;
    return `Za ${diffDays} dana`;
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'kolokvijum': return '#F59E0B'; // Yellow
      case 'zadatak': return '#10B981'; // Green
      case 'ispit': return '#EF4444'; // Red
      default: return '#6B7280';
    }
  };

  const getEventTypeLabel = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'kolokvijum': return 'Kolokvijum';
      case 'zadatak': return 'Zadatak';
      case 'ispit': return 'Ispit';
      default: return '';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={`${styles.calendarDay} ${styles.empty}`}></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const event = getEventForDate(day);
      const isToday = today.getDate() === day && 
                     today.getMonth() === currentMonth && 
                     today.getFullYear() === currentYear;
      
      days.push(
        <div 
          key={day} 
          className={`${styles.calendarDay} ${isToday ? styles.today : ''} ${event ? styles.hasEvent : ''}`}
          onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
        >
          <span className={styles.dayNumber}>{day}</span>
          {event && (
            <div 
              className={`${styles.eventIndicator} ${styles[event.type]}`}
              style={{ backgroundColor: getEventTypeColor(event.type) }}
            >
              <span className={styles.eventTitle}>{event.title}</span>
              {userEvents.some(userEvent => userEvent.id === event.id) && (
                <button
                  className={styles.deleteEventBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserEvents(prev => prev.filter(userEvent => userEvent.id !== event.id));
                  }}
                  title="Obriši događaj"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className={styles.calendarPage}>
      {/* Success Notification */}
      {showNotification && (
        <div className={styles.successNotification}>
          <div className={styles.notificationContent}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
            <span>Događaj je uspešno dodat!</span>
          </div>
          <button 
            className={styles.notificationClose}
            onClick={() => setShowNotification(false)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}
      
      <div className={styles.calendarContainer}>
        {/* Header */}
        <div className={styles.calendarHeader}>
          <div className={styles.calendarTitleSection}>
            <h1 className={styles.calendarTitle}>Zadaci i rokovi</h1>
            <p className={styles.calendarSubtitle}>Upravljajte svojim obavezama i rokovima</p>
          </div>
          <button 
            className={styles.addEventBtn}
            onClick={() => setIsAddEventModalOpen(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14m-7-7h14"/>
            </svg>
            Dodaj događaj
          </button>
        </div>

        <div className={styles.calendarLayout}>
          {/* Calendar Section */}
          <div className={styles.calendarSection}>
            <div className={styles.calendarNav}>
              <button className={styles.navButton} onClick={() => navigateMonth('prev')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <h2 className={styles.calendarMonth}>
                {currentDate.toLocaleDateString('sr-RS', { month: 'long', year: 'numeric' })}
              </h2>
              <button className={styles.navButton} onClick={() => navigateMonth('next')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>

            <div className={styles.calendarGrid}>
              {/* Day headers */}
              {['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'].map(day => (
                <div key={day} className={styles.calendarHeaderDay}>{day}</div>
              ))}
              
              {/* Calendar days */}
              {renderCalendarDays()}
            </div>

            {/* Legend */}
            <div className={styles.calendarLegend}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendColor} ${styles.kolokvijum}`} style={{ backgroundColor: getEventTypeColor('kolokvijum') }}></div>
                <span>Kolokvijumi</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendColor} ${styles.zadatak}`} style={{ backgroundColor: getEventTypeColor('zadatak') }}></div>
                <span>Zadaci</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendColor} ${styles.ispit}`} style={{ backgroundColor: getEventTypeColor('ispit') }}></div>
                <span>Ispiti</span>
              </div>
            </div>
          </div>

          {/* Side Panel - Upcoming Duties */}
          <div className={styles.dutiesPanel}>
            <h3 className={styles.dutiesTitle}>Upcoming Duties</h3>
            
            <div className={styles.dutiesList}>
              {upcomingEvents.map(event => (
                <div key={event.id} className={styles.dutyItem}>
                  <div className={styles.dutyHeader}>
                    <div 
                      className={styles.dutyTypeIndicator}
                      style={{ backgroundColor: getEventTypeColor(event.type) }}
                    >
                      {getEventTypeLabel(event.type)}
                    </div>
                    <span className={styles.dutyTime}>{formatTimeUntil(event.date)}</span>
                  </div>
                  
                  <h4 className={styles.dutyTitle}>{event.title}</h4>
                  <p className={styles.dutySubject}>{event.subject}</p>
                  <p className={styles.dutyDate}>{formatDate(event.date)}</p>
                  
                  {event.description && (
                    <p className={styles.dutyDescription}>{event.description}</p>
                  )}
                </div>
              ))}
            </div>

            {upcomingEvents.length === 0 && (
              <div className={styles.dutiesEmpty}>
                <div className={styles.emptyIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <p>Nema nadolazećih obaveza</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Event Modal */}
        {isAddEventModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsAddEventModalOpen(false)}>
            <div className={styles.addEventModal} onClick={(e) => e.stopPropagation()}>
              <AddEventForm 
                onClose={() => setIsAddEventModalOpen(false)}
                onAddEvent={(newEvent) => {
                  setUserEvents(prev => [...prev, newEvent]);
                  setIsAddEventModalOpen(false);
                  setShowNotification(true);
                  setTimeout(() => setShowNotification(false), 3000);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add Event Form Component
interface AddEventFormProps {
  onClose: () => void;
  onAddEvent: (event: CalendarEvent) => void;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ onClose, onAddEvent }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    type: 'zadatak' as CalendarEvent['type'],
    date: '',
    description: ''
  });
  const [isCalendarPickerOpen, setIsCalendarPickerOpen] = useState(false);

  const subjects = [
    'Matematika 1', 'Matematika 2', 'Programiranje 1', 'Fizika 1', 'Fizika 2',
    'Baze podataka', 'Web programiranje', 'Algoritmi i strukture podataka',
    'Operativni sistemi', 'Softversko inženjerstvo', 'Diskretna matematika',
    'Strukture podataka', 'Statistika', 'Srpski jezik', 'Engleski jezik',
    'Komunikologija', 'Ekonomija', 'Web tehnologije', 'Mobilno programiranje',
    'Mašinsko učenje'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subject || !formData.date) {
      alert('Molimo popunite sva polja');
      return;
    }

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: formData.title,
      subject: formData.subject,
      type: formData.type,
      date: new Date(formData.date),
      description: formData.description || undefined
    };

    onAddEvent(newEvent);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={styles.addEventForm}>
      <div className={styles.modalHeader}>
        <h2>Dodaj novi događaj</h2>
        <button className={styles.modalCloseBtn} onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.eventForm}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Naziv događaja *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Unesite naziv zadatka, kolokvijuma ili ispita"
            className={styles.formInput}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Predmet *</label>
          <select
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            className={styles.formSelect}
            required
          >
            <option value="">Izaberite predmet</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Tip događaja *</label>
          <select
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value as CalendarEvent['type'])}
            className={styles.formSelect}
            required
          >
            <option value="zadatak">Zadatak</option>
            <option value="kolokvijum">Kolokvijum</option>
            <option value="ispit">Ispit</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Datum *</label>
          <div className={styles.datePickerContainer}>
            <input
              type="text"
              value={formData.date ? new Date(formData.date).toLocaleDateString('sr-RS') : ''}
              onClick={() => setIsCalendarPickerOpen(true)}
              placeholder="Kliknite da izaberete datum"
              className={`${styles.formInput} ${styles.datePickerInput}`}
              readOnly
              required
            />
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className={styles.datePickerIcon}
              onClick={() => setIsCalendarPickerOpen(true)}
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            
            {isCalendarPickerOpen && (
              <div className={styles.miniCalendarOverlay} onClick={() => setIsCalendarPickerOpen(false)}>
                <div className={styles.miniCalendar} onClick={(e) => e.stopPropagation()}>
                  <MiniCalendar 
                    onDateSelect={(date) => {
                      handleChange('date', date.toISOString().split('T')[0]);
                      setIsCalendarPickerOpen(false);
                    }}
                    onClose={() => setIsCalendarPickerOpen(false)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Opis (opciono)</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Dodajte opis zadatka, teme kolokvijuma ili detalje ispita"
            className={styles.formTextarea}
            rows={3}
          />
        </div>

        <div className={styles.formActions}>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Otkaži
          </button>
          <button type="submit" className={styles.submitBtn}>
            Dodaj događaj
          </button>
        </div>
      </form>
    </div>
  );
};

// Mini Calendar Component
interface MiniCalendarProps {
  onDateSelect: (date: Date) => void;
  onClose: () => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ onDateSelect, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };
  
  const renderDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className={`${styles.miniCalendarDay} ${styles.empty}`}></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = today.toDateString() === date.toDateString();
      const isPast = date < today && !isToday;
      
      days.push(
        <div
          key={day}
          className={`${styles.miniCalendarDay} ${isToday ? styles.today : ''} ${isPast ? styles.past : ''}`}
          onClick={() => onDateSelect(date)}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <div className={styles.miniCalendarPopup}>
      <div className={styles.miniCalendarHeader}>
        <button onClick={() => navigateMonth('prev')} className={styles.miniNavBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <h3 className={styles.miniCalendarTitle}>
          {currentMonth.toLocaleDateString('sr-RS', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={() => navigateMonth('next')} className={styles.miniNavBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
      
      <div className={styles.miniCalendarGrid}>
        {['N', 'P', 'U', 'S', 'Č', 'P', 'S'].map(day => (
          <div key={day} className={styles.miniCalendarHeaderDay}>{day}</div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;