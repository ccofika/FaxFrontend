import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import styles from './SupportedFaculties.module.css';

const SupportedFaculties: React.FC = () => {
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);

  const universities = [
    {
      id: 'bg',
      name: 'Univerzitet u Beogradu',
      logo: '/images/logos/bg-uni.png',
      faculties: [
        {
          id: 'etf',
          name: 'Elektrotehnički fakultet',
          programs: [
            'Računarstvo i informatika',
            'Elektroenergetika',
            'Elektronika i telekomunikacije',
            'Automatika',
            'Biomedicinsko inženjerstvo'
          ],
          subjects: ['Matematika 1', 'Programiranje', 'Fizika', 'Analiza', 'Algebra']
        },
        {
          id: 'fon',
          name: 'Fakultet organizacionih nauka',
          programs: [
            'Informacioni sistemi',
            'Menadžment',
            'Operaciona istraživanja',
            'E-business'
          ],
          subjects: ['Matematika', 'Statistika', 'Osnove programiranja', 'Ekonomija']
        },
        {
          id: 'matf',
          name: 'Matematički fakultet',
          programs: [
            'Matematika',
            'Računarstvo i informatika',
            'Statistika',
            'Astronimija'
          ],
          subjects: ['Analiza 1', 'Algebra', 'Geometrija', 'Programiranje', 'Logika']
        },
        {
          id: 'medicina',
          name: 'Medicinski fakultet',
          programs: [
            'Medicina',
            'Stomatologija',
            'Farmacija'
          ],
          subjects: ['Anatomija', 'Biologija', 'Hemija', 'Fiziologija', 'Patologija']
        },
        {
          id: 'ekonomski',
          name: 'Ekonomski fakultet',
          programs: [
            'Ekonomija',
            'Menadžment i organizacija',
            'Statistika i informatika',
            'Finansije'
          ],
          subjects: ['Mikroekonomija', 'Makroekonomija', 'Matematika', 'Statistika']
        }
      ]
    },
    {
      id: 'ns',
      name: 'Univerzitet u Novom Sadu',
      logo: '/images/logos/ns-uni.png',
      faculties: [
        {
          id: 'ftn',
          name: 'Fakultet tehničkih nauka',
          programs: [
            'Računarstvo i automatika',
            'Elektrotehnika i računarstvo',
            'Industrijsko inženjerstvo',
            'Građevinarstvo'
          ],
          subjects: ['Matematika 1', 'Programiranje', 'Fizika', 'OET']
        },
        {
          id: 'pmf-ns',
          name: 'Prirodno-matematički fakultet',
          programs: [
            'Matematika',
            'Fizika',
            'Hemija',
            'Biologija',
            'Informatika'
          ],
          subjects: ['Analiza', 'Algebra', 'Geometrija', 'Programiranje']
        }
      ]
    },
    {
      id: 'nis',
      name: 'Univerzitet u Nišu',
      logo: '/images/logos/nis-uni.png',
      faculties: [
        {
          id: 'elfak',
          name: 'Elektronski fakultet',
          programs: [
            'Elektronika',
            'Računarstvo',
            'Telekomunikacije'
          ],
          subjects: ['Matematika 1', 'Programiranje', 'Elektronika', 'Signali']
        }
      ]
    }
  ];

  const stats = [
    { number: '15+', label: 'Fakulteta' },
    { number: '50+', label: 'Smerova' },
    { number: '200+', label: 'Predmeta' },
    { number: '1000+', label: 'Udžbenika' }
  ];

  const benefits = [
    {
      title: 'Prilagođen kurikulum',
      description: 'AI razume specifičnosti svakog fakulteta i smera',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      )
    },
    {
      title: 'Originalni materijali',
      description: 'Koristi udžbenike i materijale sa tvog fakulteta',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      )
    },
    {
      title: 'Kontinuitetno ažuriranje',
      description: 'Dodajemo nove fakultete i smerove svake nedelje',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
          <path d="M21 21v-5h-5"/>
        </svg>
      )
    },
    {
      title: 'Lokalni fokus',
      description: 'Razumevamo srpski obrazovni sistem i specifičnosti',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      )
    }
  ];

  return (
    <div className={styles.supportedFacultiesPage}>
      <Navigation />
      
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <div className={styles.heroParticles}></div>
          <div className={styles.heroGrid}></div>
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            🎓 Podržani fakulteti i smerovi
          </div>
          
          <h1 className={styles.heroTitle}>
            Tvoj fakultet je
            <br />već podržan
          </h1>
          
          <p className={styles.heroSubtitle}>
            FAXit podržava najveće fakultete u Srbiji sa njihovim specifičnim kurikulumima,
            udžbenicima i načinima rada
          </p>

          <div className={styles.heroActions}>
            <button className={styles.ctaButton}>
              Pronađi svoj fakultet
            </button>
            <button className={styles.ctaSecondary} onClick={() => {
              const universitiesSection = document.querySelector('.universities-section');
              if (universitiesSection) {
                universitiesSection.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center' 
                });
              }
            }}>
              <span className={styles.playIcon}>👇</span>
              Pogledaj listu
            </button>
          </div>
        </div>

        {/* Stats Preview */}
        <div className={styles.statsPreview}>
          <div className={styles.statsContainer}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Universities Section */}
      <section className="universities-section">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Podržani univerziteti i fakulteti</h2>
          <p className={styles.sectionSubtitle}>
            Izaberi svoj univerzitet da vidiš podržane fakultete i smerove
          </p>
        </div>

        <div className={styles.universitiesGrid}>
          {universities.map((university) => (
            <div
              key={university.id}
              className={`${styles.universityCard} ${selectedUniversity === university.id ? styles.selected : ''}`}
              onClick={() => setSelectedUniversity(selectedUniversity === university.id ? null : university.id)}
            >
              <div className={styles.universityHeader}>
                <div className={styles.universityLogo}>
                  <div className={styles.logoPlaceholder}>
                    🏛️
                  </div>
                </div>
                <div className={styles.universityInfo}>
                  <h3 className={styles.universityName}>{university.name}</h3>
                  <p className={styles.facultyCount}>{university.faculties.length} fakulteta</p>
                </div>
                <div className={styles.expandIcon}>
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    width="20" 
                    height="20"
                    className={selectedUniversity === university.id ? styles.rotated : ''}
                  >
                    <polyline points="6,9 12,15 18,9"/>
                  </svg>
                </div>
              </div>

              {selectedUniversity === university.id && (
                <div className={styles.facultiesGrid}>
                  {university.faculties.map((faculty) => (
                    <div
                      key={faculty.id}
                      className={`${styles.facultyCard} ${selectedFaculty === faculty.id ? styles.selected : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFaculty(selectedFaculty === faculty.id ? null : faculty.id);
                      }}
                    >
                      <div className={styles.facultyHeader}>
                        <h4 className={styles.facultyName}>{faculty.name}</h4>
                        <div className={styles.programCount}>{faculty.programs.length} smerova</div>
                      </div>

                      {selectedFaculty === faculty.id && (
                        <div className={styles.facultyDetails}>
                          <div className={styles.programsSection}>
                            <h5>Podržani smerovi:</h5>
                            <ul className={styles.programsList}>
                              {faculty.programs.map((program, index) => (
                                <li key={index} className={styles.programItem}>
                                  <span className={styles.checkIcon}>✓</span>
                                  {program}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className={styles.subjectsSection}>
                            <h5>Primeri predmeta:</h5>
                            <div className={styles.subjectsList}>
                              {faculty.subjects.map((subject, index) => (
                                <span key={index} className={styles.subjectTag}>
                                  {subject}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Zašto je tvoj fakultet već spreman?</h2>
          <p className={styles.sectionSubtitle}>
            FAXit je dizajniran da radi sa srpskim obrazovnim sistemom
          </p>
        </div>

        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <div key={index} className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                {benefit.icon}
              </div>
              
              <h3 className={styles.benefitTitle}>
                {benefit.title}
              </h3>
              
              <p className={styles.benefitDescription}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBackground}>
          <div className={styles.ctaParticles}></div>
        </div>
        
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Ne vidiš svoj fakultet?
            <br />Kontaktiraj nas!
          </h2>
          
          <p className={styles.ctaSubtitle}>
            Aktivno radimo na dodavanju novih fakulteta. Ako tvoj fakultet nije na listi,
            javiti se - dodaćemo ga u najkraćem roku
          </p>

          <div className={styles.ctaActions}>
            <Link to="/main/kontakt" className={styles.ctaPrimary}>
              Predloži fakultet
            </Link>
            <Link to="/register" className={styles.ctaSecondary}>
              Registruj se sada
            </Link>
          </div>

          <div className={styles.ctaFeatures}>
            <div className={styles.ctaFeature}>
              <span className={styles.ctaFeatureIcon}>⚡</span>
              <span>Brzo dodavanje</span>
            </div>
            <div className={styles.ctaFeature}>
              <span className={styles.ctaFeatureIcon}>📚</span>
              <span>Kompletni materijali</span>
            </div>
            <div className={styles.ctaFeature}>
              <span className={styles.ctaFeatureIcon}>🎯</span>
              <span>Prilagođen pristup</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.mainFooter}>
        <div className={styles.footerContent}>
          <div className={styles.footerGrid}>
            <div>
              <div className={styles.footerBrand}>
                <div className={styles.footerLogo}>
                  <div className={styles.footerLogoIcon}/>
                </div>
                <span className={styles.footerBrandName}>FAXit</span>
              </div>
              <p className={styles.footerDescription}>
                AI asistent koji revolucioniše način kako studenti uče i pristupaju gradivuu na fakultetu.
              </p>
            </div>

            <div className={styles.footerSection}>
              <h4>Stranice</h4>
              <ul className={styles.footerLinks}>
                {[
                  { name: 'Početna', path: '/main' },
                  { name: 'Kako funkcioniše', path: '/main/kako-funkcionise' },
                  { name: 'Demonstracija', path: '/main/demonstracija' },
                  { name: 'Cene', path: '/main/cene' },
                  { name: 'FAQ', path: '/main/faq' }
                ].map((link, index) => (
                  <li key={index}>
                    <Link to={link.path} className={styles.footerLink}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.footerSection}>
              <h4>Podrška</h4>
              <ul className={styles.footerLinks}>
                {[
                  { name: 'Kontakt', path: '/main/kontakt' },
                  { name: 'Uslovi korišćenja', path: '/terms' },
                  { name: 'Privatnost', path: '/privacy' },
                  { name: 'Status sistema', path: '/status' }
                ].map((link, index) => (
                  <li key={index}>
                    <Link to={link.path} className={styles.footerLink}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.footerSection}>
              <h4>Društvene mreže</h4>
              <div className={styles.socialLinks}>
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
                  <a key={index} href="#" className={styles.socialLink}>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p className={styles.footerCopyright}>
              © 2024 FAXit. Sva prava zadržana.
            </p>
            
            <p className={styles.footerCopyright}>
              Napravljeno sa ❤️ za studente Srbije
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SupportedFaculties;