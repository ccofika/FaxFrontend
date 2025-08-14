import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

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
    <div className="profile-section">
      <h2 className="section-title">Profile Information</h2>
      <div className="profile-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={profileData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="profile-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={profileData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="profile-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="university">University</label>
          <input
            type="text"
            id="university"
            value={profileData.university}
            onChange={(e) => handleInputChange('university', e.target.value)}
            className="profile-input"
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <select
              id="year"
              value={profileData.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              className="profile-select"
            >
              <option value="1. godina">1. godina</option>
              <option value="2. godina">2. godina</option>
              <option value="3. godina">3. godina</option>
              <option value="4. godina">4. godina</option>
              <option value="Master">Master</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="semester">Semester</label>
            <select
              id="semester"
              value={profileData.semester}
              onChange={(e) => handleInputChange('semester', e.target.value)}
              className="profile-select"
            >
              <option value="1. semestar">1. semestar</option>
              <option value="2. semestar">2. semestar</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="major">Major</label>
            <input
              type="text"
              id="major"
              value={profileData.major}
              onChange={(e) => handleInputChange('major', e.target.value)}
              className="profile-input"
            />
          </div>
        </div>
        <div className="form-info">
          <span className="join-date">Member since {profileData.joinDate}</span>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="profile-section">
      <h2 className="section-title">Appearance Settings</h2>
      <div className="appearance-form">
        <div className="form-group">
          <label htmlFor="colorMode">Color Mode</label>
          <div className="radio-group">
            {['dark', 'light', 'auto'].map((mode) => (
              <label key={mode} className="radio-option">
                <input
                  type="radio"
                  name="colorMode"
                  value={mode}
                  checked={colorMode === mode}
                  onChange={(e) => setColorMode(e.target.value as any)}
                />
                <span className="radio-label">{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="chatFont">Chat Font</label>
          <div className="radio-group">
            {[
              { value: 'system', label: 'System Font' },
              { value: 'mono', label: 'Monospace' },
              { value: 'serif', label: 'Serif' }
            ].map((font) => (
              <label key={font.value} className="radio-option">
                <input
                  type="radio"
                  name="chatFont"
                  value={font.value}
                  checked={chatFont === font.value}
                  onChange={(e) => setChatFont(e.target.value as any)}
                />
                <span className="radio-label">{font.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSection = () => (
    <div className="profile-section">
      <h2 className="section-title">Account Settings</h2>
      <div className="account-form">
        <div className="account-info">
          <div className="info-card">
            <h3>Account Status</h3>
            <span className="status active">Active</span>
          </div>
          <div className="info-card">
            <h3>Total Conversations</h3>
            <span className="stat">247</span>
          </div>
          <div className="info-card">
            <h3>Prompts Used This Month</h3>
            <span className="stat">8 / 10</span>
          </div>
        </div>
        <div className="account-actions">
          <button className="profile-button secondary">Change Password</button>
          <button className="profile-button secondary">Export Data</button>
          <button className="profile-button danger">Logout</button>
        </div>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="profile-section">
      <h2 className="section-title">Privacy Settings</h2>
      <div className="privacy-form">
        <div className="privacy-option">
          <div className="option-info">
            <h3>Data Collection</h3>
            <p>Allow collection of usage data to improve service</p>
          </div>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="privacy-option">
          <div className="option-info">
            <h3>Chat History</h3>
            <p>Save conversation history for future reference</p>
          </div>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="privacy-option">
          <div className="option-info">
            <h3>Analytics</h3>
            <p>Share anonymous usage analytics</p>
          </div>
          <label className="toggle">
            <input type="checkbox" />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="privacy-option">
          <div className="option-info">
            <h3>Marketing Emails</h3>
            <p>Receive updates about new features and improvements</p>
          </div>
          <label className="toggle">
            <input type="checkbox" />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderBillingSection = () => (
    <div className="profile-section">
      <h2 className="section-title">Billing & Plans</h2>
      <div className="billing-form">
        <div className="current-plan">
          <h3>Current Plan: {billingPlans.find(p => p.id === currentPlan)?.name}</h3>
        </div>
        <div className="plans-grid">
          {billingPlans.map((plan) => (
            <div key={plan.id} className={`plan-card ${currentPlan === plan.id ? 'current' : ''}`}>
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">{plan.price}</div>
                <div className="plan-prompts">{plan.prompts}</div>
              </div>
              <div className="plan-features">
                {plan.features.map((feature, index) => (
                  <div key={index} className="feature">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
              <button 
                className={`plan-button ${currentPlan === plan.id ? 'current' : 'upgrade'}`}
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
    <div className="profile-page">
      <div className="profile-sidebar">
        <div className="profile-header">
          <button className="back-button" onClick={() => navigate('/')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5m7-7l-7 7 7 7"/>
            </svg>
            Back
          </button>
          <h1>Settings</h1>
        </div>
        <nav className="profile-nav">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id as any)}
            >
              <span className="nav-icon">{section.icon}</span>
              <span className="nav-label">{section.name}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="profile-content">
        {renderSection()}
        <div className="profile-actions">
          <button className="profile-button primary">Save Changes</button>
          <button className="profile-button secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;