import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useInView, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { TooltipProvider } from '../../components/ui/tooltip';
import { HelpCircle, CheckSquare, FileText, BookOpen, GraduationCap, Clock, BarChart3, Star, Play, Zap, Brain, Users, TrendingUp, Check, Menu, X, ArrowRight, ChevronRight } from 'lucide-react';
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

const HowItWorks: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const onboardingSteps = [
    {
      step: 1,
      title: 'Izaberi fakultet/smer/godinu',
      description: 'Započni sa odabirom svog fakulteta, smera i godine studija kako bi AI razumeo tvoj kurikulum',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      ),
      screenshot: '/images/step-1-faculty.png'
    },
    {
      step: 2,
      title: 'Dodaj knjige i materijale',
      description: 'Upload-uj svoje udžbenike, predavanja i materijale koje AI će koristiti kao izvor znanja',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      ),
      screenshot: '/images/step-2-books.png'
    },
    {
      step: 3,
      title: 'Biraj režim rada',
      description: 'Odaberi jedan od 5 režima rada u zavisnosti od toga šta želiš da uradiš',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
        </svg>
      ),
      screenshot: '/images/step-3-modes.png'
    },
    {
      step: 4,
      title: 'Dobij pomoć prilagođenu tvom programu',
      description: 'AI koristi tvoje materijale i razume tvoj kurikulum da ti da najrelevantnije odgovore',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <path d="M9 12l2 2 4-4"/>
          <path d="M21 12c.552 0 1-.448 1-1V8c0-.552-.448-1-1-1h-3c-.552 0-1 .448-1 1v3c0 .552.448 1 1 1h3z"/>
        </svg>
      ),
      screenshot: '/images/step-4-results.png'
    }
  ];

  const modes = [
    {
      id: 'explain',
      name: 'Explain',
      shortDescription: 'Detaljna objašnjenja pojmova',
      fullDescription: 'AI analizira složene koncepte iz tvojih materijala i objašnjava ih jednostavnim jezikom prilagođenim tvom nivou znanja. Koristi primere iz stvarnog života i step-by-step pristup.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <path d="M12 17h.01"/>
        </svg>
      ),
      color: '#4E3CFA',
      features: [
        'Prilagođen tvom nivou znanja',
        'Primeri iz stvarnog života',
        'Povezivanje sa prethodnim gradivom',
        'Vizuelna objašnjenja kada je moguće'
      ]
    },
    {
      id: 'solve',
      name: 'Solve',
      shortDescription: 'AI rešava zadatke uz objašnjenje koraka',
      fullDescription: 'Upload-uj fotografiju zadatka ili ukucaj problem, a AI će ga rešiti korak po korak koristeći metode iz tvojih materijala. Dobićeš detaljno objašnjenje svakog koraka.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <path d="M9 12l2 2 4-4"/>
          <path d="M21 12c.552 0 1-.448 1-1V8c0-.552-.448-1-1-1h-3c-.552 0-1 .448-1 1v3c0 .552.448 1 1 1h3z"/>
        </svg>
      ),
      color: '#4E3CFA',
      features: [
        'Prepoznavanje slika i rukopisa',
        'Korak-po-korak rešavanje',
        'Alternativni pristupi rešavanju',
        'Objašnjenje teorije iza rešenja'
      ]
    },
    {
      id: 'summary',
      name: 'Summary',
      shortDescription: 'Sažima materijal',
      fullDescription: 'Upload-uj dugačke tekstove, predavanja ili čitave poglavlja, a AI će kreirati strukturisane sažetke sa ključnim tačkama, definicijama i poveznicima.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      ),
      color: '#4E3CFA',
      features: [
        'Struktuirani sažeci po temama',
        'Ključne definicije i formule',
        'Mape pojmova',
        'Prilagođavanje dužini sažetka'
      ]
    },
    {
      id: 'tests',
      name: 'Tests',
      shortDescription: 'Generiše testove i kvizove',
      fullDescription: 'Na osnovu tvojih materijala, AI kreira personalizovane testove sa pitanjima različitih tipova. Možeš birati težinu i fokus oblasti za testiranje.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14,2 14,8 20,8"/>
          <path d="M10 12a2 2 0 1 0 4 0 2 2 0 1 0-4 0z"/>
          <path d="M10 12v1a2 2 0 0 0 4 0v-1"/>
        </svg>
      ),
      color: '#4E3CFA',
      features: [
        'Multiple choice i open-ended pitanja',
        'Različiti nivoi težine',
        'Detaljno objašnjenje odgovora',
        'Praćenje napretka i slabih tačaka'
      ]
    },
    {
      id: 'learning',
      name: 'Learning',
      shortDescription: 'Planira i vodi kroz gradivo',
      fullDescription: 'AI kreira personalizovani plan učenja na osnovu tvog rasporega i ciljeva. Interaktivno te vodi kroz gradivo prilagođavajući tempo i fokus na osnovu tvog napretka.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      ),
      color: '#4E3CFA',
      features: [
        'Personalizovani planovi učenja',
        'Adaptivni tempo i težina',
        'Redovno testiranje znanja',
        'Motivacijski sistem i награде'
      ]
    }
  ];

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
              <span className="text-gray-300 text-sm font-medium">🎯 Kako funkcioniše FAXit</span>
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
                  Tvoj AI tutor koji
                </motion.span>
                <motion.span 
                  className="block mt-2 bg-white bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  razume tvoje knjige
                </motion.span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 font-medium leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              FAXit koristi naprednu AI tehnologiju da analizira tvoje udžbenike i materijale, omogućavajući ti personalizovano učenje prilagođeno baš tvom kurikulumu
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              <Link to="/main/register">
                <ShinyButton className="bg-white text-black hover:bg-gray-100 border border-gray-200 px-12 py-4 text-xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <span className="flex items-center gap-3">
                    <Zap className="w-6 h-6" />
                    Započni besplatno
                  </span>
                </ShinyButton>
              </Link>
              
              <ShinyButton 
                className="bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-600 px-12 py-4 text-xl font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                onClick={() => {
                  const onboardingSection = document.querySelector('.onboarding-section');
                  if (onboardingSection) {
                    onboardingSection.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'center' 
                    });
                  }
                }}
              >
                <span className="flex items-center gap-3 text-white">
                  <Play className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  Vidi kako funkcioniše
                </span>
              </ShinyButton>
            </motion.div>
          </div>
        </div>

      </motion.section>

      {/* Onboarding Steps Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950 onboarding-section" 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-br from-white to-zinc-300 bg-clip-text text-transparent mb-4">Korak po korak do uspeha</h2>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto hover:text-white transition-colors duration-300 cursor-default">
              4 jednostavna koraka do personalizovanog AI tutora
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {onboardingSteps.map((step) => (
              <motion.div
                key={step.step}
                className={`relative bg-gradient-to-br from-zinc-900/50 to-zinc-950/80 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-xl transition-all duration-300 hover:border-zinc-700/50 hover:bg-gradient-to-br hover:from-zinc-800/50 hover:to-zinc-900/80 group ${hoveredStep === step.step ? 'border-primary/50' : ''}`}
                onMouseEnter={() => setHoveredStep(step.step)}
                onMouseLeave={() => setHoveredStep(null)}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="absolute -top-4 left-8 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {step.step}
                </div>
                
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    
                    <p className="text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-xl h-32 flex items-center justify-center">
                  <span className="text-zinc-500 text-sm">Screenshot/GIF</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 5 Modes Detailed Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950" 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-br from-white to-zinc-300 bg-clip-text text-transparent mb-4">5 režima rada - detaljnije</h2>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto hover:text-white transition-colors duration-300 cursor-default">
              Svaki režim je dizajniran za specifične potrebe učenja
            </p>
          </motion.div>

          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {modes.map((mode, index) => (
              <motion.div
                key={mode.id}
                className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/80 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-xl transition-all duration-300 hover:border-zinc-700/50 hover:bg-gradient-to-br hover:from-zinc-800/50 hover:to-zinc-900/80 group"
                onMouseEnter={() => setHoveredMode(mode.id)}
                onMouseLeave={() => setHoveredMode(null)}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {mode.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                      {mode.name}
                    </h3>
                    <p className="text-zinc-400 mb-4">
                      {mode.shortDescription}
                    </p>
                    <p className="text-zinc-300 leading-relaxed mb-6">
                      {mode.fullDescription}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Ključne mogućnosti:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mode.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-zinc-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
              Spreman si da revolucionišeš
              <br />način kako učiš?
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Pridruži se hiljadama studenata koji već koriste FAXit za bolje ocene i efikasniji pristup učenju
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/main/register">
                <ShinyButton className="bg-white text-black hover:bg-gray-100 border border-gray-200 px-12 py-4 text-xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <span className="flex items-center gap-3">
                    <Zap className="w-6 h-6" />
                    Isprobaj sada - besplatno
                  </span>
                </ShinyButton>
              </Link>
              
              <Link to="/main/demonstracija">
                <ShinyButton className="bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-600 px-12 py-4 text-xl font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <span className="flex items-center gap-3 text-white">
                    <Play className="w-6 h-6" />
                    Pogledaj demonstraciju
                  </span>
                </ShinyButton>
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 justify-center items-center pt-8">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-zinc-400">Besplatna registracija</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-zinc-400">Setup za 2 minuta</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-zinc-400">Trenutni rezultati</span>
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
                  { name: 'Podržani fakulteti', path: '/main/podrzani-fakulteti' },
                  { name: 'Demonstracija', path: '/main/demonstracija' },
                  { name: 'Cene', path: '/main/cene' },
                  { name: 'FAQ', path: '/main/faq' }
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
                  { name: 'Uslovi korišćenja', path: '/terms' },
                  { name: 'Privatnost', path: '/privacy' },
                  { name: 'Status sistema', path: '/status' }
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

export default HowItWorks;