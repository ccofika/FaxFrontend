import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/admin/AdminAuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Molimo unesite email i šifru');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await login(email, password);
    } catch (error: any) {
      setError(error.message || 'Greška pri prijavljivanju');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-4">
            <div className="w-8 h-8 bg-white rounded-full relative">
              <div className="absolute inset-2 bg-black rounded-full"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">FAXit Admin</h1>
          <p className="text-gray-600 mt-2">Prijavite se na admin panel</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center text-gray-900">Admin Login</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Unesite vaše admin podatke
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Šifra
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white py-2.5 transition-colors duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Prijavljivanje...
                  </div>
                ) : (
                  'Prijavite se'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <div className="flex items-center gap-2 justify-center text-sm text-gray-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
              <path d="M3 12h6m6 0h6"/>
            </svg>
            Sigurno admin okruženje
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;