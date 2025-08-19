import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { TooltipProvider } from '../../components/ui/tooltip';
import { HelpCircle, CheckSquare, FileText, BookOpen, GraduationCap, Clock, BarChart3, Star, Play, Zap, Brain, Users, TrendingUp, Check } from 'lucide-react';

const MainHome: React.FC = () => {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [activeFAQ, setActiveFAQ] = useState<string | null>(null);

  const modes = [
    {
      id: 'explain',
      name: 'Explain',
      description: 'Objašnjava složene koncepte jednostavnim jezikom',
      icon: <HelpCircle className="h-6 w-6" />,
      color: '#4E3CFA',
      preview: 'Pita AI-ja "Objasni mi kako funkcioniše ovaj algoritam" i dobija detaljno objašnjenje prilagođeno nivou'
    },
    {
      id: 'solve',
      name: 'Solve',
      description: 'Rešava probleme i zadatke korak po korak',
      icon: <CheckSquare className="h-6 w-6" />,
      color: '#4E3CFA',
      preview: 'Kači fotografiju zadatka iz matematike i AI rešava sa objašnjenjem svakog koraka'
    },
    {
      id: 'summary',
      name: 'Summary',
      description: 'Pravi sažetke tekstova i materijala',
      icon: <FileText className="h-6 w-6" />,
      color: '#4E3CFA',
      preview: 'Upload-uje 50-stranični PDF i dobija ključne tačke sažete u nekoliko pasusa'
    },
    {
      id: 'tests',
      name: 'Tests',
      description: 'Generiše testove za vežbanje gradiva',
      icon: <BookOpen className="h-6 w-6" />,
      color: '#4E3CFA',
      preview: 'Na osnovu gradiva kreira test sa 20 pitanja multiple choice + objašnjenja odgovora'
    },
    {
      id: 'learning',
      name: 'Learning',
      description: 'Interaktivno učenje sa AI tutorom',
      icon: <GraduationCap className="h-6 w-6" />,
      color: '#4E3CFA',
      preview: 'AI postavlja pitanja, daje savete i prilagođava tempo učenja na osnovu napretka'
    }
  ];

  const benefits = [
    {
      title: 'Prilagođeno tvom smeru',
      description: 'AI razume specifičnosti tvog fakulteta i smer',
      icon: <GraduationCap className="h-6 w-6" />
    },
    {
      title: 'Radi sa tvojim knjigama',
      description: 'Upload-uj materijale i dobij odgovore iz tvojih izvora',
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      title: 'Dostupno 24/7',
      description: 'Tvoj AI asistent ne spava - učiš kad god želiš',
      icon: <Clock className="h-6 w-6" />
    },
    {
      title: 'Napredna analitika',
      description: 'Prati napredak i identifikuje oblasti za poboljšanje',
      icon: <BarChart3 className="h-6 w-6" />
    }
  ];

  const testimonials = [
    {
      name: 'Marko Petković',
      faculty: 'Elektrotehnički fakultet',
      year: '3. godina',
      quote: 'FAXit mi je pomogao da prođem analizu sa 9. Objašnjenja su bila jasnija od profesora.',
      avatar: 'MP'
    },
    {
      name: 'Ana Nikolić',
      faculty: 'Medicinski fakultet',
      year: '2. godina',
      quote: 'Sažeci materijala su mi uštedeli sate učenja. Preporučujem svim studentima!',
      avatar: 'AN'
    },
    {
      name: 'Stefan Jovanović',
      faculty: 'Ekonomski fakultet',
      year: '4. godina',
      quote: 'Test generator je fantastičan. Konačno mogu da vežbam sa stvarnim pitanjima.',
      avatar: 'SJ'
    }
  ];

  const handleVideoPlay = () => {
    const video = document.querySelector('.video-element') as HTMLVideoElement;
    if (video) {
      if (video.paused) {
        video.play();
        setIsVideoPlaying(true);
      } else {
        video.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const handleVideoTimeUpdate = () => {
    const video = document.querySelector('.video-element') as HTMLVideoElement;
    if (video) {
      setVideoCurrentTime(video.currentTime);
    }
  };

  const handleVideoLoadedMetadata = () => {
    const video = document.querySelector('.video-element') as HTMLVideoElement;
    if (video) {
      setVideoDuration(video.duration || 0);
    }
  };

  const handleVideoDurationChange = () => {
    const video = document.querySelector('.video-element') as HTMLVideoElement;
    if (video && video.duration && !isNaN(video.duration)) {
      setVideoDuration(video.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const video = document.querySelector('.video-element') as HTMLVideoElement;
    if (!video || !videoDuration) return;
    
    const progressContainer = e.currentTarget;
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressWidth = rect.width;
    const clickedPercentage = Math.max(0, Math.min(1, clickX / progressWidth));
    const clickedTime = clickedPercentage * videoDuration;
    
    video.currentTime = clickedTime;
    setVideoCurrentTime(clickedTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen relative overflow-hidden bg-background text-foreground font-inter">
        <Navigation />
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/2 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(2px_2px_at_20px_30px,rgba(78,60,250,0.3),transparent),radial-gradient(2px_2px_at_40px_70px,rgba(78,60,250,0.2),transparent)] bg-repeat bg-[length:150px_150px] pointer-events-none" />
        
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full px-6 py-3 text-sm font-medium text-primary backdrop-blur-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-105 transition-all duration-300">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <Star className="w-4 h-4" />
              Više od običnog AI tutora
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
                <span className="block bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">Tvoj AI asistent</span>
                <span className="block mt-2 bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent relative">
                  za fakultet
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 blur-2xl rounded-full"></div>
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground/90 font-medium leading-relaxed max-w-3xl mx-auto">
              FAXit pomaže studentima da 
              <span className="text-foreground font-semibold">lakše uče</span>, 
              <span className="text-foreground font-semibold">rešavaju zadatke</span> i 
              <span className="text-foreground font-semibold">pripremaju se za ispite</span> 
              uz naprednu AI tehnologiju
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button className="group bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-white rounded-2xl px-12 py-6 text-xl font-bold transition-all duration-500 shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="relative z-10 flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  Započni besplatno
                </span>
              </Button>
              <Button 
                variant="ghost" 
                className="group bg-white/5 hover:bg-white/15 text-white border-2 border-white/20 hover:border-white/40 rounded-2xl px-12 py-6 text-xl font-semibold transition-all duration-500 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:scale-105 relative overflow-hidden"
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
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="relative z-10 flex items-center gap-3">
                  <Play className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  Pogledaj video
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Video Preview */}
        <div className="video-preview mt-16 max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-2xl">
            <div className="aspect-video bg-black relative">
              <video 
                className="video-element w-full h-full object-cover"
                preload="metadata"
                controls={false}
                muted
                onTimeUpdate={handleVideoTimeUpdate}
                onLoadedMetadata={handleVideoLoadedMetadata}
                onDurationChange={handleVideoDurationChange}
                onLoadedData={handleVideoDurationChange}
                onCanPlay={handleVideoDurationChange}
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              >
                <source src="/videos/test-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Custom Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-[#4E3CFA]/20"
                    onClick={handleVideoPlay}
                  >
                    {isVideoPlaying ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <rect x="6" y="4" width="4" height="16"/>
                        <rect x="14" y="4" width="4" height="16"/>
                      </svg>
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <div className="flex-1 cursor-pointer" onClick={handleProgressClick}>
                    <div className="bg-white/30 rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${videoDuration ? (videoCurrentTime / videoDuration) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  
                  <span className="text-white text-sm">
                    {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
                  </span>
                </div>
              </div>
              
              {/* Large Play Overlay (only when paused) */}
              {!isVideoPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Button
                    size="lg"
                    className="rounded-full w-16 h-16"
                    onClick={handleVideoPlay}
                  >
                    <Play className="w-6 h-6 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background backdrop-blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(78,60,250,0.1),transparent_70%)] animate-pulse"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { number: '10,000+', label: 'Aktivnih studenata', icon: Users },
              { number: '50+', label: 'Podržanih fakulteta', icon: GraduationCap },
              { number: '95%', label: 'Poboljšanje ocena', icon: TrendingUp },
              { number: '24/7', label: 'Dostupnost', icon: Clock }
            ].map((stat, index) => (
              <div 
                key={index}
                className="group text-center border border-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-background/60 rounded-3xl p-8 transition-all duration-500 cursor-pointer backdrop-blur-xl shadow-xl shadow-primary/20 hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/40 hover:border-primary/50 hover:scale-105 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                <div className="flex justify-center mb-6 relative z-10">
                  <div className="p-4 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-primary/30 group-hover:scale-110 transition-all duration-500 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                    <stat.icon className="w-8 h-8 text-primary group-hover:text-primary/90 transition-colors duration-300 relative z-10" />
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500">
                    {stat.number}
                  </div>
                  <div className="text-base font-semibold text-muted-foreground/80 group-hover:text-muted-foreground transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 Modes Section */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(78,60,250,0.05),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(78,60,250,0.03),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent leading-tight">
                5 načina da 
                <span className="block bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent relative">
                  učiš
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-primary/5 blur-3xl rounded-full"></div>
                </span>
              </h2>
              <p className="text-2xl font-medium text-muted-foreground/90 max-w-4xl mx-auto leading-relaxed">
                Svaki režim je dizajniran za 
                <span className="text-foreground font-semibold">različite tipove pitanja</span> i 
                <span className="text-foreground font-semibold">izazova</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {modes.map((mode) => (
              <Card
                key={mode.id}
                className={`group cursor-pointer transition-all duration-700 text-center backdrop-blur-xl relative overflow-hidden hover:-translate-y-4 hover:scale-105 ${
                  hoveredMode === mode.id 
                    ? 'border-primary/60 shadow-2xl shadow-primary/50 bg-gradient-to-br from-primary/15 via-primary/10 to-background/80' 
                    : 'border-primary/20 shadow-xl shadow-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-background/70'
                }`}
                onMouseEnter={() => setHoveredMode(mode.id)}
                onMouseLeave={() => setHoveredMode(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-2xl w-fit shadow-lg group-hover:shadow-primary/40 group-hover:scale-110 transition-all duration-500 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                    <div className="text-primary group-hover:text-primary/90 transition-colors duration-300 relative z-10">
                      {mode.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">{mode.name}</h3>
                  <p className="text-base text-muted-foreground text-center leading-relaxed group-hover:text-muted-foreground/90 transition-colors duration-300">
                    {mode.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">Zašto FAXit?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto hover:text-foreground transition-colors duration-300 cursor-default">
              Više od običnog AI-ja - tvoj lični tutor koji razume fakultet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card 
                key={index}
                className="text-center h-full border border-primary/20 bg-gradient-to-br from-primary/8 to-background/60 rounded-2xl p-8 transition-all duration-300 cursor-pointer backdrop-blur-lg shadow-lg shadow-primary/10 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 hover:border-primary/40"
              >
                <CardContent className="p-0">
                  <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full w-fit flex items-center justify-center">
                    <div className="text-primary">
                    {benefit.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 hover:text-primary transition-colors duration-300 cursor-default">{benefit.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed hover:text-foreground transition-colors duration-300 cursor-default">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">Šta kažu studenti</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto hover:text-foreground transition-colors duration-300 cursor-default">
              Hiljade studenata već koristi FAXit za bolje ocene
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="h-full border border-primary/20 bg-gradient-to-br from-primary/8 to-background/60 rounded-2xl p-6 transition-all duration-300 cursor-pointer backdrop-blur-lg shadow-lg shadow-primary/10 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 hover:border-primary/40"
              >
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-semibold text-base">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1 hover:text-primary transition-colors duration-300">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">{testimonial.faculty} • {testimonial.year}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic text-base leading-relaxed hover:text-foreground transition-colors duration-300 cursor-default">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{
        background: 'linear-gradient(135deg, rgba(78, 60, 250, 0.1) 0%, rgba(26, 22, 53, 1) 100%)'
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #B8BCC8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '16px'
            }}>Napredne funkcije</h2>
            <p style={{
              fontSize: '20px',
              color: '#9C9AA9',
              maxWidth: '768px',
              margin: '0 auto'
            }}>
              Discover sa kojim mogućnostima FAXit pomaže studentima
            </p>
          </div>

          <Tabs defaultValue="ai-tutor" className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
              <TabsTrigger value="ai-tutor">AI Tutor</TabsTrigger>
              <TabsTrigger value="progress">Napredak</TabsTrigger>
              <TabsTrigger value="collaboration">Saradnja</TabsTrigger>
            </TabsList>
            
            
            <TabsContent value="ai-tutor" className="mt-8">
              <Card>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-white">Personalizovani AI Tutor</h3>
                      <p className="text-[#9C9AA9] mb-6 leading-relaxed">
                        Naš napredni AI sistem prilagođava se tvom stilu učenja, prepoznaje tvoje jake i slabe strane, 
                        i prilagođava objašnjenja i zadatke prema tvom tempu napredovanja.
                      </p>
                      <div className="space-y-4">
                        {[
                          'Adaptivno učenje prilagođeno tebi',
                          'Prepoznavanje oblasti za poboljšanje',
                          'Personalizovani saveti i strategije',
                          'Dostupan 24/7 kada god ti treba'
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-[#4E3CFA] to-[#6A5ACD] rounded-full"></div>
                            <span className="text-[#9C9AA9]">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-[#4E3CFA]/20 to-[#6A5ACD]/20 rounded-lg p-8 h-64 flex items-center justify-center border border-[#4E3CFA]/20">
                      <Brain className="w-20 h-20 text-[#4E3CFA]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="progress" className="mt-8">
              <Card>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="bg-gradient-to-br from-[#4E3CFA]/20 to-[#6A5ACD]/20 rounded-lg p-8 h-64 flex items-center justify-center border border-[#4E3CFA]/20">
                      <BarChart3 className="w-20 h-20 text-[#4E3CFA]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-white">Praćenje Napretka</h3>
                      <p className="text-[#9C9AA9] mb-6 leading-relaxed">
                        Detaljno prati svoj akademski napredak kroz interaktivne grafikone, 
                        statistike i personalizovane izveštaje koji pokazuju tvoj razvoj kroz vreme.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-white">Matematika</span>
                            <span className="text-sm text-[#9C9AA9]">85%</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-white">Fizika</span>
                            <span className="text-sm text-[#9C9AA9]">72%</span>
                          </div>
                          <Progress value={72} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-white">Hemija</span>
                            <span className="text-sm text-[#9C9AA9]">90%</span>
                          </div>
                          <Progress value={90} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="collaboration" className="mt-8">
              <Card>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-white">Timska Saradnja</h3>
                      <p className="text-[#9C9AA9] mb-6 leading-relaxed">
                        Udruži se sa kolegama, formiraj study grupe, deli beleške i radi zajedno na projektima. 
                        FAXit omogućava jednostavnu saradnju između studenata.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {['Ana Marić', 'Petar Jović', 'Milica Stojanović', 'Stefan Mitrović'].map((name, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1 bg-gradient-to-r from-[#4E3CFA]/20 to-[#6A5ACD]/20 text-white border-[#4E3CFA]/30">
                            {name}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full sm:w-auto bg-gradient-to-r from-[#4E3CFA] to-[#6A5ACD] hover:from-[#4E3CFA]/90 hover:to-[#6A5ACD]/90">
                        <Users className="w-4 h-4 mr-2" />
                        Pristupi study grupi
                      </Button>
                    </div>
                    <div className="bg-gradient-to-br from-[#4E3CFA]/20 to-[#6A5ACD]/20 rounded-lg p-8 h-64 flex items-center justify-center border border-[#4E3CFA]/20">
                      <Users className="w-20 h-20 text-[#4E3CFA]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{background: '#020117'}}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #B8BCC8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '16px'
            }}>Često postavljana pitanja</h2>
            <p style={{
              fontSize: '20px',
              color: '#9C9AA9'
            }}>
              Odgovori na najčešća pitanja o FAXit-u
            </p>
          </div>

          <div className="w-full space-y-4">
            {[
              {
                id: 'item-1',
                question: 'Da li je FAXit besplatan za studente?',
                answer: 'FAXit nudi besplatnu verziju sa osnovnim funkcijama. Premium verzija sa naprednim mogućnostima je dostupna po studentskim cenama, sa posebnim popustima za studente iz Srbije.'
              },
              {
                id: 'item-2',
                question: 'Koje fakultete FAXit podržava?',
                answer: 'FAXit trenutno podržava više od 50 fakulteta u Srbiji, uključujući sve glavne univerzitete u Beogradu, Novom Sadu, Nišu i Kragujevcu. Kontinuirano dodajemo nove fakultete i smerove.'
              },
              {
                id: 'item-3',
                question: 'Kako FAXit štiti privatnost mojih podataka?',
                answer: 'Vaša privatnost nam je izuzetno važna. Svi podaci su šifrovani i čuvaju se u skladu sa GDPR propisima. Ne delimo vaše lične informacije sa trećim stranama bez vaše eksplicitne dozvole.'
              },
              {
                id: 'item-4',
                question: 'Mogu li da koristim FAXit offline?',
                answer: 'Trenutno FAXit zahteva internet konekciju za potpunu funkcionalnost. Međutim, radimo na offline mogućnostima koje će biti dostupne uskoro, omogućavajući vam da učite i kada nimate pristup internetu.'
              },
              {
                id: 'item-5',
                question: 'Kako mogu da dobijem podršku ako imam problema?',
                answer: 'Naš support tim je dostupan 24/7 preko live chat-a, emaila ili telefona. Takođe imamo opsežnu bazu znanja i video tutorijale koji pokrivaju sve aspekte korišćenja FAXit-a.'
              }
            ].map((faq) => (
              <div 
                key={faq.id}
                style={{
                  border: '1px solid rgba(78, 60, 250, 0.2)',
                  background: 'linear-gradient(135deg, rgba(78, 60, 250, 0.08) 0%, rgba(2, 1, 23, 0.6) 100%)',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  backdropFilter: 'blur(20px)',
                  overflow: 'hidden'
                }}
              >
                <button
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    color: '#FFFFFF',
                    fontSize: '18px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setActiveFAQ(activeFAQ === faq.id ? null : faq.id)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(78, 60, 250, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span>{faq.question}</span>
                  <span style={{
                    transform: activeFAQ === faq.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    fontSize: '20px'
                  }}>▼</span>
                </button>
                {activeFAQ === faq.id && (
                  <div style={{
                    padding: '0 24px 24px 24px',
                    color: '#9C9AA9',
                    fontSize: '16px',
                    lineHeight: 1.6,
                    borderTop: '1px solid rgba(78, 60, 250, 0.1)',
                    paddingTop: '20px'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_50%)]"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-12">
          <div className="space-y-8">
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none bg-gradient-to-br from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              Spreman da 
              <span className="block mt-2 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent relative">
                poboljšaš ocene?
                <div className="absolute -inset-2 bg-gradient-to-r from-white/20 to-white/10 blur-3xl rounded-full"></div>
              </span>
            </h2>
          </div>
          <p className="text-2xl md:text-3xl font-medium opacity-90 max-w-4xl mx-auto leading-relaxed">
            Pridruži se 
            <span className="font-bold text-white">hiljadama studenata</span> 
            koji već koriste FAXit za 
            <span className="font-bold text-white">bolje učenje</span> i 
            <span className="font-bold text-white">bolje rezultate</span> 
            na fakultetu.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Button className="group bg-white text-primary border-none rounded-3xl px-16 py-8 text-2xl font-black transition-all duration-700 shadow-2xl hover:shadow-white/30 hover:-translate-y-3 hover:scale-110 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-primary/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center gap-4">
                <Zap className="w-8 h-8 group-hover:rotate-12 group-hover:scale-125 transition-transform duration-500" />
                Počni besplatno
              </span>
            </Button>
            <Button className="group bg-white/10 text-white border-2 border-white/30 rounded-3xl px-16 py-8 text-2xl font-bold transition-all duration-700 backdrop-blur-xl shadow-xl hover:shadow-white/20 hover:-translate-y-3 hover:scale-110 hover:bg-white/20 hover:border-white/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center gap-4">
                <Play className="w-8 h-8 group-hover:scale-125 transition-transform duration-500" />
                Pogledaj demo
              </span>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-12 text-xl font-semibold opacity-90">
            <div className="group flex items-center gap-4 hover:opacity-100 transition-opacity duration-300">
              <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                <Check className="w-6 h-6" />
              </div>
              <span className="group-hover:text-white transition-colors duration-300">Besplatno probanje 30 dana</span>
            </div>
            <div className="group flex items-center gap-4 hover:opacity-100 transition-opacity duration-300">
              <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                <Check className="w-6 h-6" />
              </div>
              <span className="group-hover:text-white transition-colors duration-300">Bez ugovorne obaveze</span>
            </div>
            <div className="group flex items-center gap-4 hover:opacity-100 transition-opacity duration-300">
              <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                <Check className="w-6 h-6" />
              </div>
              <span className="group-hover:text-white transition-colors duration-300">Podrška 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #020117 0%, rgba(26, 22, 53, 1) 100%)',
        color: 'white',
        borderTop: '1px solid rgba(78, 60, 250, 0.2)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #4E3CFA 0%, #6A5ACD 100%)',
                  borderRadius: '8px'
                }} />
                <span className="text-2xl font-bold">FAXit</span>
              </div>
              <p style={{color: '#9C9AA9', marginBottom: '24px'}}>
                AI asistent koji revolucioniše način kako studenti uče i pristupaju gradivu na fakultetu.
              </p>
            </div>

            <div>
              <h4 style={{fontWeight: 600, marginBottom: '16px', color: '#FFFFFF'}}>Stranice</h4>
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
                      style={{
                        color: '#9C9AA9',
                        textDecoration: 'none',
                        transition: 'color 0.3s ease',
                        display: 'block',
                        padding: '4px 0',
                        fontSize: '16px'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#4E3CFA'}
                      onMouseOut={(e) => e.currentTarget.style.color = '#9C9AA9'}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{fontWeight: 600, marginBottom: '16px', color: '#FFFFFF'}}>Podrška</h4>
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
                      style={{
                        color: '#9C9AA9',
                        textDecoration: 'none',
                        transition: 'color 0.3s ease',
                        display: 'block',
                        padding: '4px 0',
                        fontSize: '16px'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#4E3CFA'}
                      onMouseOut={(e) => e.currentTarget.style.color = '#9C9AA9'}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{fontWeight: 600, marginBottom: '16px', color: '#FFFFFF'}}>Društvene mreže</h4>
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
                    style={{
                      color: '#9C9AA9',
                      transition: 'all 0.3s ease',
                      padding: '8px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = '#4E3CFA';
                      e.currentTarget.style.background = 'rgba(78, 60, 250, 0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = '#9C9AA9';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(78, 60, 250, 0.2)',
            paddingTop: '32px',
            marginTop: '32px'
          }}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p style={{color: '#9C9AA9', fontSize: '16px'}}>
                © 2024 FAXit. Sva prava zadržana.
              </p>
              
              <p style={{color: '#9C9AA9', fontSize: '16px'}}>
                Napravljeno sa ❤️ za studente Srbije
              </p>
            </div>
          </div>
        </div>
      </footer>
      </div>
      
    </TooltipProvider>
  );
};

export default MainHome;