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
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  InnerDialog,
  InnerDialogTrigger,
  InnerDialogContent,
  InnerDialogHeader,
  InnerDialogTitle,
  InnerDialogDescription
} from '../components/ui/nested-dialog';
import { Pricing } from '../components/blocks/pricing';
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
      <Card className="border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl shadow-xl shadow-black/20">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-gradient-to-r from-primary to-primary/80 text-white text-xl font-semibold">
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold text-white">
                {profileData.name}
              </CardTitle>
              <CardDescription className="text-base text-gray-300">
                Member since {profileData.joinDate}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl shadow-xl shadow-black/20">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={profileData.name}
                className="w-full p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white opacity-60 cursor-not-allowed"
                readOnly
                title="Full name cannot be changed"
              />
              <Lock className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-400">Cannot be changed</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Email</label>
            <div className="relative">
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
              <Mail className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">University</label>
              <div className="relative">
                <input
                  type="text"
                  value={profileData.university}
                  className="w-full p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white opacity-60 cursor-not-allowed"
                  readOnly
                  title="University cannot be changed"
                />
                <GraduationCap className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-400">Cannot be changed</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Major</label>
              <div className="relative">
                <input
                  type="text"
                  value={profileData.major}
                  className="w-full p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white opacity-60 cursor-not-allowed"
                  readOnly
                  title="Major cannot be changed"
                />
                <Lock className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-400">Cannot be changed</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Academic Year</label>
              <div className="relative">
                <select
                  value={profileData.year}
                  disabled
                  className="w-full p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white opacity-60 cursor-not-allowed appearance-none"
                  title="Academic year cannot be changed"
                >
                  <option value="1. godina">1. godina</option>
                  <option value="2. godina">2. godina</option>
                  <option value="3. godina">3. godina</option>
                  <option value="4. godina">4. godina</option>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                </select>
                <Lock className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-400">Cannot be changed</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Semester</label>
              <div className="relative">
                <select
                  value={profileData.semester}
                  disabled
                  className="w-full p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white opacity-60 cursor-not-allowed appearance-none"
                  title="Semester cannot be changed"
                >
                  <option value="1. semestar">1. semestar</option>
                  <option value="2. semestar">2. semestar</option>
                </select>
                <Lock className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-400">Cannot be changed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-8">
      <Card className="border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl shadow-xl shadow-black/20">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Color Mode
          </CardTitle>
          <CardDescription className="text-gray-300">
            Choose how the interface looks to you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {['dark', 'light', 'auto'].map((mode, index) => (
            <div key={mode} className={index > 0 ? 'mt-3' : ''}>
              <label className="group cursor-pointer block">
                <div className="flex items-center gap-4 p-4 border border-zinc-700/50 rounded-xl hover:border-zinc-600/50 hover:bg-zinc-800/30 transition-all duration-200">
                  <input
                    type="radio"
                    name="colorMode"
                    value={mode}
                    checked={colorMode === mode}
                    onChange={(e) => setColorMode(e.target.value as any)}
                    className="w-4 h-4 text-primary focus:ring-primary/30"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white capitalize">
                      {mode}
                    </div>
                    <div className="text-sm text-gray-300">
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

      <Card className="border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl shadow-xl shadow-black/20">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Chat Font
          </CardTitle>
          <CardDescription className="text-gray-300">
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
                <div className="flex items-center gap-4 p-4 border border-zinc-700/50 rounded-xl hover:border-zinc-600/50 hover:bg-zinc-800/30 transition-all duration-200">
                  <input
                    type="radio"
                    name="chatFont"
                    value={font.value}
                    checked={chatFont === font.value}
                    onChange={(e) => setChatFont(e.target.value as any)}
                    className="w-4 h-4 text-primary focus:ring-primary/30"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">
                      {font.label}
                    </div>
                    <div className="text-sm text-gray-300">
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
        <Card className="border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl shadow-xl shadow-black/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-xl">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-white">Account Status</h3>
            </div>
            <Badge className="bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 border-green-500/30">
              {user?.isVerified ? 'Verified' : 'Active'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl shadow-xl shadow-black/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-xl">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-white">Total Conversations</h3>
            </div>
            <div className="text-2xl font-bold text-white">
              {user?.totalConversations || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl shadow-xl shadow-black/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-xl">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-white">Monthly Usage</h3>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">
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


      <Card className="border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl shadow-xl shadow-black/20">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Account Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            
            {/* Password Change Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="border-zinc-700 bg-zinc-800/50 text-gray-100 hover:bg-zinc-700 hover:text-white hover:border-zinc-600"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent className="border-zinc-800/50 bg-zinc-900/50 text-white backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Change Password</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Enter your current password and choose a new one. Make sure it's at least 6 characters long.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      placeholder="Confirm new password"
                    />
                  </div>
                  
                  <InnerDialog>
                    <InnerDialogTrigger asChild>
                      <Button 
                        className="w-full bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-800 hover:via-zinc-900 hover:to-black text-white shadow-lg"
                        disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
                      >
                        {isSaving ? 'Changing...' : 'Change Password'}
                      </Button>
                    </InnerDialogTrigger>
                    <InnerDialogContent className="border-zinc-800/50 bg-zinc-900/50 text-white backdrop-blur-xl">
                      <InnerDialogHeader>
                        <InnerDialogTitle className="text-white">Confirm Password Change</InnerDialogTitle>
                        <InnerDialogDescription className="text-gray-300">
                          Are you sure you want to change your password? You'll need to log in again after this change.
                        </InnerDialogDescription>
                      </InnerDialogHeader>
                      
                      <div className="flex gap-3 mt-6">
                        <Button 
                          onClick={handlePasswordChange}
                          className="flex-1 bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-800 hover:via-zinc-900 hover:to-black text-white shadow-lg"
                          disabled={isSaving}
                        >
                          {isSaving ? 'Changing...' : 'Confirm Change'}
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 border-zinc-700 bg-zinc-800/50 text-gray-100 hover:bg-zinc-700 hover:text-white hover:border-zinc-600"
                          onClick={() => {
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                            setError('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </InnerDialogContent>
                  </InnerDialog>
                </div>
              </DialogContent>
            </Dialog>

            {/* Export Data Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="border-zinc-700 bg-zinc-800/50 text-gray-100 hover:bg-zinc-700 hover:text-white hover:border-zinc-600"
                  disabled={isLoading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </DialogTrigger>
              <DialogContent className="border-zinc-800/50 bg-zinc-900/50 text-white backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Export Your Data</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Download all your personal data including profile information, conversation history, and settings.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="bg-zinc-800/30 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">What's included:</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Profile information and settings</li>
                      <li>• Chat history and conversations</li>
                      <li>• Usage statistics</li>
                      <li>• Account preferences</li>
                    </ul>
                  </div>
                  
                  <InnerDialog>
                    <InnerDialogTrigger asChild>
                      <Button 
                        className="w-full bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-800 hover:via-zinc-900 hover:to-black text-white shadow-lg"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Preparing Export...' : 'Start Export'}
                      </Button>
                    </InnerDialogTrigger>
                    <InnerDialogContent className="border-zinc-800/50 bg-zinc-900/50 text-white backdrop-blur-xl">
                      <InnerDialogHeader>
                        <InnerDialogTitle className="text-white">Confirm Data Export</InnerDialogTitle>
                        <InnerDialogDescription className="text-gray-300">
                          Your data export will be prepared and downloaded automatically. This may take a few moments.
                        </InnerDialogDescription>
                      </InnerDialogHeader>
                      
                      <div className="flex gap-3 mt-6">
                        <Button 
                          onClick={handleExportData}
                          className="flex-1 bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-800 hover:via-zinc-900 hover:to-black text-white shadow-lg"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Exporting...' : 'Confirm Export'}
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 border-zinc-700 bg-zinc-800/50 text-gray-100 hover:bg-zinc-700 hover:text-white hover:border-zinc-600"
                        >
                          Cancel
                        </Button>
                      </div>
                    </InnerDialogContent>
                  </InnerDialog>
                </div>
              </DialogContent>
            </Dialog>

            {/* Logout Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </DialogTrigger>
              <DialogContent className="border-zinc-800/50 bg-zinc-900/50 text-white backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Confirm Logout</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Are you sure you want to log out? You'll need to sign in again to access your account.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="bg-zinc-800/30 p-4 rounded-lg">
                    <p className="text-gray-300 text-sm">
                      Your data and settings are automatically saved and will be available when you sign back in.
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleLogout}
                      className="flex-1 bg-gradient-to-r from-red-800 via-red-900 to-red-950 hover:from-red-900 hover:via-red-950 hover:to-black text-white shadow-lg"
                    >
                      Yes, Logout
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 border-zinc-700 bg-zinc-800/50 text-gray-100 hover:bg-zinc-700 hover:text-white hover:border-zinc-600"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
        <Card className="border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl shadow-xl shadow-black/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Privacy Settings
            </CardTitle>
            <CardDescription className="text-gray-300">
              Control how your data is used and stored
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-zinc-700/50 rounded-xl hover:bg-zinc-800/30 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-xl">
                  <Eye className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Data Collection</h3>
                  <p className="text-sm text-gray-300">Allow collection of usage data to improve service</p>
                </div>
              </div>
              <ToggleSwitch 
                checked={dataCollection}
                onChange={setDataCollection}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-zinc-700/50 rounded-xl hover:bg-zinc-800/30 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-xl">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Chat History</h3>
                  <p className="text-sm text-gray-300">Save conversation history for future reference</p>
                </div>
              </div>
              <ToggleSwitch 
                checked={chatHistory}
                onChange={setChatHistory}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-zinc-700/50 rounded-xl hover:bg-zinc-800/30 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-xl">
                  <Settings className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Analytics</h3>
                  <p className="text-sm text-gray-300">Share anonymous usage analytics</p>
                </div>
              </div>
              <ToggleSwitch 
                checked={analytics}
                onChange={setAnalytics}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-zinc-700/50 rounded-xl hover:bg-zinc-800/30 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-xl">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Marketing Emails</h3>
                  <p className="text-sm text-gray-300">Receive updates about new features and improvements</p>
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
      <Card className="border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl shadow-xl shadow-black/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-xl">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                Current Plan: {billingPlans.find(p => p.id === currentPlan)?.name}
              </h3>
              <p className="text-gray-300">Manage your subscription</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative -mx-4 lg:-mx-8">
        <Pricing 
          plans={[
            {
              name: 'Free',
              price: '0',
              yearlyPrice: '0', 
              period: 'month',
              features: ['10 AI conversations per day', 'Basic chat modes', 'Community support', 'Standard response time'],
              description: 'Perfect for trying out the platform',
              buttonText: currentPlan === 'free' ? 'Current Plan' : 'Get Started',
              href: '#',
              isPopular: false,
            },
            {
              name: 'Pro',
              price: '10',
              yearlyPrice: '8',
              period: 'month', 
              features: ['100 conversations per day', 'Priority response time', 'Email support', 'Advanced chat modes', 'File attachments'],
              description: 'Best for regular users',
              buttonText: currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
              href: '#',
              isPopular: true,
            },
            {
              name: 'Max',
              price: '20',
              yearlyPrice: '16',
              period: 'month',
              features: ['Unlimited conversations', 'Instant response time', '24/7 priority support', 'API access', 'Team collaboration', 'Custom integrations'],
              description: 'For power users and teams',
              buttonText: currentPlan === 'max' ? 'Current Plan' : 'Upgrade to Max', 
              href: '#',
              isPopular: false,
            },
          ]}
          title="Choose Your Plan"
          description="All plans include access to our AI platform and core features.\nUpgrade anytime to unlock more conversations and premium support."
        />
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
      <div className="min-h-screen relative overflow-hidden bg-zinc-950 text-white font-inter">
        {/* Background decorations - matching MainHome */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-zinc-950 to-background/10 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(2px_2px_at_20px_30px,hsla(0,0%,85%,0.1),transparent),radial-gradient(2px_2px_at_40px_70px,hsla(0,0%,75%,0.05),transparent)] bg-repeat bg-[length:150px_150px] pointer-events-none opacity-40" />
        
        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex w-80 bg-zinc-900/50 border-r border-zinc-800/50 backdrop-blur-xl flex-col">
            <div className="p-6 border-b border-zinc-800/50">
              <Button 
                variant="ghost"
                className="mb-4 text-gray-300 hover:text-white hover:bg-zinc-800/50"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-black bg-gradient-to-br from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                Settings
              </h1>
            </div>
            <nav className="p-4 space-y-2 flex-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-zinc-800/60 border border-zinc-700/50 text-white shadow-lg shadow-black/20'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/30 border border-transparent'
                  }`}
                  onClick={() => handleSectionChange(section.id as any)}
                >
                  <div className={`p-2 rounded-lg transition-colors duration-200 ${
                    activeSection === section.id
                      ? 'bg-white/10 text-white'
                      : 'bg-zinc-700/50 text-zinc-300'
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
              <div className="relative w-80 max-w-[80vw] bg-zinc-900/90 border-r border-zinc-800/50 backdrop-blur-xl flex flex-col animate-in slide-in-from-left duration-300">
                <div className="p-6 border-b border-zinc-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <Button 
                      variant="ghost"
                      className="text-gray-300 hover:text-white hover:bg-zinc-800/50"
                      onClick={() => navigate('/')}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-300 hover:text-white hover:bg-zinc-800/50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <h1 className="text-2xl font-black bg-gradient-to-br from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                    Settings
                  </h1>
                </div>
                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-zinc-800/60 border border-zinc-700/50 text-white shadow-lg shadow-black/20'
                          : 'text-zinc-300 hover:text-white hover:bg-zinc-800/30 border border-transparent'
                      }`}
                      onClick={() => handleSectionChange(section.id as any)}
                    >
                      <div className={`p-2 rounded-lg transition-colors duration-200 ${
                        activeSection === section.id
                          ? 'bg-white/10 text-white'
                          : 'bg-zinc-700/50 text-zinc-300'
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
            <div className="lg:hidden border-b border-zinc-800/50 bg-zinc-900/80 backdrop-blur-xl p-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-zinc-800/50"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold text-white truncate">
                    {sections.find(s => s.id === activeSection)?.name}
                  </h1>
                  <p className="text-sm text-gray-300 truncate">
                    Manage your settings
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block border-b border-zinc-800/50 bg-zinc-900/80 backdrop-blur-xl p-8">
              <h1 className="text-4xl font-black bg-gradient-to-br from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
                {sections.find(s => s.id === activeSection)?.name}
              </h1>
              <p className="text-xl text-gray-300">
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
                <Card className="border-zinc-800/50 bg-zinc-900/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 text-primary">
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <span className="text-sm lg:text-base text-white">Loading profile data...</span>
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
              <div className="border-t border-zinc-800/50 bg-zinc-900/80 backdrop-blur-xl p-4 lg:p-8">
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                  <Button 
                    className="bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-800 hover:via-zinc-900 hover:to-black text-white px-6 lg:px-8 py-3 font-semibold shadow-lg"
                    onClick={handleSaveChanges}
                    disabled={isSaving || isLoading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-zinc-700 bg-zinc-800/50 text-gray-100 hover:bg-zinc-700 hover:text-white hover:border-zinc-600 px-6 lg:px-8 py-3"
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