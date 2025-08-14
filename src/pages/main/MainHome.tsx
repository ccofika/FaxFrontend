import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import './MainHome.css';

const MainHome: React.FC = () => {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const modes = [
    {
      id: 'explain',
      name: 'Explain',
      description: 'Objašnjava složene koncepte jednostavnim jezikom',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <path d="M12 17h.01"/>
        </svg>
      ),
      color: '#4E3CFA',
      preview: 'Pita AI-ja "Objasni mi kako funkcioniše ovaj algoritam" i dobija detaljno objašnjenje prilagođeno nivou'
    },
    {
      id: 'solve',
      name: 'Solve',
      description: 'Rešava probleme i zadatke korak po korak',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <path d="M9 12l2 2 4-4"/>
          <path d="M21 12c.552 0 1-.448 1-1V8c0-.552-.448-1-1-1h-3c-.552 0-1 .448-1 1v3c0 .552.448 1 1 1h3z"/>
          <path d="M3 12c-.552 0-1-.448-1-1V8c0-.552.448-1 1-1h3c.552 0 1 .448 1 1v3c0 .552-.448 1-1 1H3z"/>
          <path d="M12 21c-.552 0-1-.448-1-1v-3c0-.552.448-1 1-1h3c.552 0 1 .448 1 1v3c0 .552-.448 1-1 1h-3z"/>
          <path d="M12 3c-.552 0-1-.448-1-1V1c0-.552.448-1 1-1h3c.552 0 1 .448 1 1v1c0 .552-.448 1-1 1h-3z"/>
        </svg>
      ),
      color: '#4E3CFA',
      preview: 'Kači fotografiju zadatka iz matematike i AI rešava sa objašnjenjem svakog koraka'
    },
    {
      id: 'summary',
      name: 'Summary',
      description: 'Pravi sažetke tekstova i materijala',
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
      preview: 'Upload-uje 50-stranični PDF i dobija ključne tačke sažete u nekoliko pasusa'
    },
    {
      id: 'tests',
      name: 'Tests',
      description: 'Generiše testove za vežbanje gradiva',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14,2 14,8 20,8"/>
          <path d="M10 12a2 2 0 1 0 4 0 2 2 0 1 0-4 0z"/>
          <path d="M10 12v1a2 2 0 0 0 4 0v-1"/>
        </svg>
      ),
      color: '#4E3CFA',
      preview: 'Na osnovu gradiva kreira test sa 20 pitanja multiple choice + objašnjenja odgovora'
    },
    {
      id: 'learning',
      name: 'Learning',
      description: 'Interaktivno učenje sa AI tutorom',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      ),
      color: '#4E3CFA',
      preview: 'AI postavlja pitanja, daje savete i prilagođava tempo učenja na osnovu napretka'
    }
  ];

  const benefits = [
    {
      title: 'Prilagođeno tvom smeru',
      description: 'AI razume specifičnosti tvog fakulteta i smer',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      )
    },
    {
      title: 'Radi sa tvojim knjigama',
      description: 'Upload-uj materijale i dobij odgovore iz tvojih izvora',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      )
    },
    {
      title: 'Dostupno 24/7',
      description: 'Tvoj AI asistent ne spava - učiš kad god želiš',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
      )
    },
    {
      title: 'Napredna analitika',
      description: 'Prati napredak i identifikuje oblasti za poboljšanje',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <path d="M3 3v18h18"/>
          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
        </svg>
      )
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
    <div className="main-home">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-particles"></div>
          <div className="hero-grid"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            ⭐ Više od običnog AI tutora
          </div>
          
          <h1 className="hero-title">
            Tvoj AI asistent
            <br />za fakultet
          </h1>
          
          <p className="hero-subtitle">
            FAXit pomaže studentima da lakše uče, rešavaju zadatke i pripremaju se za ispite uz naprednu AI tehnologiju
          </p>

          <div className="hero-actions">
            <button className="hero-cta-primary">
              Započni besplatno
            </button>
            <button className="hero-cta-secondary" onClick={() => {
              const videoSection = document.querySelector('.video-preview');
              if (videoSection) {
                videoSection.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center' 
                });
              }
            }}>
              <span className="play-icon">▶</span>
              Pogledaj video
            </button>
          </div>
        </div>

        {/* Video Preview */}
        <div className="video-preview">
          <div className="video-container">
            <div className="video-background">
              <div className="video-content">
                <div className="video-window">
                  <div className="video-frame">
                    <video 
                      className="video-element"
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
                      style={{ position: 'relative', zIndex: 1 }}
                    >
                      <source src="/videos/test-video.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Custom Video Controls */}
                    <div className="video-controls">
                      {/* Play/Pause Button */}
                      <div className="video-play-button" onClick={handleVideoPlay}>
                        {isVideoPlaying ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                            <rect x="6" y="4" width="4" height="16"/>
                            <rect x="14" y="4" width="4" height="16"/>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                            <polygon points="5,3 19,12 5,21"/>
                          </svg>
                        )}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="video-progress-container" onClick={handleProgressClick}>
                        <div className="video-progress-bar">
                          <div 
                            className="video-progress-fill"
                            style={{ width: `${videoDuration ? (videoCurrentTime / videoDuration) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Time Display */}
                      <div className="video-time">
                        {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
                      </div>
                    </div>
                    
                    {/* Large Play Overlay (only when paused) */}
                    {!isVideoPlaying && (
                      <div className="play-overlay" onClick={handleVideoPlay}>
                        <div className="play-button">
                          <span>▶</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Modes Section */}
      <section className="modes-section">
        <div className="section-header">
          <h2 className="section-title">5 načina da učiš</h2>
          <p className="section-subtitle">
            Svaki režim je dizajniran za različite tipove pitanja i izazova
          </p>
        </div>

        <div className="modes-grid">
          {modes.map((mode) => (
            <div
              key={mode.id}
              className={`mode-card ${hoveredMode === mode.id ? `hovered-${mode.id}` : ''}`}
              onMouseEnter={() => setHoveredMode(mode.id)}
              onMouseLeave={() => setHoveredMode(null)}
            >
              <div className="mode-header">
                <div className={`mode-icon ${mode.id}`}>
                  {mode.icon}
                </div>
                <h3 className={`mode-name ${hoveredMode === mode.id ? `hovered-${mode.id}` : ''}`}>
                  {mode.name}
                </h3>
              </div>
              
              <p className="mode-description">
                {mode.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="section-header">
          <h2 className="section-title">Zašto FAXit?</h2>
          <p className="section-subtitle">
            Više od običnog AI-ja - tvoj lični tutor koji razume fakultet
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">
                {benefit.icon}
              </div>
              
              <h3 className="benefit-title">
                {benefit.title}
              </h3>
              
              <p className="benefit-description">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">Šta kažu studenti</h2>
          <p className="section-subtitle">
            Hiljade studenata već koristi FAXit za bolje ocene
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  {testimonial.avatar}
                </div>
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.faculty} • {testimonial.year}</p>
                </div>
              </div>
              
              <p className="testimonial-quote">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <div className="footer-logo">
                  <div className="footer-logo-icon"/>
                </div>
                <span className="footer-brand-name">FAXit</span>
              </div>
              <p className="footer-description">
                AI asistent koji revolucioniše način kako studenti uče i pristupaju gradivuu na fakultetu.
              </p>
            </div>

            <div className="footer-section">
              <h4>Stranice</h4>
              <ul className="footer-links">
                {[
                  { name: 'Kako funkcioniše', path: '/main/kako-funkcionise' },
                  { name: 'Podržani fakulteti', path: '/main/podrzani-fakulteti' },
                  { name: 'Demonstracija', path: '/main/demonstracija' },
                  { name: 'Cene', path: '/main/cene' },
                  { name: 'FAQ', path: '/main/faq' }
                ].map((link, index) => (
                  <li key={index}>
                    <Link to={link.path} className="footer-link">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h4>Podrška</h4>
              <ul className="footer-links">
                {[
                  { name: 'Kontakt', path: '/main/kontakt' },
                  { name: 'Uslovi korišćenja', path: '/terms' },
                  { name: 'Privatnost', path: '/privacy' },
                  { name: 'Status sistema', path: '/status' }
                ].map((link, index) => (
                  <li key={index}>
                    <Link to={link.path} className="footer-link">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h4>Društvene mreže</h4>
              <div className="social-links">
                {[
                  {
                    name: 'Twitter',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    )
                  },
                  {
                    name: 'LinkedIn',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    )
                  },
                  {
                    name: 'Instagram',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    )
                  }
                ].map((social, index) => (
                  <a key={index} href="#" className="social-link">
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2024 FAXit. Sva prava zadržana.
            </p>
            
            <p className="footer-copyright">
              Napravljeno sa ❤️ za studente Srbije
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainHome;