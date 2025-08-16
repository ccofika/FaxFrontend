import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { useAuth } from '../../context/AuthContext';
import './MainHome.css';
import styles from './Register.module.css';

// Step 1: Personal Information
interface PersonalInfoData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dateOfBirth: string;
}

// Step 2: Academic Information
interface AcademicData {
  faculty: string;
  year: string;
  major: string;
}

// Step 3: Plan Selection
interface PlanData {
  selectedPlan: string;
}

// Step 4: Weak Points
interface WeakPointsData {
  weakPoints: string[];
}

interface RegistrationData {
  personal: PersonalInfoData;
  academic: AcademicData;
  plan: PlanData;
  weakPoints: WeakPointsData;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      dateOfBirth: ''
    },
    academic: {
      faculty: '',
      year: '',
      major: ''
    },
    plan: {
      selectedPlan: ''
    },
    weakPoints: {
      weakPoints: []
    }
  });

  const totalSteps = 4;

  const faculties = [
    'Elektrotehnički fakultet',
    'Fakultet organizacionih nauka',
    'Mašinski fakultet',
    'Građevinski fakultet',
    'Saobraćajni fakultet',
    'Arhitektonski fakultet',
    'Matematički fakultet',
    'Fakultet za fizičku hemiju',
    'Ekonomski fakultet',
    'Pravni fakultet',
    'Medicinski fakultet',
    'Stomatološki fakultet',
    'Farmaceutski fakultet',
    'Veterinarski fakultet',
    'Poljoprivredni fakultet',
    'Šumarski fakultet',
    'Geografski fakultet',
    'Biološki fakultet',
    'Hemijski fakultet',
    'Fizički fakultet'
  ];

  const academicYears = [
    '1. godina',
    '2. godina', 
    '3. godina',
    '4. godina',
    '5. godina',
    '6. godina'
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '1,990 RSD',
      period: 'mesečno',
      features: [
        'Osnovno AI pomoć',
        'Pretraživanje materijala',
        'Email podrška',
        'Pristup osnovnim funkcijama'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '3,990 RSD',
      period: 'mesečno',
      features: [
        'Napredna AI analiza',
        'Personalizovani sadržaj',
        'Prioritetna podrška',
        'Pristup svim funkcijama',
        'Offline pristup'
      ],
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro Plan', 
      price: '6,990 RSD',
      period: 'mesečno',
      features: [
        'Sve Premium funkcije',
        'AI tutor 24/7',
        'Grupni rad i saradnja',
        'Analitika napretka',
        'Individualne konsultacije'
      ]
    }
  ];

  const weakPointsOptions = [
    'Matematika',
    'Fizika', 
    'Hemija',
    'Programiranje',
    'Ekonomija',
    'Statistika',
    'Elektronika',
    'Mehanika',
    'Termodinamika',
    'Baze podataka',
    'Algoritmi',
    'Mrežne tehnologije',
    'Upravljanje projektima',
    'Finansije',
    'Marketing',
    'Psihologija',
    'Filozofija',
    'Istorija',
    'Jezik (engleski)',
    'Prezentacijske veštine'
  ];

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (registrationData.personal.firstName && registrationData.personal.lastName) {
      const generatedUsername = `${registrationData.personal.firstName.toLowerCase()}.${registrationData.personal.lastName.toLowerCase()}`;
      setUsername(generatedUsername);
    }
  }, [registrationData.personal.firstName, registrationData.personal.lastName]);

  const updatePersonalData = (field: keyof PersonalInfoData, value: string) => {
    setRegistrationData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
    if (error) setError('');
  };

  const updateAcademicData = (field: keyof AcademicData, value: string) => {
    setRegistrationData(prev => ({
      ...prev,
      academic: {
        ...prev.academic,
        [field]: value
      }
    }));
  };

  const updatePlanData = (planId: string) => {
    setRegistrationData(prev => ({
      ...prev,
      plan: {
        selectedPlan: planId
      }
    }));
  };

  const toggleWeakPoint = (point: string) => {
    setRegistrationData(prev => ({
      ...prev,
      weakPoints: {
        weakPoints: prev.weakPoints.weakPoints.includes(point)
          ? prev.weakPoints.weakPoints.filter(p => p !== point)
          : [...prev.weakPoints.weakPoints, point]
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      await register({
        username,
        email: registrationData.personal.email,
        password: registrationData.personal.password,
        firstName: registrationData.personal.firstName,
        lastName: registrationData.personal.lastName,
        dateOfBirth: registrationData.personal.dateOfBirth || undefined,
        phone: registrationData.personal.phone || undefined,
        faculty: registrationData.academic.faculty || undefined,
        academicYear: registrationData.academic.year || undefined,
        major: registrationData.academic.major || undefined,
        selectedPlan: registrationData.plan.selectedPlan || undefined,
        weakPoints: registrationData.weakPoints.weakPoints.length > 0 ? registrationData.weakPoints.weakPoints : undefined
      });
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          registrationData.personal.firstName &&
          registrationData.personal.lastName &&
          username &&
          registrationData.personal.email &&
          registrationData.personal.password &&
          registrationData.personal.confirmPassword &&
          registrationData.personal.password === registrationData.personal.confirmPassword
        );
      case 2:
        return !!(
          registrationData.academic.faculty &&
          registrationData.academic.year &&
          registrationData.academic.major
        );
      case 3:
        return !!registrationData.plan.selectedPlan;
      case 4:
        return registrationData.weakPoints.weakPoints.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="main-home">
      <Navigation />
      
      {/* Registration Form Section */}
      <section className={styles.registerSection}>
        <div className={styles.registerContainer}>
          {/* Progress Indicator */}
          <div className={styles.progressIndicator}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
            <div className={styles.stepNumbers}>
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i + 1}
                  className={`${styles.stepNumber} ${
                    i + 1 <= currentStep ? styles.active : ''
                  } ${i + 1 === currentStep ? styles.current : ''}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className={styles.stepLabels}>
              <span className={currentStep === 1 ? styles.activeLabel : ''}>Podaci</span>
              <span className={currentStep === 2 ? styles.activeLabel : ''}>Fakultet</span>
              <span className={currentStep === 3 ? styles.activeLabel : ''}>Plan</span>
              <span className={currentStep === 4 ? styles.activeLabel : ''}>Veštine</span>
            </div>
          </div>

          <div className={styles.formWrapper}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <h2 className={styles.stepTitle}>Osnovni podaci</h2>
                  <p className={styles.stepSubtitle}>
                    Unesite vaše lične podatke za kreiranje naloga
                  </p>
                </div>

                {error && (
                  <div className={styles.errorMessage}>
                    {error}
                  </div>
                )}

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Ime *</label>
                    <input
                      type="text"
                      value={registrationData.personal.firstName}
                      onChange={(e) => updatePersonalData('firstName', e.target.value)}
                      className={styles.formInput}
                      placeholder="Unesite vaše ime"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Prezime *</label>
                    <input
                      type="text"
                      value={registrationData.personal.lastName}
                      onChange={(e) => updatePersonalData('lastName', e.target.value)}
                      className={styles.formInput}
                      placeholder="Unesite vaše prezime"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Korisničko ime *</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={styles.formInput}
                      placeholder="Korisničko ime"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email adresa *</label>
                    <input
                      type="email"
                      value={registrationData.personal.email}
                      onChange={(e) => updatePersonalData('email', e.target.value)}
                      className={styles.formInput}
                      placeholder="ime.prezime@email.com"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Broj telefona</label>
                    <input
                      type="tel"
                      value={registrationData.personal.phone}
                      onChange={(e) => updatePersonalData('phone', e.target.value)}
                      className={styles.formInput}
                      placeholder="+381 60 123 4567"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Šifra *</label>
                    <input
                      type="password"
                      value={registrationData.personal.password}
                      onChange={(e) => updatePersonalData('password', e.target.value)}
                      className={styles.formInput}
                      placeholder="Minimalno 8 karaktera"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Potvrdite šifru *</label>
                    <input
                      type="password"
                      value={registrationData.personal.confirmPassword}
                      onChange={(e) => updatePersonalData('confirmPassword', e.target.value)}
                      className={styles.formInput}
                      placeholder="Ponovite šifru"
                      required
                    />
                    {registrationData.personal.password && 
                     registrationData.personal.confirmPassword && 
                     registrationData.personal.password !== registrationData.personal.confirmPassword && (
                      <span className={styles.errorText}>Šifre se ne poklapaju</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Academic Information */}
            {currentStep === 2 && (
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <h2 className={styles.stepTitle}>Akademski podaci</h2>
                  <p className={styles.stepSubtitle}>
                    Izaberite vaš fakultet, godinu studija i smer
                  </p>
                </div>

                <div className={styles.formColumn}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Fakultet *</label>
                    <select
                      value={registrationData.academic.faculty}
                      onChange={(e) => updateAcademicData('faculty', e.target.value)}
                      className={styles.formSelect}
                      required
                    >
                      <option value="">Izaberite fakultet...</option>
                      {faculties.map((faculty, index) => (
                        <option key={index} value={faculty}>{faculty}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Godina studija *</label>
                    <select
                      value={registrationData.academic.year}
                      onChange={(e) => updateAcademicData('year', e.target.value)}
                      className={styles.formSelect}
                      required
                    >
                      <option value="">Izaberite godinu...</option>
                      {academicYears.map((year, index) => (
                        <option key={index} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Smer/Modul *</label>
                    <input
                      type="text"
                      value={registrationData.academic.major}
                      onChange={(e) => updateAcademicData('major', e.target.value)}
                      className={styles.formInput}
                      placeholder="Unesite vaš smer ili modul"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Plan Selection */}
            {currentStep === 3 && (
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <h2 className={styles.stepTitle}>Izaberite plan</h2>
                  <p className={styles.stepSubtitle}>
                    Odaberite plan koji najbolje odgovara vašim potrebama
                  </p>
                </div>

                <div className={styles.plansGrid}>
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`${styles.planCard} ${
                        registrationData.plan.selectedPlan === plan.id ? styles.selected : ''
                      } ${plan.popular ? styles.popular : ''}`}
                      onClick={() => updatePlanData(plan.id)}
                    >
                      {plan.popular && (
                        <div className={styles.popularBadge}>Najpopularniji</div>
                      )}
                      <h3 className={styles.planName}>{plan.name}</h3>
                      <div className={styles.planPrice}>
                        <span className={styles.price}>{plan.price}</span>
                        <span className={styles.period}>/{plan.period}</span>
                      </div>
                      <ul className={styles.planFeatures}>
                        {plan.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Weak Points */}
            {currentStep === 4 && (
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <h2 className={styles.stepTitle}>Slabe tačke</h2>
                  <p className={styles.stepSubtitle}>
                    Izaberite oblasti u kojima trebate dodatnu pomoć (možete izabrati više)
                  </p>
                </div>

                <div className={styles.weakPointsGrid}>
                  {weakPointsOptions.map((point, index) => (
                    <div
                      key={index}
                      className={`${styles.weakPointCard} ${
                        registrationData.weakPoints.weakPoints.includes(point) ? styles.selected : ''
                      }`}
                      onClick={() => toggleWeakPoint(point)}
                    >
                      <div className={styles.weakPointCheck}>
                        {registrationData.weakPoints.weakPoints.includes(point) && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        )}
                      </div>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={styles.navigationButtons}>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className={styles.prevButton}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  Nazad
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className={styles.nextButton}
                >
                  Sledeće
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStepValid(currentStep) || isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? (
                    <>
                      <svg className={styles.loadingSpinner} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56"/>
                      </svg>
                      Registracija u toku...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22,4 12,14.01 9,11.01"/>
                      </svg>
                      Registrujte se
                    </>
                  )}
                </button>
              )}
            </div>

            <div className={styles.loginPrompt}>
              <span>Već imate nalog? </span>
              <button
                onClick={() => navigate('/main/login')}
                className={styles.loginLink}
              >
                Prijavite se
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;