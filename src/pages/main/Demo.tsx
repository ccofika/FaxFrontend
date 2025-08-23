import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { TooltipProvider } from '../../components/ui/tooltip';
import { HelpCircle, CheckSquare, FileText, BookOpen, GraduationCap, Clock, BarChart3, Star, Play, Zap, Brain, Users, TrendingUp, Check, Menu, X, ArrowRight, ChevronRight, Send, Lightbulb, Calculator, StickyNote, TestTube } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ShinyButton } from '../../components/ui/shiny-button';
import './MainHome.css';

// Navigation Header Component
const modernNavItems = [
  { name: 'Početna', href: '/main' },
  { name: 'Kako funkcioniše', href: '/main/kako-funkcionise' },
  { name: 'Podržani fakulteti', href: '/main/podrzani-fakulteti' },
  { name: 'Demo', href: '/main/demonstracija' },
  { name: 'Cene', href: '/main/cene' },
  { name: 'FAQ', href: '/main/faq' },
  { name: 'Kontakt', href: '/main/kontakt' }
];

const ModernHeader = () => {
  const [menuState, setMenuState] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className="fixed z-50 w-full px-2 group">
        <div className={cn('mx-auto mt-2 max-w-7xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-zinc-950/80 max-w-5xl rounded-2xl border border-zinc-800/50 backdrop-blur-xl lg:px-6 shadow-lg shadow-black/20')}>
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                to="/"
                aria-label="home"
                className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">FAXit</span>
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200 text-white" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 text-white" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <div 
                className="flex gap-1 rounded-full p-1 border border-zinc-700/50"
                onMouseLeave={() => setHoveredNavItem(null)}
              >
                {modernNavItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    onMouseEnter={() => setHoveredNavItem(index)}
                    className="py-2 px-4 relative text-white text-sm font-medium"
                  >
                    {hoveredNavItem === index && (
                      <motion.div
                        layoutId="navbar-fluid"
                        transition={{ duration: 0.2, ease: "linear" }}
                        className="absolute inset-0 rounded-full bg-zinc-800/60 backdrop-blur-sm"
                      />
                    )}
                    <span className="relative z-10">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/50 group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-zinc-800/50 p-6 shadow-2xl backdrop-blur-xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {modernNavItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.href}
                        className="text-white hover:text-zinc-300 block duration-150 font-medium">
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={cn('border-zinc-700 bg-zinc-800/50 text-white hover:bg-zinc-700 hover:border-zinc-600', isScrolled && 'lg:hidden')}>
                  <Link to="/main/login">
                    <span>Prijava</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className={cn('bg-primary hover:bg-primary/90 shadow-lg', isScrolled ? 'lg:inline-flex' : 'lg:hidden')}>
                  <Link to="/main/register">
                    <span>Započni</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  mode?: string;
  timestamp: Date;
}

const Demo: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const [selectedMode, setSelectedMode] = useState<string>('explain');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const modes = [
    {
      id: 'explain',
      name: 'Explain',
      description: 'Detaljna objašnjenja pojmova',
      icon: <Lightbulb className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'solve',
      name: 'Solve',
      description: 'Rešavanje zadataka korak po korak',
      icon: <Calculator className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'summary',
      name: 'Summary',
      description: 'Sažimanje materijala',
      icon: <StickyNote className="w-5 h-5" />,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'tests',
      name: 'Tests',
      description: 'Kreiranje testova i kvizova',
      icon: <TestTube className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'learning',
      name: 'Learning',
      description: 'Interaktivno učenje',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const testBooks = [
    {
      id: 'math',
      title: 'Matematika za 1. godinu',
      author: 'Prof. Dr Milan Miličević',
      pages: 250,
      status: 'active'
    },
    {
      id: 'physics',
      title: 'Osnove fizike',
      author: 'Prof. Dr Ana Petrović',
      pages: 180,
      status: 'active'
    }
  ];

  const sampleQuestions = {
    explain: [
      'Objasni mi kako funkcioniše integracija po delovima',
      'Šta su to kompleksni brojevi i kako se koriste?',
      'Objasni princip rada Fourier transformacije'
    ],
    solve: [
      'Reši integral: ∫ x² · ln(x) dx',
      'Reši sistem: 2x + 3y = 7, x - y = 1',
      'Nađi limite: lim(x→0) sin(x)/x'
    ],
    summary: [
      'Sumiraj glavne pojmove iz poglavlja o derivacijama',
      'Kratak pregled Newtonovih zakona',
      'Sažmi ključne teoreme iz analize'
    ],
    tests: [
      'Napravi test sa 10 pitanja iz matematičke analize',
      'Kreiraj kviz o osnovama fizike',
      'Generiši zadatke za vežbanje integrala'
    ],
    learning: [
      'Kako da se pripremim za ispit iz analize?',
      'Koje su najvažnije formule za mehaniku?',
      'Kako da organizujem učenje za kolokvijum?'
    ]
  };

  const mockResponses = {
    explain: (question: string) => {
      if (question.toLowerCase().includes('integral')) {
        return {
          text: `**Integracija po delovima** je jedna od najvažnijih tehnika u diferencijalnom i integralnom računu.

## Formula
∫ u dv = uv - ∫ v du

## Objašnjenje korak po korak:

**1. Identifikuj delove:**
- Biramo funkciju u (derivišemo je)
- Biramo dv (integralimo je da dobijemo v)

**2. Primeni formulu:**
- Računamo du = u'dx
- Računamo v = ∫ dv

**3. Zameni u formulu:**
- uv - ∫ v du

## Primer: ∫ x·ln(x) dx
- u = ln(x), dv = x dx
- du = dx/x, v = x²/2
- Rezultat: (x²/2)·ln(x) - ∫ (x²/2)·(dx/x) = (x²/2)·ln(x) - x²/4

Ova tehnika je posebno korisna kada imamo proizvod funkcija gde jedna postaje jednostavnija derivisanjem, a druga integrisanjem.`,
          mode: 'explain'
        };
      }
      
      if (question.toLowerCase().includes('kompleksn')) {
        return {
          text: `**Kompleksni brojevi** predstavljaju proširenje skupa realnih brojeva i omogućavaju rešavanje jednačina koje nemaju realna rešenja.

## Osnovna forma
z = a + bi

Gde je:
- **a** - realni deo (Re(z))
- **b** - imaginarni deo (Im(z))
- **i** - imaginarna jedinica (i² = -1)

## Geometrijska interpretacija
Kompleksni broj možemo predstaviti kao tačku u kompleksnoj ravni:
- x-osa: realni deo
- y-osa: imaginarni deo

## Osnovne operacije
**Sabiranje:** (a + bi) + (c + di) = (a+c) + (b+d)i
**Množenje:** (a + bi)(c + di) = (ac-bd) + (ad+bc)i

## Primena
- Rešavanje kvadratnih jednačina
- Analiza električnih kola
- Kvantna mehanika
- Obrada signala

Kompleksni brojevi čine matematiku "kompletnom" jer svaka algebraska jednačina ima rešenje u skupu kompleksnih brojeva.`,
          mode: 'explain'
        };
      }

      return {
        text: `Izvinjavam se, ali trenutno nemam dovoljno informacija o toj temi u test materijalu. Ova demonstracija koristi ograničene primere.

**Dostupni demo sadržaji:**
- Integracija po delovima
- Kompleksni brojevi  
- Osnovni koncepti iz matematike i fizike

Molim pokušajte sa jednim od predloženih pitanja ili registrujte se za pristup kompletnoj biblioteci materijala.`,
        mode: 'explain'
      };
    },

    solve: (question: string) => {
      if (question.toLowerCase().includes('integral') && question.includes('x²')) {
        return {
          text: `## Rešavanje: ∫ x² · ln(x) dx

**Metod:** Integracija po delovima

### Korak 1: Identifikacija delova
- u = ln(x) → du = (1/x)dx  
- dv = x²dx → v = x³/3

### Korak 2: Primena formule
∫ u dv = uv - ∫ v du

### Korak 3: Zamena
∫ x² · ln(x) dx = ln(x) · (x³/3) - ∫ (x³/3) · (1/x) dx

### Korak 4: Simplifikacija
= (x³ ln(x))/3 - ∫ x²/3 dx
= (x³ ln(x))/3 - (1/3) · (x³/3)
= (x³ ln(x))/3 - x³/9

### **Finalno rešenje:**
∫ x² · ln(x) dx = **(x³/3)(ln(x) - 1/3) + C**

### Provera derivisanjem:
d/dx[(x³/3)(ln(x) - 1/3)] = x² ln(x) ✓`,
          mode: 'solve'
        };
      }

      if (question.toLowerCase().includes('sistem')) {
        return {
          text: `## Rešavanje sistema jednačina

**Sistem:**
2x + 3y = 7  ... (1)
x - y = 1    ... (2)

### Metod substitucije:

**Korak 1:** Iz jednačine (2)
x - y = 1
x = 1 + y

**Korak 2:** Zamena u jednačinu (1)
2(1 + y) + 3y = 7
2 + 2y + 3y = 7
5y = 5
**y = 1**

**Korak 3:** Vraćamo u x = 1 + y
x = 1 + 1
**x = 2**

### Provera:
- 2(2) + 3(1) = 4 + 3 = 7 ✓
- 2 - 1 = 1 ✓

### **Rešenje: (x, y) = (2, 1)**`,
          mode: 'solve'
        };
      }

      return {
        text: `Za demo verziju, dostupni su samo specifični primeri rešavanja:

**Dostupni zadaci:**
- ∫ x² · ln(x) dx (integracija po delovima)
- Sistem: 2x + 3y = 7, x - y = 1
- lim(x→0) sin(x)/x

Molim pokušajte sa jednim od navedenih zadataka ili se registrujte za pristup kompletnoj biblioteci rešenih zadataka.`,
        mode: 'solve'
      };
    },

    summary: (question: string) => {
      return {
        text: `## Sažetak (Demo verzija)

**Dostupno u demo verziji:**
- Sažetak derivacija
- Osnovni pregledi poglavlja
- Ključni koncepti

**Puna verzija omogućava:**
- Sažetke bilo kog materijala
- Prilagođene dužine
- Export u različite formate
- Personalizovane sažetke po fakultetu

Registrujte se za pristup kompletnim funkcijama sažimanja.`,
        mode: 'summary'
      };
    },

    tests: (question: string) => {
      return {
        text: `## Kreiranje testova (Demo verzija)

**Demo mogućnosti:**
- Osnovni testovi sa 5-10 pitanja
- Multiple choice format
- Jednostavna objašnjenja

**Puna verzija uključuje:**
- Testovi sa 50+ pitanja
- Različiti tipovi pitanja
- Automatsko ocenjivanje
- Detaljni izvještaji
- Prilagođavanje po težini

Za kreiranje kompleksnih testova registrujte se.`,
        mode: 'tests'
      };
    },

    learning: (question: string) => {
      return {
        text: `## Interaktivno učenje (Demo verzija)

**Demo funkcije:**
- Osnovni planovi učenja
- Praćenje napretka
- Generički saveti

**Puna verzija omogućava:**
- AI-personalizovane planove
- Adaptivno učenje
- Integracija sa kalendarom
- Detaljno praćenje napretka
- Preporuke na osnovu performansi

Registrujte se za potpuno personalizovano iskustvo učenja.`,
        mode: 'learning'
      };
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = inputText;
    setInputText('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      try {
        const response = mockResponses[selectedMode as keyof typeof mockResponses]?.(currentQuestion) || {
          text: 'Izvinjavam se, trenutno nemam odgovor na to pitanje u demo verziji.',
          mode: selectedMode
        };

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          isUser: false,
          mode: response.mode,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('Error generating response:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Došlo je do greške prilikom generisanja odgovora. Pokušajte ponovo.',
          isUser: false,
          mode: selectedMode,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }, 1200);
  };

  const handleSampleQuestion = (question: string) => {
    if (isLoading) return;
    setInputText(question);
    setTimeout(() => {
      if (!isLoading) {
        handleSendMessage();
      }
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <TooltipProvider>
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-white origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
      
      <motion.div 
        className="min-h-screen relative overflow-hidden bg-zinc-950 text-white font-inter"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <ModernHeader />
        {/* Modern Background Effects */}
        <div 
          aria-hidden
          className="z-[1] absolute inset-0 pointer-events-none isolate opacity-40">
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-[80rem] absolute right-0 top-0 w-56 rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:-5%_-50%]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-zinc-950 to-background/10 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(2px_2px_at_20px_30px,hsla(0,0%,85%,0.1),transparent),radial-gradient(2px_2px_at_40px_70px,hsla(0,0%,75%,0.05),transparent)] bg-repeat bg-[length:150px_150px] pointer-events-none opacity-40" />
        
      {/* Modern Hero Section */}
      <motion.section 
        className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-12">
            <Link
              to="#link"
              className="hover:bg-zinc-800/50 group mx-auto flex w-fit items-center gap-4 rounded-full border border-zinc-800/50 p-1 pl-4 shadow-md shadow-black/20 transition-all duration-300 backdrop-blur-xl mb-8">
              <span className="text-gray-300 text-sm font-medium">🧪 Besplatna demonstracija</span>
              <span className="block h-4 w-0.5 border-l border-zinc-700 bg-zinc-700"></span>
              <div className="bg-zinc-800/50 group-hover:bg-zinc-700 size-6 overflow-hidden rounded-full duration-500">
                <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                  <span className="flex size-6">
                    <ArrowRight className="m-auto size-3 text-muted-foreground" />
                  </span>
                  <span className="flex size-6">
                    <ArrowRight className="m-auto size-3 text-muted-foreground" />
                  </span>
                </div>
              </div>
            </Link>
            
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
                <motion.span 
                  className="block bg-gradient-to-br from-white via-gray-100 to-gray-200 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  Probaj FAXit AI
                </motion.span>
                <motion.span 
                  className="block mt-2 bg-white bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  bez registracije
                </motion.span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 font-medium leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              Testuj sve funkcionalnosti AI asistenta sa demo materijalom. Bez ikakvih ograničenja - osim što koristiš izmišljene sadržaje.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Demo Chat Interface */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950" 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Demo Warning */}
          <motion.div 
            className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-amber-100 mb-2">Ovo je demo sa izmišljenim materijalom</h3>
                <p className="text-amber-200/80">Za pristup pravim knjigama i materijalima sa vašeg fakulteta, registrujte se.</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div 
              className="lg:col-span-1 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Mode Selection */}
              <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/80 border-zinc-800/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Izaberi režim</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {modes.map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode.id)}
                      disabled={isLoading}
                      className={`w-full p-3 rounded-xl border transition-all duration-300 ${
                        selectedMode === mode.id 
                          ? 'border-primary bg-primary/10 text-white' 
                          : 'border-zinc-700/50 bg-zinc-800/20 text-zinc-300 hover:border-zinc-600/50 hover:bg-zinc-700/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${mode.color}`}>
                          {mode.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{mode.name}</div>
                          <div className="text-xs opacity-70">{mode.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Test Library */}
              <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/80 border-zinc-800/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Test biblioteka</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {testBooks.map(book => (
                    <div key={book.id} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-xl">
                      <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-sm truncate">{book.title}</div>
                        <div className="text-xs text-zinc-400 truncate">{book.author}</div>
                        <div className="text-xs text-zinc-500">{book.pages} stranica</div>
                      </div>
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Sample Questions */}
              <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/80 border-zinc-800/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Primeri pitanja</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sampleQuestions[selectedMode as keyof typeof sampleQuestions]?.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSampleQuestion(question)}
                      disabled={isLoading}
                      className="w-full p-3 text-left text-sm bg-zinc-800/30 hover:bg-zinc-700/40 border border-zinc-700/30 hover:border-zinc-600/50 rounded-xl text-zinc-300 hover:text-white transition-all duration-300"
                    >
                      {question}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Chat Area */}
            <motion.div 
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/80 border-zinc-800/50 backdrop-blur-xl h-[700px] flex flex-col">
                {/* Chat Header */}
                <CardHeader className="border-b border-zinc-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${modes.find(m => m.id === selectedMode)?.color}`}>
                        {modes.find(m => m.id === selectedMode)?.icon}
                      </div>
                      <div>
                        <CardTitle className="text-white">
                          {modes.find(m => m.id === selectedMode)?.name} režim
                        </CardTitle>
                        <CardDescription>
                          {modes.find(m => m.id === selectedMode)?.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                      DEMO
                    </Badge>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-6">
                  {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full text-center">
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto">
                          <Brain className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Dobrodošli u FAXit demo!</h3>
                        <p className="text-zinc-400 max-w-md">Postavite pitanje ili odaberite jedan od predloženih primera sa leve strane.</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {messages.map(message => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${message.isUser ? 'bg-primary text-white' : 'bg-zinc-800/50 text-white'} rounded-2xl p-4`}>
                          {!message.isUser && (
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="w-4 h-4 text-primary" />
                              <span className="text-xs font-medium text-primary">FAXit AI</span>
                              {message.mode && (
                                <Badge variant="secondary" className="text-xs bg-zinc-700/50">
                                  {message.mode}
                                </Badge>
                              )}
                            </div>
                          )}
                          <div className="prose prose-invert max-w-none">
                            {message.text.split('\n').map((line, i) => {
                              if (line.startsWith('##')) {
                                return <h3 key={i} className="text-lg font-semibold text-white mt-4 mb-2">{line.replace('## ', '')}</h3>;
                              }
                              if (line.startsWith('**') && line.endsWith('**')) {
                                return <div key={i} className="font-bold text-white my-2">{line.replace(/\*\*/g, '')}</div>;
                              }
                              if (line.startsWith('### ')) {
                                return <h4 key={i} className="font-semibold text-white mt-3 mb-1">{line.replace('### ', '')}</h4>;
                              }
                              if (line.includes('→') || line.includes('=') || line.includes('∫') || line.includes('lim')) {
                                return <div key={i} className="font-mono bg-zinc-900/50 p-2 rounded text-green-300 my-1">{line}</div>;
                              }
                              return line ? <p key={i} className="my-1">{line}</p> : <br key={i} />;
                            })}
                          </div>
                          <div className="text-xs text-zinc-400 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-zinc-800/50 rounded-2xl p-4">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span className="text-sm text-zinc-400">AI razmišlja...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>

                {/* Input Area */}
                <div className="p-6 border-t border-zinc-800/50">
                  <div className="flex gap-3">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Postavite pitanje u ${modes.find(m => m.id === selectedMode)?.name} režimu...`}
                      className="flex-1 bg-zinc-800/30 border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-400 resize-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none"
                      disabled={isLoading}
                      rows={2}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isLoading}
                      className="px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950 relative overflow-hidden" 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(78,60,250,0.1),transparent_70%)]" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-white via-gray-100 to-gray-200 bg-clip-text text-transparent leading-tight">
              Spreman za pravu
              <br />FAXit AI?
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Kreiraj nalog i koristi svoje knjige, materijale sa fakulteta i pristupaj svim AI funkcijama bez ograničenja
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/main/register">
                <ShinyButton className="bg-white text-black hover:bg-gray-100 border border-gray-200 px-12 py-4 text-xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <span className="flex items-center gap-3">
                    <Zap className="w-6 h-6" />
                    Kreiraj nalog besplatno
                  </span>
                </ShinyButton>
              </Link>
              
              <Link to="/main/kako-funkcionise">
                <ShinyButton className="bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-600 px-12 py-4 text-xl font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <span className="flex items-center gap-3 text-white">
                    <Play className="w-6 h-6" />
                    Saznaj više o funkcijama
                  </span>
                </ShinyButton>
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 justify-center items-center pt-8">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span className="text-zinc-400">Tvoje knjige i materijali</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-400" />
                <span className="text-zinc-400">Prilagođeno tvom fakultetu</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-zinc-400">Neograničeno korišćenje</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-zinc-950 text-white border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-zinc-800 rounded-lg" />
                <span className="text-2xl font-bold">FAXit</span>
              </div>
              <p className="text-zinc-400 mb-6">
                AI asistent koji revolucioniše način kako studenti uče i pristupaju gradivu na fakultetu.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Stranice</h4>
              <ul className="space-y-2">
                {[
                  { name: 'Početna', path: '/main' },
                  { name: 'Kako funkcioniše', path: '/main/kako-funkcionise' },
                  { name: 'Podržani fakulteti', path: '/main/podrzani-fakulteti' },
                  { name: 'Demonstracija', path: '/main/demo' }
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path} 
                      className="text-zinc-400 hover:text-white no-underline transition-colors duration-300 block py-1 text-base"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Podrška</h4>
              <ul className="space-y-2">
                {[
                  { name: 'Kontakt', path: '/main/kontakt' },
                  { name: 'FAQ', path: '/main/faq' },
                  { name: 'Uslovi korišćenja', path: '/terms' },
                  { name: 'Privatnost', path: '/privacy' }
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path} 
                      className="text-zinc-400 hover:text-white no-underline transition-colors duration-300 block py-1 text-base"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Društvene mreže</h4>
              <div className="flex gap-4">
                {[
                  {
                    name: 'Twitter',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '20px', height: '20px'}}>
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    )
                  },
                  {
                    name: 'LinkedIn', 
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '20px', height: '20px'}}>
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    )
                  },
                  {
                    name: 'Instagram',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '20px', height: '20px'}}>
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    )
                  }
                ].map((social, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="p-2 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-zinc-400 text-base">
                © 2024 FAXit. Sva prava zadržana.
              </p>
              
              <p className="text-zinc-400 text-base">
                Napravljeno sa ❤️ za studente Srbije
              </p>
            </div>
          </div>
        </div>
      </footer>
      </motion.div>
      
    </TooltipProvider>
  );
};

export default Demo;