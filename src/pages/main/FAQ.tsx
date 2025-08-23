import React, { useState } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TooltipProvider } from "../../components/ui/tooltip";
import { ShinyButton } from "../../components/ui/shiny-button";
import './MainHome.css';

interface FAQItem {
  question: string;
  answer: string;
  category: 'knjige' | 'placanje' | 'akademski' | 'tehnicka';
}

interface Category {
  id: 'knjige' | 'placanje' | 'akademski' | 'tehnicka' | 'sve';
  name: string;
  icon: React.ReactNode;
}

const FAQ: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('sve');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();

  const categories: Category[] = [
    {
      id: 'sve',
      name: 'Sve kategorije',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="9" y1="9" x2="15" y2="9"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
      )
    },
    {
      id: 'knjige',
      name: 'Knjige i materijali',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      )
    },
    {
      id: 'placanje',
      name: 'Plaćanje',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      )
    },
    {
      id: 'akademski',
      name: 'Akademski integritet',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12l2 2 4-4"/>
          <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
          <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
          <path d="M12 3c0 1 1 3 3 3s3-2 3-3-1-3-3-3-3 2-3 3"/>
          <path d="M12 21c0-1-1-3-3-3s-3 2-3 3 1 3 3 3 3-2 3-3"/>
        </svg>
      )
    },
    {
      id: 'tehnicka',
      name: 'Tehnička pitanja',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      )
    }
  ];

  const faqItems: FAQItem[] = [
    // Knjige i materijali
    {
      category: 'knjige',
      question: 'Kako da pronađem potrebnu literaturu za moj fakultet?',
      answer: 'FAXit automatski prepoznaje vaš fakultet i smer na osnovu vašeg profila. U sekciji "Materijali" možete pretražiti po predmetu, profesoru ili ključnim rečima. Svi materijali su organizovani po semestrima i godinama studija.'
    },
    {
      category: 'knjige',
      question: 'Da li mogu da uploadujem svoje materijale?',
      answer: 'Da! Studenti mogu da dele svoje beleške, prezentacije i ostale materijale sa zajednicom. Svi uploadovani materijali prolaze kroz moderaciju pre objavljivanja kako bi se osigurala kvaliteta sadržaja.'
    },
    {
      category: 'knjige',
      question: 'Koliko materijala mogu da preuzimam dnevno?',
      answer: 'Besplatni korisnici mogu da preuzimaju do 5 materijala dnevno, Pro korisnici imaju neograničen pristup svim materijalima, dok Max korisnici dodatno imaju pristup ekskluzivnim materijalima i resursima.'
    },
    {
      category: 'knjige',
      question: 'Da li su materijali ažurirani sa aktuelnim nastavnim planovima?',
      answer: 'Trudimo se da svi materijali budu u skladu sa trenutnim nastavnim planovima. Imamo tim koji redovno komunicira sa fakultetima i ažurira sadržaj. Ako primetite zastarele informacije, molimo vas da nas obavestite.'
    },

    // Plaćanje
    {
      category: 'placanje',
      question: 'Koje načine plaćanja prihvatate?',
      answer: 'Prihvatamo kreditne i debitne kartice (Visa, MasterCard, American Express), PayPal, kao i bankovski transfer za srpske banke. Sva plaćanja su bezbedna i zaštićena SSL enkripcijom.'
    },
    {
      category: 'placanje',
      question: 'Da li mogu da otkažem pretplatu u bilo kom trenutku?',
      answer: 'Apsolutno! Možete otkazati pretplatu kad god želite iz vašeg profila. Nema skrivenih troškova niti penala. Vaš plan će ostati aktivan do kraja plaćenog perioda.'
    },
    {
      category: 'placanje',
      question: 'Da li nudite studentske popuste?',
      answer: 'Da! Studenti sa važećom studentskom dozvolom mogu dobiti 30% popusta na Pro plan. Pošaljite nam sliku studentske dozvole na email support@faxit.rs za aktivaciju popusta.'
    },
    {
      category: 'placanje',
      question: 'Šta se dešava ako zaboravim da platim račun?',
      answer: 'Imate 7 dana grace perioda posle isteka pretplate. Tokom tog vremena možete obnoviti pretplatu bez gubitka podataka. Nakon toga, vaš nalog prelazi na besplatnu verziju.'
    },

    // Akademski integritet
    {
      category: 'akademski',
      question: 'Da li korišćenje AI asisistenta krši akademski integritet?',
      answer: 'FAXit je dizajniran da pomaže u učenju, a ne da radi umesto vas. Preporučujemo da koristite AI kao alat za razumevanje gradiva, a ne za prepisivanje odgovora. Uvek konsultujte sa vašim profesorima o politici korišćenja AI alata.'
    },
    {
      category: 'akademski',
      question: 'Da li mogu da koristim odgovore AI-a direktno u svojim radovima?',
      answer: 'Ne preporučujemo direktno kopiranje AI odgovora u akademskim radovima. FAXit treba da koristite za dublje razumevanje tema i koncepata. Uvek citirajte izvore i budite transparentni o korišćenju AI alata.'
    },
    {
      category: 'akademski',
      question: 'Kako osiguravate originalnost materijala na platformi?',
      answer: 'Svi uploadovani materijali prolaze kroz sistem za proveru plagijarizma. Imamo jasne smernice protiv deljenja tuđih radova bez dozvole. Korisnici koji krše ove principe mogu biti privremeno ili trajno banovani.'
    },

    // Tehnička pitanja
    {
      category: 'tehnicka',
      question: 'FAXit radi sporo ili se ne učitava. Šta da radim?',
      answer: 'Prvo pokušajte da osvežite stranicu ili restartujete browser. Proverite internetsku vezu. Ako problem i dalje postoji, očistite cache i cookies ili pokušajte sa drugim browserom. Kontaktirajte podršku ako se problem nastavi.'
    },
    {
      category: 'tehnicka',
      question: 'Da li FAXit radi na mobilnim uređajima?',
      answer: 'Da! FAXit je potpuno optimizovan za mobilne uređaje i tablete. Možete pristupiti sa bilo kog browsera na iOS ili Android uređaju. Uskoro planiramo i native mobile aplikacije.'
    },
    {
      category: 'tehnicka',
      question: 'Zaboravio sam lozinku. Kako da je resetujem?',
      answer: 'Na stranici za prijavu kliknite na "Zaboravili ste lozinku?" i unesite vaš email. Dobićete link za resetovanje lozinke. Proverite i spam folder. Ako ne dobijete email, kontaktirajte podršku.'
    },
    {
      category: 'tehnicka',
      question: 'Da li moji podaci i konverzacije su bezbedni?',
      answer: 'Vaša privatnost je naš prioritet. Svi podaci su enkriptovani i čuvaju se na sigurnim serverima. Ne delimo vaše lične informacije sa trećim stranama. Možete obrisati svoj nalog i sve podatke u bilo kom trenutku.'
    },
    {
      category: 'tehnicka',
      question: 'Koje browsere podržavate?',
      answer: 'FAXit najbolje radi na najnovijim verzijama Chrome, Firefox, Safari i Edge. Preporučujemo ažuriranje browsera za najbolju funkcionalnost. Internet Explorer nije podržan.'
    }
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = selectedCategory === 'sve' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <TooltipProvider>
      <div className="main-home">
        {/* Modern Header */}
        <motion.header 
          className="modern-header"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="scroll-progress" 
            style={{ scaleX: scrollYProgress }} 
          />
          
          <div className="header-content">
            <motion.div 
              className="header-logo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
            >
              <div className="logo-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill="url(#logoGradient)" />
                  <path d="M12 8h8v2h-6v4h5v2h-5v6h-2V8z" fill="white" />
                  <defs>
                    <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32">
                      <stop stopColor="#3b82f6" />
                      <stop offset="1" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="logo-text">FAXit</span>
            </motion.div>

            <nav className="header-nav">
              {[
                { name: 'Kako funkcioniše', path: '/main/kako-funkcionise' },
                { name: 'Fakulteti', path: '/main/podrzani-fakulteti' },
                { name: 'Demo', path: '/main/demonstracija' },
                { name: 'Cene', path: '/main/cene' },
                { name: 'FAQ', path: '/main/faq' },
                { name: 'Kontakt', path: '/main/kontakt' }
              ].map((item, index) => (
                <motion.span
                  key={index}
                  className={`nav-item ${window.location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {item.name}
                </motion.span>
              ))}
            </nav>

            <div className="header-actions">
              <motion.span 
                className="nav-item"
                onClick={() => navigate('/login')}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Prijava
              </motion.span>
              <ShinyButton 
                onClick={() => navigate('/register')} 
                className="register-button"
              >
                Registracija
              </ShinyButton>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.section 
          className="hero-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-background">
            <div className="hero-particles"></div>
            <div className="hero-grid"></div>
            <div className="hero-glow"></div>
          </div>
          
          <motion.div 
            className="hero-content"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="hero-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              ❓ Često postavljena pitanja
            </motion.div>
            
            <motion.h1 
              className="hero-title"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Dobijte odgovore
              <br />
              <span className="gradient-text">na svoja pitanja</span>
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Pretražite našu bazu znanja ili kontaktirajte naš tim za dodatnu pomoć
            </motion.p>
          </motion.div>
        </motion.section>

        {/* Search Section */}
        <motion.section 
          className="search-section"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="search-container">
            <motion.div 
              className="search-box"
              whileFocus={{ scale: 1.02 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Pretražite pitanja..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Categories Section */}
        <motion.section 
          className="categories-section"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="categories-container">
            <div className="categories-grid">
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="category-icon">{category.icon}</div>
                  <span className="category-name">{category.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          className="benefits-section"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="section-header">
            <motion.h2 
              className="section-title"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {selectedCategory === 'sve' 
                ? `Sva pitanja (${filteredFAQs.length})` 
                : `${categories.find(c => c.id === selectedCategory)?.name} (${filteredFAQs.length})`
              }
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              {searchQuery ? `Rezultati pretrage za: "${searchQuery}"` : 'Kliknite na pitanje da vidite odgovor'}
            </motion.p>
          </div>

          <div className="faq-container">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((item, index) => (
                <motion.div 
                  key={index} 
                  className="faq-item"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <motion.button 
                    className={`faq-question ${expandedFAQ === index ? 'expanded' : ''}`}
                    onClick={() => toggleFAQ(index)}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{item.question}</span>
                    <motion.svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      className="faq-icon"
                      animate={{ rotate: expandedFAQ === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <polyline points="6,9 12,15 18,9"/>
                    </motion.svg>
                  </motion.button>
                  
                  <AnimatePresence>
                    {expandedFAQ === index && (
                      <motion.div 
                        className="faq-answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p>{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="no-results"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
                <h3>Nema rezultata</h3>
                <p>Pokušajte sa drugačijim ključnim rečima ili izaberite drugu kategoriju.</p>
              </motion.div>
            )}
          </div>

          {/* Contact CTA */}
          <motion.div 
            className="contact-cta"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="cta-content">
              <h3>Niste našli odgovor na vaše pitanje?</h3>
              <p>Naš tim je tu da vam pomogne. Kontaktirajte nas direktno.</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShinyButton 
                  className="cta-button"
                  onClick={() => navigate('/main/kontakt')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Kontaktirajte nas
                </ShinyButton>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* Footer */}
        <motion.footer 
          className="main-footer"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
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
                      <motion.span 
                        className="footer-link"
                        onClick={() => navigate(link.path)}
                        whileHover={{ x: 5 }}
                      >
                        {link.name}
                      </motion.span>
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
                      <motion.span 
                        className="footer-link"
                        onClick={() => navigate(link.path)}
                        whileHover={{ x: 5 }}
                      >
                        {link.name}
                      </motion.span>
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
                    <motion.a 
                      key={index} 
                      href="#" 
                      className="social-link"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {social.icon}
                    </motion.a>
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
        </motion.footer>
      </div>
    </TooltipProvider>
  );
};

export default FAQ;