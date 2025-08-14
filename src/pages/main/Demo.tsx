import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import styles from './Demo.module.css';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  mode?: string;
  timestamp: Date;
}

const Demo: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<string>('explain');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const modes = [
    {
      id: 'explain',
      name: 'Explain',
      description: 'Get detailed explanations',
      icon: '💡'
    },
    {
      id: 'solve',
      name: 'Solve',
      description: 'Find solutions to problems',
      icon: '⚡'
    },
    {
      id: 'summary',
      name: 'Summary',
      description: 'Get concise summaries',
      icon: '📝'
    },
    {
      id: 'tests',
      name: 'Tests',
      description: 'Generate tests and quizzes',
      icon: '📊'
    },
    {
      id: 'learning',
      name: 'Learning',
      description: 'Interactive learning assistance',
      icon: '🎓'
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

      if (question.toLowerCase().includes('limit')) {
        return {
          text: `## Rešavanje limita: lim(x→0) sin(x)/x

**Tip:** Neodređeni oblik 0/0

### Metod 1: L'Hôpital pravilo
lim(x→0) sin(x)/x = lim(x→0) cos(x)/1 = cos(0) = **1**

### Metod 2: Taylor red
sin(x) = x - x³/6 + x⁵/120 - ...

lim(x→0) sin(x)/x = lim(x→0) (x - x³/6 + x⁵/120 - ...)/x
                  = lim(x→0) (1 - x²/6 + x⁴/120 - ...)
                  = **1**

### Metod 3: Squeeze Theorem
Za male x: |sin(x)| ≤ |x|
Ali treba geometrijska analiza...

### **Finalni rezultat: 1**

*Ovo je jedan od najvažnijih limita u matematici!*`,
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
      if (question.toLowerCase().includes('derivacij')) {
        return {
          text: `## Sažetak: Derivacije

### 🎯 **Osnove:**
- **Definicija:** f'(x) = lim(h→0) [f(x+h) - f(x)]/h
- **Geometrijska interpretacija:** Nagib tangente na krivu

### 📐 **Osnovne formule:**
- (c)' = 0 (konstanta)
- (x^n)' = nx^(n-1) (stepena funkcija)
- (sin x)' = cos x
- (cos x)' = -sin x
- (e^x)' = e^x
- (ln x)' = 1/x

### ⚙️ **Pravila derivisanja:**
- **Sumiranje:** (f + g)' = f' + g'
- **Proizvod:** (fg)' = f'g + fg'
- **Količnik:** (f/g)' = (f'g - fg')/g²
- **Složena funkcija:** (f(g(x)))' = f'(g(x)) · g'(x)

### 🔧 **Primena:**
- Pronalaženje ekstrema funkcije
- Analiza rasta/opadanja
- Geometrijske primene (tangente, normale)`,
          mode: 'summary'
        };
      }

      return {
        text: `## Kratak sažetak (Demo verzija)

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
      if (question.toLowerCase().includes('analiz') || question.toLowerCase().includes('test')) {
        return {
          text: `## Test: Matematička analiza (Demo)

### 📝 **Pitanja (5/10):**

**1. Izračunaj: lim(x→0) sin(x)/x**
a) 0  b) 1  c) ∞  d) Ne postoji

**2. Derivacija od x³ je:**
a) x²  b) 3x²  c) 3x³  d) x³/3

**3. ∫ 2x dx = ?**
a) 2x²  b) x²  c) x² + C  d) 2x² + C

**4. Koja je derivacija od sin(x)?**
a) cos(x)  b) -cos(x)  c) -sin(x)  d) tan(x)

**5. Newton-Leibniz formula se koristi za:**
a) Limite  b) Derivacije  c) Određene integrale  d) Redove

### 📊 **Odgovori:**
1-b, 2-b, 3-c, 4-a, 5-c

**Napomena:** Ovo je skraćena demo verzija. Puni testovi imaju 20+ pitanja sa detaljnim objašnjenjima.`,
          mode: 'tests'
        };
      }

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
      if (question.toLowerCase().includes('analiz') || question.toLowerCase().includes('ispit')) {
        return {
          text: `## Interaktivni plan učenja: Matematička analiza

### 📚 **Strukturiran pristup:**

**Korak 1: Osnove (Nedelja 1)**
✅ Limiti funkcija
✅ Kontinuitet
🔄 L'Hôpital pravilo

**Korak 2: Derivacije (Nedelja 2)**
📖 Osnovne formule
📖 Pravila derivisanja
📖 Primene derivacija

**Korak 3: Integrali (Nedelja 3-4)**
📝 Neodređeni integrali
📝 Metode integracije
📝 Određeni integrali

### 🎯 **Današnji zadaci:**
1. ✍️ Reši 5 zadataka o limitima
2. 📖 Prouči teoriju o derivacijama
3. 🧠 Testiraj znanje sa kvizom

### 📈 **Napredak: 65%**
- Limiti: ✅ Završeno
- Derivacije: 🔄 U toku
- Integrali: ⏳ Predstoji

### 💡 **Saveti za danas:**
- Fokus na praktične zadatke
- Koristi formula sheet
- Pravi kratke pauze`,
          mode: 'learning'
        };
      }

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
    // Auto-send the sample question after a brief delay
    setTimeout(() => {
      if (!isLoading) {
        const event = { target: { value: question } } as any;
        setInputText(question);
        // Trigger send after input is set
        setTimeout(() => {
          handleSendMessage();
        }, 100);
      }
    }, 50);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleModeChange = (newMode: string) => {
    setSelectedMode(newMode);
    // Clear loading state when switching modes
    setIsLoading(false);
  };

  return (
    <div className={styles.demoPage}>
      <Navigation />
      
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <div className={styles.heroParticles}></div>
          <div className={styles.heroGrid}></div>
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            🧪 Besplatna demonstracija
          </div>
          
          <h1 className={styles.heroTitle}>
            Probaj FAXit AI
            <br />bez registracije
          </h1>
          
          <p className={styles.heroSubtitle}>
            Testuj sve funkcionalnosti AI asistenta sa demo materijalom. 
            Bez ikakvih ograničenja - osim što koristiš izmišljene sadržaje.
          </p>
        </div>
      </section>

      {/* Demo Chat Interface */}
      <section className={styles.demoSection}>
        <div className={styles.demoContainer}>
          
          {/* Demo Warning */}
          <div className={styles.demoWarning}>
            <div className={styles.warningIcon}>⚠️</div>
            <div className={styles.warningText}>
              <strong>Ovo je demo sa izmišljenim materijalom</strong>
              <p>Za pristup pravim knjigama i materijalima sa vašeg fakulteta, registrujte se.</p>
            </div>
          </div>

          <div className={styles.chatInterface}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
              {/* Mode Selection */}
              <div className={styles.modeSelection}>
                <h3>Izaberi režim</h3>
                <div className={styles.modesList}>
                  {modes.map(mode => (
                    <button
                      key={mode.id}
                      className={`${styles.modeButton} ${selectedMode === mode.id ? styles.active : ''}`}
                      onClick={() => handleModeChange(mode.id)}
                      disabled={isLoading}
                    >
                      <span className={styles.modeIcon}>{mode.icon}</span>
                      <div className={styles.modeInfo}>
                        <div className={styles.modeName}>{mode.name}</div>
                        <div className={styles.modeDesc}>{mode.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Test Library */}
              <div className={styles.testLibrary}>
                <h3>Test biblioteka</h3>
                <div className={styles.booksList}>
                  {testBooks.map(book => (
                    <div key={book.id} className={styles.bookItem}>
                      <div className={styles.bookIcon}>📚</div>
                      <div className={styles.bookInfo}>
                        <div className={styles.bookTitle}>{book.title}</div>
                        <div className={styles.bookAuthor}>{book.author}</div>
                        <div className={styles.bookMeta}>{book.pages} stranica</div>
                      </div>
                      <div className={styles.bookStatus}>✅</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Questions */}
              <div className={styles.sampleQuestions}>
                <h3>Primeri pitanja</h3>
                <div className={styles.questionsList}>
                  {sampleQuestions[selectedMode as keyof typeof sampleQuestions]?.map((question, index) => (
                    <button
                      key={index}
                      className={styles.sampleQuestion}
                      onClick={() => handleSampleQuestion(question)}
                      disabled={isLoading}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className={styles.chatArea}>
              <div className={styles.chatHeader}>
                <div className={styles.currentMode}>
                  <span className={styles.currentModeIcon}>
                    {modes.find(m => m.id === selectedMode)?.icon}
                  </span>
                  <span className={styles.currentModeName}>
                    {modes.find(m => m.id === selectedMode)?.name} režim
                  </span>
                </div>
                <div className={styles.demoIndicator}>DEMO</div>
              </div>

              <div className={styles.messagesContainer}>
                {messages.length === 0 && (
                  <div className={styles.welcomeMessage}>
                    <div className={styles.welcomeIcon}>👋</div>
                    <h3>Dobrodošli u FAXit demo!</h3>
                    <p>Postavite pitanje ili odaberite jedan od predloženih primera sa leve strane.</p>
                  </div>
                )}

                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`${styles.message} ${message.isUser ? styles.userMessage : styles.aiMessage}`}
                  >
                    {!message.isUser && (
                      <div className={styles.messageHeader}>
                        <span className={styles.aiIcon}>🤖</span>
                        <span className={styles.aiLabel}>FAXit AI</span>
                        {message.mode && (
                          <span className={styles.modeTag}>{message.mode}</span>
                        )}
                      </div>
                    )}
                    <div className={styles.messageContent}>
                      {message.text.split('\n').map((line, i) => {
                        if (line.startsWith('##')) {
                          return <h3 key={i} className={styles.messageHeading}>{line.replace('## ', '')}</h3>;
                        }
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <div key={i} className={styles.messageBold}>{line.replace(/\*\*/g, '')}</div>;
                        }
                        if (line.startsWith('- ')) {
                          return <div key={i} className={styles.messageListItem}>{line.replace('- ', '')}</div>;
                        }
                        if (line.startsWith('### ')) {
                          return <h4 key={i} className={styles.messageSubheading}>{line.replace('### ', '')}</h4>;
                        }
                        if (line.includes('→') || line.includes('=') || line.includes('∫') || line.includes('lim')) {
                          return <div key={i} className={styles.mathExpression}>{line}</div>;
                        }
                        return line ? <p key={i}>{line}</p> : <br key={i} />;
                      })}
                    </div>
                    <div className={styles.messageTime}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className={styles.loadingMessage}>
                    <div className={styles.loadingIcon}>
                      <div className={styles.spinner}></div>
                    </div>
                    <div className={styles.loadingText}>AI razmišlja...</div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              <div className={styles.inputArea}>
                <div className={styles.inputContainer}>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Postavite pitanje u ${modes.find(m => m.id === selectedMode)?.name} režimu...`}
                    className={styles.messageInput}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    className={styles.sendButton}
                    disabled={!inputText.trim() || isLoading}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBackground}>
          <div className={styles.ctaParticles}></div>
        </div>
        
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Spreman za pravu
            <br />FAXit AI?
          </h2>
          
          <p className={styles.ctaSubtitle}>
            Kreiraj nalog i koristi svoje knjige, materijale sa fakulteta 
            i pristupaj svim AI funkcijama bez ograničenja
          </p>

          <div className={styles.ctaActions}>
            <Link to="/register" className={styles.ctaPrimary}>
              Kreiraj nalog besplatno
            </Link>
            <Link to="/main/kako-funkcionise" className={styles.ctaSecondary}>
              Saznaj više o funkcijama
            </Link>
          </div>

          <div className={styles.ctaFeatures}>
            <div className={styles.ctaFeature}>
              <span className={styles.ctaFeatureIcon}>📚</span>
              <span>Tvoje knjige i materijali</span>
            </div>
            <div className={styles.ctaFeature}>
              <span className={styles.ctaFeatureIcon}>🎓</span>
              <span>Prilagođeno tvom fakultetu</span>
            </div>
            <div className={styles.ctaFeature}>
              <span className={styles.ctaFeatureIcon}>⚡</span>
              <span>Neograničeno korišćenje</span>
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
                  { name: 'Podržani fakulteti', path: '/main/podrzani-fakulteti' },
                  { name: 'Demonstracija', path: '/main/demo' }
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
                  { name: 'FAQ', path: '/main/faq' },
                  { name: 'Uslovi korišćenja', path: '/terms' },
                  { name: 'Privatnost', path: '/privacy' }
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

export default Demo;