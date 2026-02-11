/**
 * HOME PPK - งานส่งเสริม กำกับ ดูแล และพัฒนาบ้านพักครู 2569
 * ออกแบบและพัฒนาโดย ครูพงศธร โพธิแก้ว
 * 
 * Main Application Component
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GAS_API_CONFIG } from '../config';
import { 
  authenticateUser, 
  getUserProfile,
  getAllUsers 
} from '../services/api';
import { formatDateThaiWithDayName, formatDateTimeThaiWithTime } from '../utils/dateUtils';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export default function App() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      
      // Check if API is reachable
      try {
        const response = await getAllUsers();
        if (response.success) {
          console.log('✓ API Connection Successful');
        } else {
          console.warn('API returned error:', response.error);
        }
      } catch (apiErr) {
        console.warn('API not reachable yet, continuing...', apiErr);
      }
    } catch (err: any) {
      setError(`Connection Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authenticateUser(email, password);
      
      if (response.success && response.data) {
        setCurrentUser(response.data);
        setIsAuthenticated(true);
        setError(null);
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // ============ AUTHENTICATION SCREEN ============
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">{t('common.appName')}</h1>
            <p className="text-gray-500 mt-2">{t('common.appTitle')}</p>
          </div>

          <div className="flex justify-center mb-6">
            <LanguageSwitcher />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <LoginForm onLogin={handleLogin} isLoading={isLoading} />

          <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm text-gray-600 border border-blue-200">
            <p className="font-bold mb-2">� ข้อมูลเข้าสู่ระบบ</p>
            <code className="block bg-white p-2 rounded border text-xs mb-2">
              Email: pongsatorn.b@ppk.ac.th<br/>
              Pass: ppk2569
            </code>
          </div>
        </div>
      </div>
    );
  }

  // ============ MAIN APPLICATION SCREEN ============
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-blue-600">{t('common.appName')}</h2>
            <p className="text-sm text-gray-500">{t('common.appTitle')}</p>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="text-right">
              <p className="font-medium text-gray-800">
                {currentUser.Title}{currentUser.Name} {currentUser.Surname}
              </p>
              <p className="text-sm text-gray-500">{currentUser.Role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              {t('common.logout')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {t('dashboard.welcome')}
          </h3>
          <p className="text-gray-600 mb-8">
            {t('common.appTitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-2">💳</div>
              <h4 className="font-bold text-gray-800">{t('bills.title')}</h4>
              <p className="text-sm text-gray-600 mt-2">{t('bills.list')}</p>
            </div>
            <div className="p-6 bg-green-50 rounded-lg">
              <div className="text-3xl mb-2">💧</div>
              <h4 className="font-bold text-gray-800">{t('utilities.waterReading')}</h4>
              <p className="text-sm text-gray-600 mt-2">{t('utilities.submit')}</p>
            </div>
            <div className="p-6 bg-yellow-50 rounded-lg">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-bold text-gray-800">{t('utilities.electricReading')}</h4>
              <p className="text-sm text-gray-600 mt-2">{t('utilities.submit')}</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-bold text-amber-800 mb-2">📝 Note</h4>
            <p className="text-sm text-amber-700 mb-2">
              {t('common.appTitle')} v1.0.0
            </p>
            <p className="text-sm text-amber-700">
              ออกแบบและพัฒนาโดย ครูพงศธร โพธิแก้ว
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>{t('common.appName')} v1.0.0 | {t('common.appTitle')} | {formatDateThaiWithDayName(new Date())}</p>
          <p className="text-xs mt-1">ออกแบบและพัฒนาโดย ครูพงศธร โพธิแก้ว</p>
        </div>
      </footer>
    </div>
  );
}

/**
 * Login Form Component
 */
function LoginForm({ onLogin, isLoading }: any) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('pongsatorn.b@ppk.ac.th');
  const [password, setPassword] = useState('ppk2569');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('common.email')}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('common.email')}
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('common.password')}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('common.password')}
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isLoading ? t('messages.loading') : t('auth.signIn')}
      </button>
    </form>
  );
}
