import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { TooltipProvider } from '../components/ui/tooltip';
import { Clock, Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, CheckSquare, FileText, BookOpen, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
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
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);

  // No mock data - calendar starts empty

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Only user events
  const allEvents = userEvents;

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
    return (new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 6) % 7; // Convert to Monday=0, Sunday=6
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
      days.push(<div key={`empty-${i}`} className="p-2 min-h-[80px] bg-zinc-800/20 rounded-lg border border-zinc-700/30"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const event = getEventForDate(day);
      const isToday = today.getDate() === day && 
                     today.getMonth() === currentMonth && 
                     today.getFullYear() === currentYear;
      
      days.push(
        <motion.div 
          key={day}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2 + (day * 0.01), duration: 0.3 }}
          whileHover={{ scale: 1.05, y: -2 }}
          className={`p-3 min-h-[80px] bg-zinc-800/30 hover:bg-zinc-700/50 transition-all duration-200 cursor-pointer rounded-lg flex flex-col items-center border ${
            isToday ? 'border-yellow-400/70 bg-yellow-400/10 shadow-lg shadow-yellow-400/20' : 'border-zinc-700/50'
          } ${event ? 'bg-zinc-700/40' : ''}`}
          onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
        >
          <span className={`text-lg font-bold mb-1 ${
            isToday ? 'text-yellow-400' : 'text-white'
          }`}>{day}</span>
          {event && (
            <div 
              className="w-full px-2 py-1 rounded-md text-center text-white text-xs font-medium relative group cursor-pointer"
              style={{ backgroundColor: getEventTypeColor(event.type) }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEvent(event);
                setIsEventDetailsModalOpen(true);
              }}
            >
              <span className="block truncate">{event.title}</span>
              {userEvents.some(userEvent => userEvent.id === event.id) && (
                <button
                  className="absolute top-0 right-0 w-4 h-4 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserEvents(prev => prev.filter(userEvent => userEvent.id !== event.id));
                  }}
                  title="Obriši događaj"
                >
                  <X className="w-2 h-2 text-white" />
                </button>
              )}
            </div>
          )}
        </motion.div>
      );
    }

    return days;
  };

  return (
    <TooltipProvider>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full min-h-screen relative overflow-hidden bg-zinc-950 text-white font-inter"
      >
        {/* NADRKANI Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 via-zinc-950 to-zinc-900/30 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(2px_2px_at_20px_30px,rgba(255,255,255,0.1),transparent),radial-gradient(2px_2px_at_40px_70px,rgba(255,255,255,0.05),transparent)] bg-repeat bg-[length:150px_150px] pointer-events-none opacity-40" />
        
        {/* Floating particles animation */}
        <div className="absolute inset-0 -z-5 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * -100, Math.random() * 100],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        {/* Success Notification */}
        {showNotification && (
          <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl shadow-green-500/30 z-50 animation-slideInFade flex items-center gap-3">
            <CheckSquare className="w-5 h-5" />
            <span className="font-medium">Događaj je uspešno dodat!</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-auto p-1 text-white hover:bg-white/20"
              onClick={() => setShowNotification(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        <div className="w-full max-w-none px-6 py-8">
          {/* NADRKAN Professional Header */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-6xl mx-auto mb-12"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.8, type: "spring", bounce: 0.4 }}
                >
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-br from-white via-gray-100 to-gray-200 bg-clip-text text-transparent tracking-tight relative">
                    Zadaci i rokovi
                    <motion.div
                      className="absolute -top-2 -right-8"
                      animate={{ 
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                    >
                      <Sparkles className="w-8 h-8 text-yellow-400/70" />
                    </motion.div>
                  </h1>
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-lg text-gray-300 font-medium"
                >
                  Organizujte svoje akademske obaveze efikasno
                </motion.p>
              </div>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, duration: 0.8, type: "spring", bounce: 0.6 }}
              >
                <motion.button
                  className="group bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-600 hover:via-zinc-700 hover:to-zinc-800 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300 shadow-lg shadow-black/50 hover:shadow-black/70 hover:-translate-y-1 relative overflow-hidden self-start lg:self-auto"
                  onClick={() => setIsAddEventModalOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.7 }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Novi događaj
                  </span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* NADRKAN Calendar Section */}
              <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="lg:col-span-2"
              >
                <Card className="bg-zinc-900/50 border-zinc-800/50 shadow-xl shadow-black/20 backdrop-blur-xl">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-zinc-800/50 rounded-lg border border-zinc-700/50 hover:border-zinc-600/50 text-white"
                        onClick={() => navigateMonth('prev')}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1, type: "spring", bounce: 0.5 }}
                    >
                      <CardTitle className="text-2xl font-bold text-white">
                        {currentDate.toLocaleDateString('sr-RS', { month: 'long', year: 'numeric' })}
                      </CardTitle>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-zinc-800/50 rounded-lg border border-zinc-700/50 hover:border-zinc-600/50 text-white"
                        onClick={() => navigateMonth('next')}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>
                </CardHeader>

                <CardContent>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="grid grid-cols-7 gap-1 mb-4"
                  >
                    {['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'].map((day, i) => (
                      <motion.div 
                        key={day} 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.3 + (i * 0.1), duration: 0.4 }}
                        className="p-3 text-center text-sm font-bold text-white bg-zinc-800/50 rounded-lg uppercase tracking-wider"
                      >
                        {day}
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="grid grid-cols-7 gap-2 bg-zinc-950/95 rounded-xl p-4 border border-zinc-800/50"
                  >
                    {renderCalendarDays()}
                  </motion.div>
                </CardContent>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 2, duration: 0.6 }}
                  className="flex justify-center gap-6 mt-6 pt-6 border-t border-zinc-800/50"
                >
                  {[
                    { type: 'kolokvijum', label: 'Kolokvijumi' },
                    { type: 'zadatak', label: 'Zadaci' },
                    { type: 'ispit', label: 'Ispiti' }
                  ].map((item, i) => (
                    <motion.div 
                      key={item.type}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 2.1 + (i * 0.1), type: "spring", bounce: 0.5 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getEventTypeColor(item.type as CalendarEvent['type']) }}></div>
                      <span className="text-sm text-gray-300">{item.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
                </Card>
              </motion.div>

              {/* NADRKAN Side Panel - Upcoming Duties */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <Card className="bg-zinc-900/50 border-zinc-800/50 shadow-xl shadow-black/20 backdrop-blur-xl">
                  <CardHeader>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2, type: "spring", bounce: 0.6 }}
                    >
                      <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
                        <Clock className="w-5 h-5 text-gray-400" />
                        Nadolazeće obaveze
                      </CardTitle>
                    </motion.div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AnimatePresence>
                      {upcomingEvents.map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ y: 50, opacity: 0, scale: 0.8 }}
                          animate={{ y: 0, opacity: 1, scale: 1 }}
                          exit={{ y: -50, opacity: 0, scale: 0.8 }}
                          transition={{ delay: 1.4 + (index * 0.1), duration: 0.6, type: "spring" }}
                          whileHover={{ scale: 1.02, y: -5 }}
                        >
                          <Card className="group cursor-pointer transition-all duration-700 backdrop-blur-xl border border-zinc-700/50 shadow-xl shadow-black/20 bg-gradient-to-br from-zinc-800/30 via-zinc-900/50 to-zinc-800/20 hover:shadow-black/40 hover:border-zinc-600/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <Badge 
                              className="text-xs font-semibold uppercase tracking-wider text-white"
                              style={{ backgroundColor: getEventTypeColor(event.type) }}
                            >
                              {getEventTypeLabel(event.type)}
                            </Badge>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeUntil(event.date)}
                            </span>
                          </div>
                          
                          <h4 className="font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                            {event.title}
                          </h4>
                          <p className="text-sm text-gray-200 font-medium mb-1">
                            {event.subject}
                          </p>
                          <p className="text-xs text-gray-400 mb-2">
                            {formatDate(event.date)}
                          </p>
                          
                          {event.description && (
                            <p className="text-sm text-gray-300 leading-relaxed">
                              {event.description}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {upcomingEvents.length === 0 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.8, duration: 0.8 }}
                        className="text-center py-8"
                      >
                        <motion.div 
                          className="mx-auto mb-6 p-4 bg-gradient-to-br from-zinc-800/50 via-zinc-700/30 to-zinc-800/20 rounded-2xl w-fit shadow-lg relative"
                          animate={{ 
                            scale: [1, 1.05, 1],
                            rotate: [0, 2, -2, 0] 
                          }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
                          <CalendarIcon className="w-12 h-12 text-gray-400 relative z-10" />
                        </motion.div>
                        <p className="text-gray-400">Nema nadolazećih obaveza</p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

        {/* Add Event Modal */}
        {isAddEventModalOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsAddEventModalOpen(false)}>
            <div className="bg-background/95 border border-primary/30 rounded-2xl w-full max-w-md shadow-2xl backdrop-blur-xl" onClick={(e) => e.stopPropagation()}>
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

        {/* Event Details Modal */}
        {isEventDetailsModalOpen && selectedEvent && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsEventDetailsModalOpen(false)}>
            <div className="bg-background/95 border border-primary/30 rounded-2xl w-full max-w-md shadow-2xl backdrop-blur-xl" onClick={(e) => e.stopPropagation()}>
              <EventDetailsModal 
                event={selectedEvent}
                onClose={() => setIsEventDetailsModalOpen(false)}
                onDelete={(eventId) => {
                  setUserEvents(prev => prev.filter(event => event.id !== eventId));
                  setIsEventDetailsModalOpen(false);
                }}
              />
            </div>
          </div>
        )}
        </div>
      </motion.div>
    </TooltipProvider>
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
    <Card className="bg-background/95 border border-primary/30 shadow-xl backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="text-xl font-bold text-foreground">
          Dodaj novi događaj
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-white/10 rounded-lg text-foreground"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Naziv događaja *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Unesite naziv zadatka, kolokvijuma ili ispita"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 hover:border-primary/30 focus:border-primary/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Predmet *</label>
            <select
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 hover:border-primary/30 focus:border-primary/50 rounded-lg text-foreground focus:outline-none transition-all duration-200"
            >
              <option value="">Izaberite predmet</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tip događaja *</label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value as CalendarEvent['type'])}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 hover:border-primary/30 focus:border-primary/50 rounded-lg text-foreground focus:outline-none transition-all duration-200"
            >
              <option value="zadatak">Zadatak</option>
              <option value="kolokvijum">Kolokvijum</option>
              <option value="ispit">Ispit</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Datum *</label>
            <div className="relative">
              <input
                type="text"
                value={formData.date ? new Date(formData.date).toLocaleDateString('sr-RS') : ''}
                onClick={() => setIsCalendarPickerOpen(true)}
                placeholder="Kliknite da izaberete datum"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 hover:border-primary/30 focus:border-primary/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-all duration-200 cursor-pointer"
                readOnly
              />
              <CalendarIcon 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors duration-200"
                onClick={() => setIsCalendarPickerOpen(true)}
              />
              
              {isCalendarPickerOpen && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsCalendarPickerOpen(false)}>
                  <div className="bg-background/95 border border-primary/30 rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <MiniCalendar 
                      onDateSelect={(date) => {
                        // Fix timezone issue - use local date format instead of ISO
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        const localDateString = `${year}-${month}-${day}`;
                        handleChange('date', localDateString);
                        setIsCalendarPickerOpen(false);
                      }}
                      onClose={() => setIsCalendarPickerOpen(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Opis (opciono)</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Dodajte opis zadatka, teme kolokvijuma ili detalje ispita"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 hover:border-primary/30 focus:border-primary/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none transition-all duration-200 resize-vertical min-h-[80px]"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="ghost"
              onClick={onClose} 
              className="flex-1 hover:bg-white/10 border border-white/20 hover:border-primary/30 text-foreground rounded-lg"
            >
              Otkaži
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-white rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1"
            >
              Dodaj događaj
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
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
  const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7; // Convert to Monday=0, Sunday=6
  
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
      days.push(<div key={`empty-${i}`} className="p-3 min-h-[48px] bg-white/5 rounded-lg border border-primary/10"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = today.toDateString() === date.toDateString();
      const isPast = date < today && !isToday;
      
      days.push(
        <button
          key={day}
          type="button"
          className={`p-3 min-h-[48px] text-base font-semibold rounded-lg transition-all duration-200 flex items-center justify-center border ${
            isToday 
              ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' 
              : isPast 
                ? 'text-muted-foreground cursor-not-allowed border-primary/10 bg-white/5' 
                : 'text-foreground hover:bg-primary/20 hover:border-primary/50 cursor-pointer border-primary/20 bg-white/10'
          }`}
          onClick={() => !isPast && onDateSelect(date)}
          disabled={isPast}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };
  
  return (
    <Card className="bg-background/95 border border-primary/30 shadow-xl w-96">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            type="button"
            onClick={() => navigateMonth('prev')}
            className="hover:bg-white/10 border border-white/20 hover:border-primary/30 text-foreground rounded-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <CardTitle className="text-lg font-bold text-foreground">
            {currentMonth.toLocaleDateString('sr-RS', { month: 'long', year: 'numeric' })}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            type="button"
            onClick={() => navigateMonth('next')}
            className="hover:bg-white/10 border border-white/20 hover:border-primary/30 text-foreground rounded-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-3">
          {['P', 'U', 'S', 'Č', 'P', 'S', 'N'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-bold text-white bg-[rgba(78,60,250,0.1)] rounded-lg border border-[rgba(78,60,250,0.2)] uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 p-3 bg-[rgba(2,1,23,0.98)] rounded-lg border border-[rgba(78,60,250,0.2)]">
          {renderDays()}
        </div>
      </CardContent>
    </Card>
  );
};

// Event Details Modal Component
interface EventDetailsModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onDelete: (eventId: string) => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose, onDelete }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('sr-RS', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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

  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'kolokvijum': return <CheckSquare className="w-5 h-5" />;
      case 'zadatak': return <FileText className="w-5 h-5" />;
      case 'ispit': return <BookOpen className="w-5 h-5" />;
      default: return <CalendarIcon className="w-5 h-5" />;
    }
  };

  return (
    <Card className="bg-background/95 border border-primary/30 shadow-xl backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg text-white"
            style={{ backgroundColor: getEventTypeColor(event.type) }}
          >
            {getEventIcon(event.type)}
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-foreground">
              Detalji događaja
            </CardTitle>
            <Badge 
              className="text-xs font-semibold uppercase tracking-wider text-white mt-1"
              style={{ backgroundColor: getEventTypeColor(event.type) }}
            >
              {getEventTypeLabel(event.type)}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-white/10 rounded-lg text-foreground"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {event.title}
            </h3>
            <p className="text-muted-foreground text-sm">
              {event.subject}
            </p>
          </div>

          <div className="flex items-center gap-2 text-foreground">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">
              {formatDate(event.date)}
            </span>
          </div>

          {event.description && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Opis:</h4>
              <p className="text-muted-foreground text-sm leading-relaxed bg-white/5 p-3 rounded-lg border border-primary/10">
                {event.description}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-primary/20">
          <Button 
            variant="ghost"
            onClick={onClose} 
            className="flex-1 hover:bg-white/10 border border-white/20 hover:border-primary/30 text-foreground rounded-lg"
          >
            Zatvori
          </Button>
          <Button 
            onClick={() => onDelete(event.id)} 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-200"
          >
            Obriši
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendar;