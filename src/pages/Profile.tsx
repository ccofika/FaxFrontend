import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

interface ProfileData {
  name: string;
  email: string;
  university: string;
  year: string;
  semester: string;
  major: string;
  joinDate: string;
}

interface BillingPlan {
  id: 'free' | 'pro' | 'max';
  name: string;
  price: string;
  prompts: string;
  features: string[];
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'profile' | 'appearance' | 'account' | 'privacy' | 'billing'>('profile');
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Raf Petrović',
    email: 'raf@example.com',
    university: 'Fakultet organizacionih nauka',
    year: '3. godina',
    semester: '1. semestar',
    major: 'Informacioni sistemi',
    joinDate: 'Januar 2024'
  });

  const [colorMode, setColorMode] = useState<'dark' | 'light' | 'auto'>('dark');
  const [chatFont, setChatFont] = useState<'system' | 'mono' | 'serif'>('system');
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'max'>('free');

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
      ]
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

  const sections = [
    { 
      id: 'profile', 
      name: 'Profile', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    },
    { 
      id: 'appearance', 
      name: 'Appearance', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/></svg>
    },
    { 
      id: 'account', 
      name: 'Account', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    },
    { 
      id: 'privacy', 
      name: 'Privacy', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><circle cx="12" cy="16" r="1"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    },
    { 
      id: 'billing', 
      name: 'Billing', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
    }
  ];

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const renderProfileSection = () => (
    <div className={styles.profileSection}>
      <h2 className={styles.sectionTitle}>Profile Information</h2>
      <div className={styles.profileForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.formLabel}>Full Name</label>
          <input
            type="text"
            id="name"
            value={profileData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={styles.profileInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>Email</label>
          <input
            type="email"
            id="email"
            value={profileData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={styles.profileInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="university" className={styles.formLabel}>University</label>
          <input
            type="text"
            id="university"
            value={profileData.university}
            onChange={(e) => handleInputChange('university', e.target.value)}
            className={styles.profileInput}
          />
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="year" className={styles.formLabel}>Year</label>
            <select
              id="year"
              value={profileData.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              className={styles.profileSelect}
            >
              <option value="1. godina">1. godina</option>
              <option value="2. godina">2. godina</option>
              <option value="3. godina">3. godina</option>
              <option value="4. godina">4. godina</option>
              <option value="Master">Master</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="semester" className={styles.formLabel}>Semester</label>
            <select
              id="semester"
              value={profileData.semester}
              onChange={(e) => handleInputChange('semester', e.target.value)}
              className={styles.profileSelect}
            >
              <option value="1. semestar">1. semestar</option>
              <option value="2. semestar">2. semestar</option>
            </select>
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="major" className={styles.formLabel}>Major</label>
            <input
              type="text"
              id="major"
              value={profileData.major}
              onChange={(e) => handleInputChange('major', e.target.value)}
              className={styles.profileInput}
            />
          </div>
        </div>
        <div className={styles.formInfo}>
          <span className={styles.joinDate}>Member since {profileData.joinDate}</span>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className={styles.profileSection}>
      <h2 className={styles.sectionTitle}>Appearance Settings</h2>
      <div className={styles.appearanceForm}>
        <div className={styles.formGroup}>
          <label htmlFor="colorMode" className={styles.formLabel}>Color Mode</label>
          <div className={styles.radioGroup}>
            {['dark', 'light', 'auto'].map((mode) => (
              <label key={mode} className={styles.radioOption}>
                <input
                  type="radio"
                  name="colorMode"
                  value={mode}
                  checked={colorMode === mode}
                  onChange={(e) => setColorMode(e.target.value as any)}
                />
                <span className={styles.radioLabel}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="chatFont" className={styles.formLabel}>Chat Font</label>
          <div className={styles.radioGroup}>
            {[
              { value: 'system', label: 'System Font' },
              { value: 'mono', label: 'Monospace' },
              { value: 'serif', label: 'Serif' }
            ].map((font) => (
              <label key={font.value} className={styles.radioOption}>
                <input
                  type="radio"
                  name="chatFont"
                  value={font.value}
                  checked={chatFont === font.value}
                  onChange={(e) => setChatFont(e.target.value as any)}
                />
                <span className={styles.radioLabel}>{font.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSection = () => (
    <div className={styles.profileSection}>
      <h2 className={styles.sectionTitle}>Account Settings</h2>
      <div className={styles.accountForm}>
        <div className={styles.accountInfo}>
          <div className={styles.infoCard}>
            <h3>Account Status</h3>
            <span className={`${styles.status} ${styles.active}`}>Active</span>
          </div>
          <div className={styles.infoCard}>
            <h3>Total Conversations</h3>
            <span className={styles.stat}>247</span>
          </div>
          <div className={styles.infoCard}>
            <h3>Prompts Used This Month</h3>
            <span className={styles.stat}>8 / 10</span>
          </div>
        </div>
        <div className={styles.accountActions}>
          <button className={`${styles.profileButton} ${styles.secondary}`}>Change Password</button>
          <button className={`${styles.profileButton} ${styles.secondary}`}>Export Data</button>
          <button className={`${styles.profileButton} ${styles.danger}`}>Logout</button>
        </div>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className={styles.profileSection}>
      <h2 className={styles.sectionTitle}>Privacy Settings</h2>
      <div className={styles.privacyForm}>
        <div className={styles.privacyOption}>
          <div className={styles.optionInfo}>
            <h3>Data Collection</h3>
            <p>Allow collection of usage data to improve service</p>
          </div>
          <label className={styles.toggle}>
            <input type="checkbox" defaultChecked />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
        <div className={styles.privacyOption}>
          <div className={styles.optionInfo}>
            <h3>Chat History</h3>
            <p>Save conversation history for future reference</p>
          </div>
          <label className={styles.toggle}>
            <input type="checkbox" defaultChecked />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
        <div className={styles.privacyOption}>
          <div className={styles.optionInfo}>
            <h3>Analytics</h3>
            <p>Share anonymous usage analytics</p>
          </div>
          <label className={styles.toggle}>
            <input type="checkbox" />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
        <div className={styles.privacyOption}>
          <div className={styles.optionInfo}>
            <h3>Marketing Emails</h3>
            <p>Receive updates about new features and improvements</p>
          </div>
          <label className={styles.toggle}>
            <input type="checkbox" />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderBillingSection = () => (
    <div className={styles.profileSection}>
      <h2 className={styles.sectionTitle}>Billing & Plans</h2>
      <div className={styles.billingForm}>
        <div className={styles.currentPlan}>
          <h3>Current Plan: {billingPlans.find(p => p.id === currentPlan)?.name}</h3>
        </div>
        <div className={styles.plansGrid}>
          {billingPlans.map((plan) => (
            <div key={plan.id} className={`${styles.planCard} ${currentPlan === plan.id ? styles.current : ''}`}>
              <div className={styles.planHeader}>
                <h3>{plan.name}</h3>
                <div className={styles.planPrice}>{plan.price}</div>
                <div className={styles.planPrompts}>{plan.prompts}</div>
              </div>
              <div className={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <div key={index} className={styles.feature}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
              <button 
                className={`${styles.planButton} ${currentPlan === plan.id ? styles.current : styles.upgrade}`}
                onClick={() => currentPlan !== plan.id && setCurrentPlan(plan.id)}
              >
                {currentPlan === plan.id ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return renderProfileSection();
      case 'appearance': return renderAppearanceSection();
      case 'account': return renderAccountSection();
      case 'privacy': return renderPrivacySection();
      case 'billing': return renderBillingSection();
      default: return renderProfileSection();
    }
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContainer}>
        <div className={styles.profileSidebar}>
          <div className={styles.profileHeader}>
            <button className={styles.backButton} onClick={() => navigate('/')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5m7-7l-7 7 7 7"/>
              </svg>
              Back
            </button>
            <h1 className={styles.settingsTitle}>Settings</h1>
          </div>
          <nav className={styles.profileNav}>
            {sections.map((section) => (
              <button
                key={section.id}
                className={`${styles.navItem} ${activeSection === section.id ? styles.active : ''}`}
                onClick={() => setActiveSection(section.id as any)}
              >
                <span className={styles.navIcon}>{section.icon}</span>
                <span className={styles.navLabel}>{section.name}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className={styles.profileContent}>
          <div className={styles.contentHeader}>
            <h1 className={styles.pageTitle}>{sections.find(s => s.id === activeSection)?.name}</h1>
            <p className={styles.pageSubtitle}>Manage your account settings and preferences</p>
          </div>
          <div className={styles.contentBody}>
            {renderSection()}
          </div>
          <div className={styles.profileActions}>
            <button className={`${styles.profileButton} ${styles.primary}`}>Save Changes</button>
            <button className={`${styles.profileButton} ${styles.secondary}`}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;