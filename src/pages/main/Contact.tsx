import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import './MainHome.css';
import styles from './Contact.module.css';

interface FormData {
  ime: string;
  email: string;
  tema: string;
  poruka: string;
}

interface SystemStatus {
  component: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: string;
}

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    ime: '',
    email: '',
    tema: '',
    poruka: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');

  const systemStatus: SystemStatus[] = [
    { component: 'API Server', status: 'operational', uptime: '99.9%' },
    { component: 'Database', status: 'operational', uptime: '99.8%' },
    { component: 'Web App', status: 'operational', uptime: '99.9%' },
    { component: 'File Storage', status: 'operational', uptime: '99.7%' }
  ];

  const contactMethods = [
    {
      type: 'Email',
      value: 'support@faxit.rs',
      description: 'Odgovaramo u roku od 24h',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      )
    },
    {
      type: 'Telefon',
      value: '+381 11 123-456',
      description: 'Radnim danima 9-17h',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      )
    },
    {
      type: 'Live Chat',
      value: 'Dostupan 24/7',
      description: 'Trenutno offline',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      )
    }
  ];

  const socialLinks = [
    {
      name: 'Twitter',
      url: 'https://twitter.com/faxit_rs',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/faxit-rs',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/faxit.rs',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('Hvala vam! Vaša poruka je uspešno poslata. Odgovorićemo vam u najkraćem roku.');
      setFormData({ ime: '', email: '', tema: '', poruka: '' });
      setIsSubmitting(false);
    }, 2000);
  };

  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'operational': return '#10B981';
      case 'degraded': return '#F59E0B';
      case 'outage': return '#EF4444';
      default: return '#9C9AA9';
    }
  };

  const getStatusText = (status: SystemStatus['status']) => {
    switch (status) {
      case 'operational': return 'Operacionalno';
      case 'degraded': return 'Degradirano';
      case 'outage': return 'Nedostupno';
      default: return 'Nepoznato';
    }
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
            📞 Kontakt i podrška
          </div>
          
          <h1 className="hero-title">
            Stupite u kontakt
            <br />sa našim timom
          </h1>
          
          <p className="hero-subtitle">
            Imamo pitanje ili trebate pomoć? Naš tim je tu da vam pomogne
          </p>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className={styles.contactMethodsSection}>
        <div className={styles.contactMethodsContainer}>
          <h2 className={styles.sectionTitle}>Direktni kontakt</h2>
          <div className={styles.contactMethodsGrid}>
            {contactMethods.map((method, index) => (
              <div key={index} className={styles.contactMethodCard}>
                <div className={styles.methodIcon}>{method.icon}</div>
                <div className={styles.methodInfo}>
                  <h3 className={styles.methodType}>{method.type}</h3>
                  <p className={styles.methodValue}>{method.value}</p>
                  <span className={styles.methodDescription}>{method.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className={styles.contactFormSection}>
        <div className={styles.contactFormContainer}>
          <div className={styles.formWrapper}>
            <h2 className={styles.formTitle}>Pošaljite nam poruku</h2>
            <p className={styles.formSubtitle}>
              Popunite formu ispod i odgovorićemo vam u najkraćem roku
            </p>

            {submitMessage && (
              <div className={styles.successMessage}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
                {submitMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="ime" className={styles.formLabel}>Ime i prezime *</label>
                  <input
                    type="text"
                    id="ime"
                    name="ime"
                    value={formData.ime}
                    onChange={handleInputChange}
                    required
                    className={styles.formInput}
                    placeholder="Unesite vaše ime i prezime"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>Email adresa *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={styles.formInput}
                    placeholder="vasa.email@adresa.com"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="tema" className={styles.formLabel}>Tema *</label>
                <select
                  id="tema"
                  name="tema"
                  value={formData.tema}
                  onChange={handleInputChange}
                  required
                  className={styles.formSelect}
                >
                  <option value="">Izaberite temu...</option>
                  <option value="tehnicka-podrska">Tehnička podrška</option>
                  <option value="billing">Billing i plaćanja</option>
                  <option value="funkcionalnosti">Funkcionalnosti i predlozi</option>
                  <option value="partnerstvi">Partnerstva i saradnja</option>
                  <option value="ostalo">Ostalo</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="poruka" className={styles.formLabel}>Poruka *</label>
                <textarea
                  id="poruka"
                  name="poruka"
                  value={formData.poruka}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className={styles.formTextarea}
                  placeholder="Opišite vaš upit ili problem detaljno..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? (
                  <>
                    <svg className={styles.loadingSpinner} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                    Šalje se...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                    </svg>
                    Pošaljite poruku
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* System Status Section */}
      <section className={styles.statusSection}>
        <div className={styles.statusContainer}>
          <div className={styles.statusHeader}>
            <h2 className={styles.statusTitle}>Status sistema</h2>
            <p className={styles.statusSubtitle}>Trenutno stanje naših servisa</p>
            <a href="/status" className={styles.statusLink}>
              Detaljne informacije
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17l9.2-9.2M17 17V7H7"/>
              </svg>
            </a>
          </div>
          
          <div className={styles.statusGrid}>
            {systemStatus.map((item, index) => (
              <div key={index} className={styles.statusItem}>
                <div className={styles.statusInfo}>
                  <div className={styles.statusName}>{item.component}</div>
                  <div className={styles.statusUptime}>{item.uptime} uptime</div>
                </div>
                <div className={styles.statusIndicator}>
                  <div 
                    className={styles.statusDot}
                    style={{ backgroundColor: getStatusColor(item.status) }}
                  />
                  <span className={styles.statusText}>
                    {getStatusText(item.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className={styles.socialSection}>
        <div className={styles.socialContainer}>
          <h2 className={styles.socialTitle}>Pratite nas</h2>
          <p className={styles.socialSubtitle}>
            Budite u toku sa najnovijim vestima i ažuriranjima
          </p>
          
          <div className={styles.socialLinks}>
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                {social.icon}
                {social.name}
              </a>
            ))}
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
                AI asistent koji revolucioniše način kako studenti uče i pristupaju gradivu na fakultetu.
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
                    <span 
                      className="footer-link"
                      onClick={() => navigate(link.path)}
                    >
                      {link.name}
                    </span>
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
                    <span 
                      className="footer-link"
                      onClick={() => navigate(link.path)}
                    >
                      {link.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h4>Društvene mreže</h4>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="social-link">
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

export default Contact;