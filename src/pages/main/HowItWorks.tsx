import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import './MainHome.css';

const HowItWorks: React.FC = () => {
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
      fullDescription: 'AI kreira personalizovani plan učenja na osnovu tvog rasporeja i ciljeva. Interaktivno te vodi kroz gradivo prilagođavajući tempo i fokus na osnovu tvog napretka.',
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
            🎯 Kako funkcioniše FAXit
          </div>
          
          <h1 className="hero-title">
            Tvoj AI tutor koji
            <br />razume tvoje knjige
          </h1>
          
          <p className="hero-subtitle">
            FAXit koristi naprednu AI tehnologiju da analizira tvoje udžbenike i materijale, 
            omogućavajući ti personalizovano učenje prilagođeno baš tvom kurikulumu
          </p>

          <div className="hero-actions">
            <button className="hero-cta-primary">
              Započni besplatno
            </button>
            <button className="hero-cta-secondary" onClick={() => {
              const onboardingSection = document.querySelector('.onboarding-section');
              if (onboardingSection) {
                onboardingSection.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center' 
                });
              }
            }}>
              <span className="play-icon">👇</span>
              Vidi kako funkcioniše
            </button>
          </div>
        </div>

        {/* AI Introduction */}
        <div className="ai-intro-preview">
          <div className="ai-intro-container">
            <div className="ai-intro-content">
              <div className="ai-intro-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c.552 0 1-.448 1-1V8c0-.552-.448-1-1-1h-3c-.552 0-1 .448-1 1v3c0 .552.448 1 1 1h3z"/>
                </svg>
              </div>
              <div className="ai-intro-text">
                <h3>Kako AI koristi tvoje materijale</h3>
                <p>
                  FAXit AI čita i analizira sve tvoje udžbenike, predavanja i materijale. 
                  Na osnovu toga kreira personalizovanu bazu znanja koja razume specifičnosti 
                  tvog fakulteta, smera i predmeta. Svaki odgovor je baziran na tvojim izvorima.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding Steps Section */}
      <section className="onboarding-section">
        <div className="section-header">
          <h2 className="section-title">Korak po korak do uspeha</h2>
          <p className="section-subtitle">
            4 jednostavna koraka do personalizovanog AI tutora
          </p>
        </div>

        <div className="steps-grid">
          {onboardingSteps.map((step) => (
            <div
              key={step.step}
              className={`step-card ${hoveredStep === step.step ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredStep(step.step)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div className="step-number">
                {step.step}
              </div>
              
              <div className="step-content">
                <div className="step-icon">
                  {step.icon}
                </div>
                
                <h3 className="step-title">
                  {step.title}
                </h3>
                
                <p className="step-description">
                  {step.description}
                </p>
              </div>

              <div className="step-screenshot">
                <div className="screenshot-placeholder">
                  <span>Screenshot/GIF</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5 Modes Detailed Section */}
      <section className="modes-detailed-section">
        <div className="section-header">
          <h2 className="section-title">5 režima rada - detaljnije</h2>
          <p className="section-subtitle">
            Svaki režim je dizajniran za specifične potrebe učenja
          </p>
        </div>

        <div className="modes-detailed-grid">
          {modes.map((mode) => (
            <div
              key={mode.id}
              className={`mode-detailed-card ${hoveredMode === mode.id ? `hovered-${mode.id}` : ''}`}
              onMouseEnter={() => setHoveredMode(mode.id)}
              onMouseLeave={() => setHoveredMode(null)}
            >
              <div className="mode-detailed-header">
                <div className={`mode-icon ${mode.id}`}>
                  {mode.icon}
                </div>
                <div className="mode-title-section">
                  <h3 className={`mode-name ${hoveredMode === mode.id ? `hovered-${mode.id}` : ''}`}>
                    {mode.name}
                  </h3>
                  <p className="mode-short-description">
                    {mode.shortDescription}
                  </p>
                </div>
              </div>
              
              <p className="mode-full-description">
                {mode.fullDescription}
              </p>

              <div className="mode-features">
                <h4>Ključne mogućnosti:</h4>
                <ul>
                  {mode.features.map((feature, index) => (
                    <li key={index}>
                      <span className="feature-check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-background">
          <div className="cta-particles"></div>
        </div>
        
        <div className="cta-content">
          <h2 className="cta-title">
            Spreman si da revolucionišeš
            <br />način kako učiš?
          </h2>
          
          <p className="cta-subtitle">
            Pridruži se hiljadama studenata koji već koriste FAXit za bolje ocene i efikasniji pristup učenju
          </p>

          <div className="cta-actions">
            <Link to="/register" className="cta-primary">
              Isprobaj sada - besplatno
            </Link>
            <Link to="/main/demonstracija" className="cta-secondary">
              Pogledaj demonstraciju
            </Link>
          </div>

          <div className="cta-features">
            <div className="cta-feature">
              <span className="cta-feature-icon">✨</span>
              <span>Besplatna registracija</span>
            </div>
            <div className="cta-feature">
              <span className="cta-feature-icon">🚀</span>
              <span>Setup za 2 minuta</span>
            </div>
            <div className="cta-feature">
              <span className="cta-feature-icon">🎯</span>
              <span>Trenutni rezultati</span>
            </div>
          </div>
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
                  { name: 'Početna', path: '/main' },
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

export default HowItWorks;