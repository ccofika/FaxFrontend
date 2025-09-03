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
import { TestimonialsSection } from '../../components/blocks/testimonials-with-marquee';
import { FeaturesSectionWithHoverEffects } from '../../components/blocks/feature-section-with-hover-effects';
import { BentoGrid } from '../../components/ui/bento-grid';
import FAQs from '../../components/ui/faq';
import { HeroVideoDialog } from '../../components/ui/hero-video-dialog';
import { ShinyButton } from '../../components/ui/shiny-button';

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

const MainHome: React.FC = () => {
  const { scrollYProgress } = useScroll();


  const testimonials = [
    {
      author: {
        name: 'Marko Petković',
        handle: 'Elektrotehnički fakultet • 3. godina',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      text: 'FAXit mi je pomogao da prođem analizu sa 9. Objašnjenja su bila jasnija od profesora.'
    },
    {
      author: {
        name: 'Ana Nikolić',
        handle: 'Medicinski fakultet • 2. godina',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616c47734aa?w=150&h=150&fit=crop&crop=face'
      },
      text: 'Sažeci materijala su mi uštedeli sate učenja. Preporučujem svim studentima!'
    },
    {
      author: {
        name: 'Stefan Jovanović',
        handle: 'Ekonomski fakultet • 4. godina',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      text: 'Test generator je fantastičan. Konačno mogu da vežbam sa stvarnim pitanjima.'
    },
    {
      author: {
        name: 'Milica Stojanović',
        handle: 'Pravni fakultet • 1. godina',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
      },
      text: 'Savršeno za pripremu ispita! AI objašnjava sve što ne razumem iz skripte.'
    },
    {
      author: {
        name: 'Petar Mitrović',
        handle: 'FON • 2. godina',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      },
      text: 'Revolucija u učenju! FAXit mi je skratio vreme pripreme za polovinu.'
    },
    {
      author: {
        name: 'Jovana Radić',
        handle: 'Medicinski fakultet • 4. godina',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      text: 'Jako intuitivno i praktično. Posebno mi pomažu testovi za vežbanje.'
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
              <span className="text-gray-300 text-sm font-medium">Više od običnog AI tutora</span>
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
                  Tvoj AI asistent
                </motion.span>
                <motion.span 
                  className="block mt-2 bg-white bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  za fakultet
                </motion.span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 font-medium leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              FAXit pomaže studentima da lakše uče, rešavaju zadatke i pripremaju se za ispite uz naprednu AI tehnologiju
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
                  const videoSection = document.querySelector('.video-preview');
                  if (videoSection) {
                    videoSection.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'center' 
                    });
                  }
                }}
              >
                <span className="flex items-center gap-3 text-white">
                  <Play className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  Pogledaj video
                </span>
              </ShinyButton>
            </motion.div>
          </div>
        </div>

      </motion.section>

      {/* Video Preview Section */}
      <motion.section 
        className="py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.6 }}
      >
        <div className="video-preview max-w-4xl mx-auto">
          <HeroVideoDialog
            videoSrc="/videos/test-video.mp4"
            thumbnailSrc="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1920&h=1080&fit=crop&crop=entropy&auto=format&fm=jpg&q=60"
            thumbnailAlt="FAXit Demo Video"
            className="rounded-xl shadow-2xl border border-zinc-800"
            animationStyle="from-center"
          />
        </div>
      </motion.section>


      {/* 5 Modes Section */}
      <motion.section 
        className="py-28 px-4 sm:px-6 lg:px-8 bg-zinc-950 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(78,60,250,0.05),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(78,60,250,0.03),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-br from-white to-zinc-300 bg-clip-text text-transparent mb-4">
                5 načina da učiš
              </h2>
              <p className="text-xl text-zinc-300 max-w-3xl mx-auto hover:text-white transition-colors duration-300 cursor-default">
                Svaki režim je dizajniran za 
                <span className="text-white font-semibold">različite tipove pitanja</span> i 
                <span className="text-white font-semibold">izazova</span>
              </p>
            </div>
          </motion.div>

          <FeaturesSectionWithHoverEffects />
        </div>
      </motion.section>

      {/* Benefits Section */}
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-br from-white to-zinc-300 bg-clip-text text-transparent mb-4">Zašto FAXit?</h2>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto hover:text-white transition-colors duration-300 cursor-default">
              Više od običnog AI-ja - tvoj lični tutor koji razume fakultet
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <BentoGrid>
              {/* Placeholder content */}
              <div className="col-span-2 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 p-6 rounded-xl border border-zinc-700">
                <h3 className="text-xl font-semibold text-white mb-2">AI Tutor</h3>
                <p className="text-zinc-300 text-sm">Personalizovana pomoć za svaki predmet</p>
              </div>
              <div className="col-span-1 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 p-6 rounded-xl border border-zinc-700">
                <h3 className="text-xl font-semibold text-white mb-2">Brze Pretrage</h3>
                <p className="text-zinc-300 text-sm">Pronađi odgovore u sekundi</p>
              </div>
            </BentoGrid>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <TestimonialsSection
        title="Šta kažu studenti"
        description="Hiljade studenata već koristi FAXit za bolje ocene"
        testimonials={testimonials}
      />

      {/* FAQ Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950" 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-br from-white to-zinc-300 bg-clip-text text-transparent mb-4">Često postavljana pitanja</h2>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto hover:text-white transition-colors duration-300 cursor-default">
              Odgovori na najčešća pitanja o FAXit-u
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FAQs />
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
                  { name: 'Kako funkcioniše', path: '/main/kako-funkcionise' },
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

export default MainHome;