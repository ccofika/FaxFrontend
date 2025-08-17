import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { TooltipProvider } from '../components/ui/tooltip';
import {
  User,
  Settings,
  Shield,
  CreditCard,
  Palette,
  ArrowLeft,
  Check,
  Save,
  X,
  Eye,
  EyeOff,
  Download,
  LogOut,
  Bell,
  Lock,
  Mail,
  Calendar,
  GraduationCap,
  Zap,
  Menu
} from 'lucide-react';

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
  const { user, fetchProfile, updateProfile, changePassword, exportData, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'profile' | 'appearance' | 'account' | 'privacy' | 'billing'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    university: '',
    year: '',
    semester: '',
    major: '',
    joinDate: ''
  });

  // Settings state
  const [colorMode, setColorMode] = useState<'dark' | 'light' | 'auto'>('dark');
  const [chatFont, setChatFont] = useState<'system' | 'mono' | 'serif'>('system');
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'max'>('free');
  
  // Privacy settings state
  const [dataCollection, setDataCollection] = useState(true);
  const [chatHistory, setChatHistory] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
      icon: <User className="w-5 h-5" />
    },
    { 
      id: 'appearance', 
      name: 'Appearance', 
      icon: <Palette className="w-5 h-5" />
    },
    { 
      id: 'account', 
      name: 'Account', 
      icon: <Settings className="w-5 h-5" />
    },
    { 
      id: 'privacy', 
      name: 'Privacy', 
      icon: <Shield className="w-5 h-5" />
    },
    { 
      id: 'billing', 
      name: 'Billing', 
      icon: <CreditCard className="w-5 h-5" />
    }
  ];

  // Load user data when component mounts
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        await fetchProfile();
      } catch (error) {
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        university: user.faculty || '',
        year: user.academicYear || '',
        semester: user.semester || '',
        major: user.major || '',
        joinDate: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      });
      
      setColorMode(user.colorMode || 'dark');
      setChatFont(user.chatFont || 'system');
      setCurrentPlan((user.selectedPlan as 'free' | 'pro' | 'max') || 'free');
      setDataCollection(user.dataCollection ?? true);
      setChatHistory(user.chatHistory ?? true);
      setAnalytics(user.analytics ?? false);
      setMarketingEmails(user.marketingEmails ?? false);
    }
  }, [user]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const updates: any = {};
      
      // Only include changed fields
      if (profileData.email !== user.email) {
        updates.email = profileData.email;
      }
      
      if (colorMode !== user.colorMode) {
        updates.colorMode = colorMode;
      }
      
      if (chatFont !== user.chatFont) {
        updates.chatFont = chatFont;
      }
      
      if (currentPlan !== user.selectedPlan) {
        updates.selectedPlan = currentPlan;
      }
      
      if (dataCollection !== user.dataCollection) {
        updates.dataCollection = dataCollection;
      }
      
      if (chatHistory !== user.chatHistory) {
        updates.chatHistory = chatHistory;
      }
      
      if (analytics !== user.analytics) {
        updates.analytics = analytics;
      }
      
      if (marketingEmails !== user.marketingEmails) {
        updates.marketingEmails = marketingEmails;
      }
      
      if (Object.keys(updates).length > 0) {
        await updateProfile(updates);
        setSuccessMessage('Profile updated successfully!');
      } else {
        setSuccessMessage('No changes to save.');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }
    
    setIsSaving(true);
    setError('');
    
    try {
      await changePassword(currentPassword, newPassword);
      setSuccessMessage('Password changed successfully!');
      setShowPasswordChange(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setError(error.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await exportData();
      setSuccessMessage('Data exported successfully!');
    } catch (error: any) {
      setError(error.message || 'Failed to export data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/main/login');
  };

  const handleSectionChange = (section: 'profile' | 'appearance' | 'account' | 'privacy' | 'billing') => {
    setActiveSection(section);
    setIsMobileMenuOpen(false); // Close mobile menu when section changes
  };

  const renderProfileSection = () => (
    <div className="space-y-8">
      <Card className="border border-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-background/70 backdrop-blur-xl shadow-xl shadow-primary/20">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-gradient-to-r from-primary to-primary/80 text-white text-xl font-semibold">
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {profileData.name}
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Member since {profileData.joinDate}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="border border-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-background/70 backdrop-blur-xl shadow-xl shadow-primary/20">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={profileData.name}
                className="w-full p-3 bg-background/50 border border-primary/20 rounded-xl text-foreground opacity-60 cursor-not-allowed"
                readOnly
                title="Full name cannot be changed"
              />
              <Lock className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Cannot be changed</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 bg-background/50 border border-primary/20 rounded-xl text-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
              <Mail className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">University</label>
              <div className="relative">
                <input
                  type="text"
                  value={profileData.university}
                  className="w-full p-3 bg-background/50 border border-primary/20 rounded-xl text-foreground opacity-60 cursor-not-allowed"
                  readOnly
                  title="University cannot be changed"
                />
                <GraduationCap className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Cannot be changed</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Major</label>
              <div className="relative">
                <input
                  type="text"
                  value={profileData.major}
                  className="w-full p-3 bg-background/50 border border-primary/20 rounded-xl text-foreground opacity-60 cursor-not-allowed"
                  readOnly
                  title="Major cannot be changed"
                />
                <Lock className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Cannot be changed</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Academic Year</label>
              <div className="relative">
                <select
                  value={profileData.year}
                  disabled
                  className="w-full p-3 bg-background/50 border border-primary/20 rounded-xl text-foreground opacity-60 cursor-not-allowed appearance-none"
                  title="Academic year cannot be changed"
                >
                  <option value="1. godina">1. godina</option>
                  <option value="2. godina">2. godina</option>
                  <option value="3. godina">3. godina</option>
                  <option value="4. godina">4. godina</option>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                </select>
                <Lock className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Cannot be changed</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Semester</label>
              <div className="relative">
                <select
                  value={profileData.semester}
                  disabled
                  className="w-full p-3 bg-background/50 border border-primary/20 rounded-xl text-foreground opacity-60 cursor-not-allowed appearance-none"
                  title="Semester cannot be changed"
                >
                  <option value="1. semestar">1. semestar</option>
                  <option value="2. semestar">2. semestar</option>
                </select>
                <Lock className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Cannot be changed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-8">
      <Card className="border border-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-background/70 backdrop-blur-xl shadow-xl shadow-primary/20">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Color Mode
          </CardTitle>
          <CardDescription>
            Choose how the interface looks to you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {['dark', 'light', 'auto'].map((mode, index) => (
            <div key={mode} className={index > 0 ? 'mt-3' : ''}>
              <label className="group cursor-pointer block">
                <div className="flex items-center gap-4 p-4 border border-primary/20 rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all duration-200">
                  <input
                    type="radio"
                    name="colorMode"
                    value={mode}
                    checked={colorMode === mode}
                    onChange={(e) => setColorMode(e.target.value as any)}
                    className="w-4 h-4 text-primary focus:ring-primary/30"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-foreground capitalize">
                      {mode}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {mode === 'dark' && 'Dark theme for reduced eye strain'}
                      {mode === 'light' && 'Light theme for better visibility'}
                      {mode === 'auto' && 'Follows your system preference'}
                    </div>
                  </div>
                  {colorMode === mode && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-background/70 backdrop-blur-xl shadow-xl shadow-primary/20">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Chat Font
          </CardTitle>
          <CardDescription>
            Choose the font family for chat messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: 'system', label: 'System Font', desc: 'Default system font' },
            { value: 'mono', label: 'Monospace', desc: 'Fixed-width font for code' },
            { value: 'serif', label: 'Serif', desc: 'Traditional reading font' }
          ].map((font, index) => (
            <div key={font.value} className={index > 0 ? 'mt-3' : ''}>
              <label className="group cursor-pointer block">
                <div className="flex items-center gap-4 p-4 border border-primary/20 rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all duration-200">
                  <input
                    type="radio"
                    name="chatFont"
                    value={font.value}
                    checked={chatFont === font.value}
                    onChange={(e) => setChatFont(e.target.value as any)}
                    className="w-4 h-4 text-primary focus:ring-primary/30"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">
                      {font.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {font.desc}
                    </div>
                  </div>
                  {chatFont === font.value && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderAccountSection = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-background/70 backdrop-blur-xl shadow-xl shadow-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-xl">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Account Status</h3>
            </div>
            <Badge className="bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 border-green-500/30">
              {user?.isVerified ? 'Verified' : 'Active'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border border-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-background/70 backdrop-blur-xl shadow-xl shadow-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-xl">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Total Conversations</h3>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {user?.totalConversations || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-background/70 backdrop-blur-xl shadow-xl shadow-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-xl">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Monthly Usage</h3>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-foreground">
                {user?.promptsUsedThisMonth || 0} / {user?.monthlyPromptLimit === -1 ? '∞' : (user?.monthlyPromptLimit || 10)}
              </div>
              {user?.monthlyPromptLimit !== -1 && (
                <Progress 
                  value={(user?.promptsUsedThisMonth || 0) / (user?.monthlyPromptLimit || 10) * 100} 
                  className="h-2"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {showPasswordChange && (
        <Card className="border border-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-background/70 backdrop-blur-xl shadow-xl shadow-primary/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 bg-background/50 border border-primary/20 rounded-xl text-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 bg-background/50 border border-primary/20 rounded-xl text-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-background/50 border border-primary/20 rounded-xl text-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                placeholder="Confirm new password"
              />
            </div>
            <div className="flex gap-3">
              <Button 
                className="bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-white"
                onClick={handlePasswordChange}
                disabled={isSaving}
              >
                {isSaving ? 'Changing...' : 'Change Password'}
              </Button>
              <Button 
                variant="outline"
                className="border-primary/20 text-muted-foreground hover:bg-primary/5 hover:border-primary/40"
                onClick={() => {
                  setShowPasswordChange(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setError('');
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border border-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-background/70 backdrop-blur-xl shadow-xl shadow-primary/20">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Account Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline"
              className="border-primary/20 text-foreground hover:bg-primary/5 hover:border-primary/40"
              onClick={() => setShowPasswordChange(!showPasswordChange)}
            >
              <Lock className="w-4 h-4 mr-2" />
              {showPasswordChange ? 'Cancel Password Change' : 'Change Password'}
            </Button>
            <Button 
              variant="outline"
              className="border-primary/20 text-foreground hover:bg-primary/5 hover:border-primary/40"
              onClick={handleExportData}
              disabled={isLoading}
            >
              <Download className="w-4 h-4 mr-2" />
              {isLoading ? 'Exporting...' : 'Export Data'}
            </Button>
            <Button 
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPrivacySection = () => {
    const ToggleSwitch = ({ checked, onChange, disabled = false }: { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) => (
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background ${
          checked ? 'bg-primary' : 'bg-muted'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    );

    return (
      <div className="space-y-6">
        <Card className="border border-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-background/70 backdrop-blur-xl shadow-xl shadow-primary/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Privacy Settings
            </CardTitle>
            <CardDescription>
              Control how your data is used and stored
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-xl">
                  <Eye className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Data Collection</h3>
                  <p className="text-sm text-muted-foreground">Allow collection of usage data to improve service</p>
                </div>
              </div>
              <ToggleSwitch 
                checked={dataCollection}
                onChange={setDataCollection}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-xl">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Chat History</h3>
                  <p className="text-sm text-muted-foreground">Save conversation history for future reference</p>
                </div>
              </div>
              <ToggleSwitch 
                checked={chatHistory}
                onChange={setChatHistory}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-xl">
                  <Settings className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Analytics</h3>
                  <p className="text-sm text-muted-foreground">Share anonymous usage analytics</p>
                </div>
              </div>
              <ToggleSwitch 
                checked={analytics}
                onChange={setAnalytics}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-xl">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Marketing Emails</h3>
                  <p className="text-sm text-muted-foreground">Receive updates about new features and improvements</p>
                </div>
              </div>
              <ToggleSwitch 
                checked={marketingEmails}
                onChange={setMarketingEmails}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBillingSection = () => (
    <div className="space-y-8">
      <Card className="border border-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-background/70 backdrop-blur-xl shadow-xl shadow-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-xl">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Current Plan: {billingPlans.find(p => p.id === currentPlan)?.name}
              </h3>
              <p className="text-muted-foreground">Manage your subscription</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {billingPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`group cursor-pointer transition-all duration-500 text-center backdrop-blur-xl relative overflow-hidden hover:-translate-y-2 hover:scale-105 ${
              currentPlan === plan.id 
                ? 'border-primary/60 shadow-2xl shadow-primary/50 bg-gradient-to-br from-primary/15 via-primary/10 to-background/80' 
                : 'border-primary/20 shadow-xl shadow-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-background/70'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-2xl w-fit shadow-lg group-hover:shadow-primary/40 group-hover:scale-110 transition-all duration-500">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                {plan.name}
              </CardTitle>
              <div className="text-3xl font-black mb-2 bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                {plan.price}
              </div>
              <CardDescription className="text-sm text-muted-foreground group-hover:text-muted-foreground/90 transition-colors duration-300">
                {plan.prompts}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-gradient-to-r from-primary to-primary/80 rounded-full flex-shrink-0"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Button 
                className={`w-full transition-all duration-300 ${
                  currentPlan === plan.id 
                    ? 'bg-muted text-muted-foreground cursor-default' 
                    : 'bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-white hover:scale-105'
                }`}
                onClick={() => currentPlan !== plan.id && setCurrentPlan(plan.id)}
                disabled={currentPlan === plan.id}
              >
                {currentPlan === plan.id ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Current Plan
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Upgrade
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
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
    <TooltipProvider>
      <div className="min-h-screen relative overflow-hidden bg-background text-foreground font-inter">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/2 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(2px_2px_at_20px_30px,rgba(78,60,250,0.3),transparent),radial-gradient(2px_2px_at_40px_70px,rgba(78,60,250,0.2),transparent)] bg-repeat bg-[length:150px_150px] pointer-events-none" />
        
        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex w-80 bg-gradient-to-br from-primary/8 via-primary/5 to-background/70 border-r border-primary/20 backdrop-blur-xl flex-col">
            <div className="p-6 border-b border-primary/20">
              <Button 
                variant="ghost"
                className="mb-4 text-muted-foreground hover:text-foreground hover:bg-primary/10"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-black bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                Settings
              </h1>
            </div>
            <nav className="p-4 space-y-2 flex-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 border border-primary/30 text-primary shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-primary/5 border border-transparent'
                  }`}
                  onClick={() => handleSectionChange(section.id as any)}
                >
                  <div className={`p-2 rounded-lg transition-colors duration-200 ${
                    activeSection === section.id
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted/50 text-muted-foreground'
                  }`}>
                    {section.icon}
                  </div>
                  <span className="font-medium">{section.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Mobile Menu Modal */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Modal Content */}
              <div className="relative w-80 max-w-[80vw] bg-gradient-to-br from-primary/8 via-primary/5 to-background/90 border-r border-primary/20 backdrop-blur-xl flex flex-col animate-in slide-in-from-left duration-300">
                <div className="p-6 border-b border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <Button 
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
                      onClick={() => navigate('/')}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <h1 className="text-2xl font-black bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    Settings
                  </h1>
                </div>
                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 border border-primary/30 text-primary shadow-lg shadow-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-primary/5 border border-transparent'
                      }`}
                      onClick={() => handleSectionChange(section.id as any)}
                    >
                      <div className={`p-2 rounded-lg transition-colors duration-200 ${
                        activeSection === section.id
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted/50 text-muted-foreground'
                      }`}>
                        {section.icon}
                      </div>
                      <span className="font-medium">{section.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile Header */}
            <div className="lg:hidden border-b border-primary/20 bg-gradient-to-r from-background/80 to-primary/5 backdrop-blur-xl p-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold text-foreground truncate">
                    {sections.find(s => s.id === activeSection)?.name}
                  </h1>
                  <p className="text-sm text-muted-foreground truncate">
                    Manage your settings
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block border-b border-primary/20 bg-gradient-to-r from-background/80 to-primary/5 backdrop-blur-xl p-8">
              <h1 className="text-4xl font-black bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent mb-2">
                {sections.find(s => s.id === activeSection)?.name}
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>

            {/* Messages */}
            <div className="p-4 lg:p-8 space-y-4">
              {error && (
                <Card className="border-red-500/50 bg-red-500/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 text-red-400">
                      <X className="w-5 h-5" />
                      <span className="text-sm lg:text-base">{error}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
              {successMessage && (
                <Card className="border-green-500/50 bg-green-500/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 text-green-400">
                      <Check className="w-5 h-5" />
                      <span className="text-sm lg:text-base">{successMessage}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
              {isLoading && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 text-primary">
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <span className="text-sm lg:text-base">Loading profile data...</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
              {renderSection()}
            </div>

            {/* Actions */}
            {(activeSection === 'profile' || activeSection === 'appearance' || activeSection === 'privacy' || activeSection === 'billing') && (
              <div className="border-t border-primary/20 bg-gradient-to-r from-background/80 to-primary/5 backdrop-blur-xl p-4 lg:p-8">
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                  <Button 
                    className="bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-white px-6 lg:px-8 py-3 font-semibold"
                    onClick={handleSaveChanges}
                    disabled={isSaving || isLoading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-primary/20 text-muted-foreground hover:bg-primary/5 hover:border-primary/40 px-6 lg:px-8 py-3"
                    onClick={() => {
                      setError('');
                      setSuccessMessage('');
                      if (user) {
                        setProfileData({
                          name: `${user.firstName} ${user.lastName}`,
                          email: user.email,
                          university: user.faculty || '',
                          year: user.academicYear || '',
                          semester: user.semester || '',
                          major: user.major || '',
                          joinDate: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        });
                        setColorMode(user.colorMode || 'dark');
                        setChatFont(user.chatFont || 'system');
                        setCurrentPlan((user.selectedPlan as 'free' | 'pro' | 'max') || 'free');
                        setDataCollection(user.dataCollection ?? true);
                        setChatHistory(user.chatHistory ?? true);
                        setAnalytics(user.analytics ?? false);
                        setMarketingEmails(user.marketingEmails ?? false);
                      }
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Profile;