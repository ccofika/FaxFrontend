import React, { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TooltipProvider } from "../../components/ui/tooltip";
import { ShinyButton } from "../../components/ui/shiny-button";
import './MainHome.css';

interface BillingPlan {
  id: 'free' | 'pro' | 'max';
  name: string;
  price: string;
  prompts: string;
  features: string[];
  popular?: boolean;
}

interface FAQItem {
  question: string;
  answer: string;
}

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const billingPlans: BillingPlan[] = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '$0/month',
      prompts: '10 prompts per day',
      features: [
        'Basic chat modes',
        'Standard response time',
        'Community support',
        'Basic file attachments'
      ]
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '$20/month',
      prompts: 'Unlimited prompts',
      features: [
        'All chat modes',
        'Priority response time',
        'Email support',
        'Advanced file attachments',
        'Chat history export',
        'Custom themes',
        'API access'
      ],
      popular: true
    },
    {
      id: 'max',
      name: 'Max Plan',
      price: '$50/month',
      prompts: 'Unlimited prompts',
      features: [
        'Everything in Pro',
        'Lightning fast responses',
        'Dedicated support',
        'Advanced analytics',
        'Team collaboration',
        'Custom integrations',
        'Priority feature requests',
        'White-label options'
      ]
    }
  ];

  const faqItems: FAQItem[] = [
    {
      question: 'Kako funkcioniše plaćanje?',
      answer: 'Plaćanje se vrši mesečno putem kreditnih kartica, PayPal-a ili bankovnog transfera. Možete otkazati pretplatu u bilo kom trenutku bez dodatnih troškova.'
    },
    {
      question: 'Da li mogu da otkažem pretplatu?',
      answer: 'Da, možete otkazati pretplatu u bilo kom trenutku. Vaš plan će ostati aktivan do kraja plaćenog perioda, nakon čega se neće automatski obnoviti.'
    },
    {
      question: 'Da li postoji probni period?',
      answer: 'Da! Tim/Odsek plan dolazi sa 14-dnevnim besplatnim probnim periodom. Možete testirati sve funkcije bez obaveze plaćanja.'
    },
    {
      question: 'Šta uključuje Student plan?',
      answer: 'Student plan je potpuno besplatan i uključuje 10 pitanja dnevno, pristup osnovnim chat modovima, kao i osnovnoj biblioteci knjiga i materijala.'
    },
    {
      question: 'Kako funkcioniše Tim/Odsek plan?',
      answer: 'Tim plan omogućava deljenje materijala između članova, zajedničke testove, neograničena pitanja, i napredne funkcije kolaboracije.'
    },
    {
      question: 'Šta su white-label opcije?',
      answer: 'White-label opcije omogućavaju univerzitetima da prilagode platformu svojim potrebama, uključujući brending, custom domain, i integraciju sa postojećim sistemima.'
    }
  ];

  const handlePlanSelect = (planId: string) => {
    if (planId === 'free') {
      navigate('/register');
    } else if (planId === 'pro') {
      navigate('/register?plan=pro');
    } else if (planId === 'max') {
      navigate('/register?plan=max');
    }
  };

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
              💰 Transparentne cene
            </motion.div>
            
            <motion.h1 
              className="hero-title"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Izaberite plan
              <br />
              <span className="gradient-text">koji vam odgovara</span>
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Jednostavne cene bez skrivenih troškova. Počnite besplatno i upgrade-ujte kad god želite.
            </motion.p>
          </motion.div>
        </motion.section>

        {/* Pricing Plans Section */}
        <motion.section 
          className="modes-section"
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
              Naši planovi
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Od besplatnog plana do naprednih funkcija za profesionalce
            </motion.p>
          </div>

          <div className="pricing-grid">
            {billingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={`pricing-card ${plan.popular ? 'popular' : ''}`}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                {plan.popular && (
                  <motion.div 
                    className="popular-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                    </svg>
                    Najpopularniji
                  </motion.div>
                )}
                
                <div className="pricing-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">{plan.price}</div>
                  <div className="plan-prompts">{plan.prompts}</div>
                </div>

                <div className="plan-features">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div 
                      key={featureIndex} 
                      className="plan-feature"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 + featureIndex * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShinyButton
                    className={`plan-button ${plan.popular ? 'primary' : 'secondary'}`}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {plan.id === 'free' ? 'Počni besplatno' : `Izaberi ${plan.name}`}
                  </ShinyButton>
                </motion.div>
              </motion.div>
            ))}
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
              Često postavljena pitanja
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Odgovori na najčešća pitanja o planovima, plaćanju i funkcionalnostima
            </motion.p>
          </div>

          <div className="faq-container">
            {faqItems.map((item, index) => (
              <motion.div 
                key={index} 
                className="faq-item"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
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
            ))}
          </div>
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

export default Pricing;