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
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-2xl font-bold">{t('common.appName')}</h2>
            <p className="text-sm text-blue-100">{t('common.appTitle')}</p>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="text-right text-white">
              <p className="font-medium">
                {currentUser.Title}{currentUser.Name} {currentUser.Surname}
              </p>
              <p className="text-sm text-blue-200">{currentUser.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้พักอาศัย'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition border border-white/30"
            >
              {t('common.logout')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex-1">
        {/* Welcome Banner */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            สวัสดี, {currentUser.Title}{currentUser.Name} {currentUser.Surname}
          </h3>
          <p className="text-gray-500 text-sm mt-1">{formatDateThaiWithDayName(new Date())}</p>
        </div>

        {/* === Section: การเงินและการชำระ === */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
            การเงินและการชำระ
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <MenuCard icon="💳" title="ยอดชำระ / ส่งสลิป" subtitle="ชำระค่าบ้านพักและส่งหลักฐาน" color="blue" />
            <MenuCard icon="📋" title="แจ้งยอดชำระประจำเดือน" subtitle="แจ้งยอดบิลรายเดือน" color="indigo" />
            <MenuCard icon="📜" title="ประวัติการชำระ" subtitle="ดูรายการชำระย้อนหลัง" color="purple" />
            <MenuCard icon="✅" title="ตรวจสลิป" subtitle="ตรวจสอบหลักฐานการโอน" color="green" />
          </div>
        </div>

        {/* === Section: บันทึกค่าน้ำ-ไฟ === */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-cyan-500 rounded-full"></span>
            บันทึกค่าน้ำ-ไฟ
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <MenuCard icon="💧" title="บันทึกค่าน้ำ" subtitle="บันทึกมิเตอร์น้ำประจำเดือน" color="cyan" />
            <MenuCard icon="⚡" title="บันทึกค่าไฟ" subtitle="บันทึกมิเตอร์ไฟประจำเดือน" color="yellow" />
          </div>
        </div>

        {/* === Section: คำร้องและแบบฟอร์ม === */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
            คำร้องและแบบฟอร์ม
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <MenuCard icon="🔧" title="แจ้งซ่อม / คำร้อง" subtitle="แจ้งปัญหาหรือยื่นคำร้อง" color="orange" />
            <MenuCard icon="📝" title="แบบฟอร์ม" subtitle="กรอกแบบฟอร์มเอกสารต่าง ๆ" color="amber" />
            <MenuCard icon="📬" title="คำร้องและการจัดคิว" subtitle="จัดการคิวคำร้อง (แอดมิน)" color="rose" />
          </div>
        </div>

        {/* === Section: การเงินและบัญชี === */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
            การเงินและบัญชี
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <MenuCard icon="📊" title="บัญชีรายรับรายจ่าย" subtitle="สรุปรายรับ-รายจ่ายทั้งหมด" color="emerald" />
            <MenuCard icon="💰" title="ค่าใช้จ่ายอื่น ๆ" subtitle="รายการค่าใช้จ่ายเพิ่มเติม" color="teal" />
            <MenuCard icon="💸" title="เบิกจ่าย" subtitle="การเบิกจ่ายงบประมาณ" color="lime" />
          </div>
        </div>

        {/* === Section: ระเบียบ ข้อมูลส่วนตัว และตั้งค่า === */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-gray-500 rounded-full"></span>
            ตั้งค่าและอื่น ๆ
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <MenuCard icon="📖" title="ระเบียบ / ประกาศ" subtitle="ระเบียบข้อบังคับและประกาศ" color="slate" />
            <MenuCard icon="👤" title="ข้อมูลส่วนตัว" subtitle="ดูและแก้ไขโปรไฟล์ผู้ใช้" color="sky" />
            <MenuCard icon="⚙️" title="ตั้งค่าแอดมิน" subtitle="จัดการการตั้งค่าระบบ" color="gray" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500">
          <p>{t('common.appName')} v1.0.0 | {t('common.appTitle')}</p>
          <p className="text-xs mt-1">ออกแบบและพัฒนาโดย ครูพงศธร โพธิแก้ว</p>
        </div>
      </footer>
    </div>
  );
}

/**
 * Menu Card Component
 */
function MenuCard({ icon, title, subtitle, color }: { icon: string; title: string; subtitle: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    indigo: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
    purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    green: 'bg-green-50 hover:bg-green-100 border-green-200',
    cyan: 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200',
    yellow: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200',
    orange: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
    amber: 'bg-amber-50 hover:bg-amber-100 border-amber-200',
    rose: 'bg-rose-50 hover:bg-rose-100 border-rose-200',
    emerald: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
    teal: 'bg-teal-50 hover:bg-teal-100 border-teal-200',
    lime: 'bg-lime-50 hover:bg-lime-100 border-lime-200',
    slate: 'bg-slate-50 hover:bg-slate-100 border-slate-200',
    sky: 'bg-sky-50 hover:bg-sky-100 border-sky-200',
    gray: 'bg-gray-50 hover:bg-gray-100 border-gray-200',
  };

  return (
    <button
      className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer hover:shadow-md ${colorMap[color] || colorMap.blue}`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h5 className="font-bold text-gray-800 text-sm leading-tight">{title}</h5>
      <p className="text-xs text-gray-500 mt-1 leading-tight">{subtitle}</p>
    </button>
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
