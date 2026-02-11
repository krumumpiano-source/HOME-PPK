/**
 * HOME PPK - งานส่งเสริม กำกับ ดูแล และพัฒนาบ้านพักครู 2569
 * ออกแบบและพัฒนาโดย ครูพงศธร โพธิแก้ว
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  authenticateUser,
  getAllUsers,
  getBills,
  getPaymentSlips,
  getRequests,
  getExpenses,
  getRegulations,
  getUtilityReadings,
  callGasApi,
} from '../services/api';
import { formatDateThaiWithDayName } from '../utils/dateUtils';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

// ============ Types ============
type PageId =
  | 'dashboard'
  | 'payments'
  | 'monthly-bill'
  | 'payment-history'
  | 'slip-verify'
  | 'water-record'
  | 'electricity-record'
  | 'requests'
  | 'forms'
  | 'admin-requests'
  | 'accounting'
  | 'expenses'
  | 'disbursement'
  | 'regulations'
  | 'profile'
  | 'admin-settings';

interface MenuItem {
  id: PageId;
  icon: string;
  label: string;
  group: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', icon: '🏠', label: 'หน้าแรก', group: 'หลัก' },
  { id: 'payments', icon: '💳', label: 'ยอดชำระ / ส่งสลิป', group: 'การเงิน' },
  { id: 'monthly-bill', icon: '📋', label: 'แจ้งยอดประจำเดือน', group: 'การเงิน' },
  { id: 'payment-history', icon: '📜', label: 'ประวัติการชำระ', group: 'การเงิน' },
  { id: 'slip-verify', icon: '✅', label: 'ตรวจสลิป', group: 'การเงิน' },
  { id: 'water-record', icon: '💧', label: 'บันทึกค่าน้ำ', group: 'สาธารณูปโภค' },
  { id: 'electricity-record', icon: '⚡', label: 'บันทึกค่าไฟ', group: 'สาธารณูปโภค' },
  { id: 'requests', icon: '🔧', label: 'แจ้งซ่อม / คำร้อง', group: 'คำร้อง' },
  { id: 'forms', icon: '📝', label: 'แบบฟอร์ม', group: 'คำร้อง' },
  { id: 'admin-requests', icon: '📬', label: 'จัดการคำร้อง', group: 'คำร้อง' },
  { id: 'accounting', icon: '📊', label: 'บัญชีรายรับรายจ่าย', group: 'บัญชี' },
  { id: 'expenses', icon: '💰', label: 'ค่าใช้จ่ายอื่น ๆ', group: 'บัญชี' },
  { id: 'disbursement', icon: '💸', label: 'เบิกจ่าย', group: 'บัญชี' },
  { id: 'regulations', icon: '📖', label: 'ระเบียบ / ประกาศ', group: 'อื่น ๆ' },
  { id: 'profile', icon: '👤', label: 'ข้อมูลส่วนตัว', group: 'อื่น ๆ' },
  { id: 'admin-settings', icon: '⚙️', label: 'ตั้งค่าระบบ', group: 'อื่น ๆ' },
];

// ============ Main App ============
export default function App() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authenticateUser(email, password);
      if (response.success && response.data) {
        setCurrentUser(response.data.user || response.data);
        setIsAuthenticated(true);
      } else {
        setError(response.error || 'เข้าสู่ระบบล้มเหลว');
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
    setCurrentPage('dashboard');
  };

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  // ============ LOGIN ============
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl text-white font-bold">H</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">HOME PPK</h1>
            <p className="text-xs text-gray-400 mt-1">งานส่งเสริม กำกับ ดูแล และพัฒนาบ้านพักครู 2569</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <LoginForm onLogin={handleLogin} isLoading={isLoading} />

          <p className="text-center text-xs text-gray-400 mt-6">
            ออกแบบและพัฒนาโดย ครูพงศธร โพธิแก้ว
          </p>
        </div>
      </div>
    );
  }

  // ============ MAIN APP ============
  const groups = [...new Set(MENU_ITEMS.map(m => m.group))];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-200 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-base text-white font-bold">H</span>
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-gray-800 text-sm leading-tight">HOME PPK</h2>
              <p className="text-[10px] text-gray-400 truncate leading-tight">บ้านพักครู 2569</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-1 px-2">
          {groups.map(group => (
            <div key={group} className="mb-0.5">
              {group !== 'หลัก' && (
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 pt-3 pb-1">{group}</p>
              )}
              {MENU_ITEMS.filter(m => m.group === group).map(item => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm flex-shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
              {(currentUser?.Name || 'U')[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-700 truncate">
                {currentUser?.Title}{currentUser?.Name}
              </p>
              <p className="text-[10px] text-gray-400">{currentUser?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้พัก'}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition p-1" title="ออกจากระบบ">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-base font-bold text-gray-800">
              {MENU_ITEMS.find(m => m.id === currentPage)?.icon}{' '}
              {MENU_ITEMS.find(m => m.id === currentPage)?.label || 'หน้าแรก'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <span className="text-xs text-gray-400 hidden sm:block">{formatDateThaiWithDayName(new Date())}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <PageContent page={currentPage} user={currentUser} navigateTo={navigateTo} />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 px-4 py-2 text-center">
          <p className="text-[11px] text-gray-400">HOME PPK v1.0.0 | ออกแบบและพัฒนาโดย ครูพงศธร โพธิแก้ว</p>
        </footer>
      </div>
    </div>
  );
}

// ============ Page Content Router ============
function PageContent({ page, user, navigateTo }: { page: PageId; user: any; navigateTo: (p: PageId) => void }) {
  switch (page) {
    case 'dashboard': return <DashboardPage user={user} navigateTo={navigateTo} />;
    case 'payments': return <PaymentsPage user={user} />;
    case 'monthly-bill': return <DataPage title="แจ้งยอดชำระประจำเดือน" fetchFn={getBills} columns={['id','residentId','water','electric','commonFee','total','status']} labels={['#','รหัสผู้พัก','ค่าน้ำ','ค่าไฟ','ค่าส่วนกลาง','รวม','สถานะ']} />;
    case 'payment-history': return <PaymentHistoryPage user={user} />;
    case 'slip-verify': return <DataPage title="ตรวจสลิป" fetchFn={() => getPaymentSlips()} columns={['id','residentId','amount','imageUrl','status']} labels={['#','รหัสผู้พัก','จำนวนเงิน','รูปสลิป','สถานะ']} />;
    case 'water-record': return <WaterRecordPage />;
    case 'electricity-record': return <ElectricityRecordPage />;
    case 'requests': return <DataPage title="แจ้งซ่อม / คำร้อง" fetchFn={getRequests} columns={['id','type','detail','status','createdAt']} labels={['#','ประเภท','รายละเอียด','สถานะ','วันที่']} />;
    case 'forms': return <FormsPage />;
    case 'admin-requests': return <DataPage title="จัดการคำร้อง (แอดมิน)" fetchFn={getRequests} columns={['id','residentId','type','detail','status','createdAt']} labels={['#','รหัสผู้พัก','ประเภท','รายละเอียด','สถานะ','วันที่']} />;
    case 'accounting': return <DataPage title="บัญชีรายรับรายจ่าย" fetchFn={getExpenses} columns={['id','description','amount','category','date']} labels={['#','รายการ','จำนวนเงิน','หมวดหมู่','วันที่']} />;
    case 'expenses': return <DataPage title="ค่าใช้จ่ายอื่น ๆ" fetchFn={getExpenses} columns={['id','description','amount','category','status']} labels={['#','รายการ','จำนวนเงิน','หมวดหมู่','สถานะ']} />;
    case 'disbursement': return <DataPage title="เบิกจ่าย" fetchFn={getExpenses} columns={['id','description','amount','approvedBy','date']} labels={['#','รายการ','จำนวนเงิน','อนุมัติโดย','วันที่']} />;
    case 'regulations': return <DataPage title="ระเบียบ / ประกาศ" fetchFn={getRegulations} columns={['id','title','category','effectiveDate']} labels={['#','หัวข้อ','หมวดหมู่','วันที่มีผล']} />;
    case 'profile': return <ProfilePage user={user} />;
    case 'admin-settings': return <AdminSettingsPage />;
    default: return <DashboardPage user={user} navigateTo={navigateTo} />;
  }
}

// ============ Dashboard Page ============
function DashboardPage({ user, navigateTo }: { user: any; navigateTo: (p: PageId) => void }) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await callGasApi('statistics/dashboard');
        if (res.success) setStats(res.data);
      } catch { /* ignore */ }
    })();
  }, []);

  const quickItems: { id: PageId; icon: string; label: string; color: string }[] = [
    { id: 'payments', icon: '💳', label: 'ชำระเงิน', color: 'bg-blue-500' },
    { id: 'water-record', icon: '💧', label: 'บันทึกน้ำ', color: 'bg-cyan-500' },
    { id: 'electricity-record', icon: '⚡', label: 'บันทึกไฟ', color: 'bg-yellow-500' },
    { id: 'requests', icon: '🔧', label: 'แจ้งซ่อม', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold">สวัสดี, {user?.Title}{user?.Name}</h2>
        <p className="text-blue-100 text-sm mt-1">ยินดีต้อนรับสู่ระบบจัดการบ้านพักครู</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickItems.map(item => (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id)}
            className="bg-white rounded-xl p-4 text-center hover:shadow-md transition border border-gray-100"
          >
            <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <span className="text-2xl">{item.icon}</span>
            </div>
            <p className="text-sm font-medium text-gray-700">{item.label}</p>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="ผู้พักทั้งหมด" value={stats?.totalResidents ?? '—'} icon="👥" />
        <StatCard label="บิลค้างชำระ" value={stats?.pendingPayments ?? '—'} icon="📄" />
        <StatCard label="รายได้เดือนนี้" value={stats?.totalRevenue ? `฿${Number(stats.totalRevenue).toLocaleString()}` : '—'} icon="💰" />
        <StatCard label="คำร้องรอดำเนินการ" value={stats?.pendingRequests ?? '—'} icon="📋" />
      </div>

      {/* All Menu Grid */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3">เมนูทั้งหมด</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          {MENU_ITEMS.filter(m => m.id !== 'dashboard').map(item => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className="bg-white rounded-xl p-3 text-center hover:shadow-md transition border border-gray-100 hover:border-blue-200"
            >
              <span className="text-xl block mb-1">{item.icon}</span>
              <p className="text-[11px] font-medium text-gray-600 leading-tight">{item.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

// ============ Payments Page (ยอดชำระ / ส่งสลิป) ============
function PaymentsPage({ user }: { user: any }) {
  const [bills, setBills] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [slipImage, setSlipImage] = useState('');
  const [slipAmount, setSlipAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [billRes, payRes] = await Promise.all([
        getBills(),
        callGasApi('payments' + (user?.id ? `?residentId=${user.id}` : '')),
      ]);
      if (billRes.success) setBills(billRes.data || []);
      if (payRes.success) setPayments(payRes.data || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  // Get payment status for a bill
  const getPaymentForBill = (billId: string) => {
    return payments.find(p => p.billId === billId);
  };

  // Calculate overdue days
  const getOverdueDays = (dueDate: string) => {
    if (!dueDate) return 0;
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  // Status display helper
  const getStatusInfo = (bill: any) => {
    const payment = getPaymentForBill(bill.id);
    if (payment?.status === 'paid' || payment?.status === 'approved') {
      return { label: 'ชำระเสร็จสิ้น', color: 'bg-green-100 text-green-700', icon: '✅' };
    }
    if (payment?.status === 'pending') {
      return { label: 'รอตรวจสอบ', color: 'bg-yellow-100 text-yellow-700', icon: '⏳' };
    }
    if (bill.status === 'paid' || bill.status === 'approved') {
      return { label: 'ชำระเสร็จสิ้น', color: 'bg-green-100 text-green-700', icon: '✅' };
    }
    const overdue = getOverdueDays(bill.due_date);
    if (overdue > 0) {
      return { label: `เกินกำหนด ${overdue} วัน`, color: 'bg-red-100 text-red-700', icon: '🔴' };
    }
    return { label: 'รอชำระ', color: 'bg-orange-100 text-orange-700', icon: '💳' };
  };

  const canSubmitSlip = (bill: any) => {
    const payment = getPaymentForBill(bill.id);
    return !payment || (payment.status !== 'pending' && payment.status !== 'paid' && payment.status !== 'approved');
  };

  const openSlipModal = (bill: any) => {
    setSelectedBill(bill);
    setSlipAmount(bill.total_amount || bill.total || '');
    setSlipImage('');
    setSubmitSuccess(false);
    setShowSlipModal(true);
  };

  const handleSubmitSlip = async () => {
    if (!selectedBill || !slipAmount) return;
    setSubmitting(true);
    try {
      const res = await callGasApi('payments', {
        method: 'POST',
        data: {
          residentId: user?.id || user?.email || '1',
          billId: selectedBill.id,
          amount: slipAmount,
          imageUrl: slipImage || 'slip-attached',
          residentEmail: user?.email,
        },
      });
      if (res.success) {
        setSubmitSuccess(true);
        await loadData();
      }
    } catch { /* ignore */ }
    setSubmitting(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert to base64 preview (in production, upload to cloud storage)
      const reader = new FileReader();
      reader.onload = () => setSlipImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-12 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">กำลังโหลดยอดชำระ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">ยอดชำระ / ส่งสลิป</h2>
        <button onClick={loadData} className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          🔄 รีเฟรช
        </button>
      </div>

      {/* Bills List */}
      {bills.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <span className="text-4xl block mb-3">🎉</span>
          <p className="text-gray-600 font-medium">ไม่มียอดค้างชำระ</p>
          <p className="text-xs text-gray-400 mt-1">ยอดชำระจะแสดงเมื่อมีการออกบิลประจำเดือน</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bills.map((bill) => {
            const status = getStatusInfo(bill);
            const overdue = getOverdueDays(bill.due_date);
            const canSubmit = canSubmitSlip(bill);
            const payment = getPaymentForBill(bill.id);

            return (
              <div key={bill.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Bill Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-800">บิลรอบ {bill.period || '—'}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">บิล #{bill.id} | กำหนดชำระ: {bill.due_date || '—'}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                  </div>

                  {/* Overdue Warning */}
                  {overdue > 0 && !payment && (
                    <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <span className="text-red-500 text-sm">⚠️</span>
                      <p className="text-xs text-red-600 font-medium">เกินกำหนดชำระมาแล้ว {overdue} วัน กรุณาชำระโดยเร็ว</p>
                    </div>
                  )}

                  {/* Amount Breakdown */}
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">💧 ค่าน้ำ</span>
                      <span className="font-medium">฿{Number(bill.water_amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">⚡ ค่าไฟ</span>
                      <span className="font-medium">฿{Number(bill.electricity_amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-1.5 flex justify-between text-sm">
                      <span className="font-bold text-gray-700">รวมทั้งหมด</span>
                      <span className="font-bold text-blue-600 text-base">฿{Number(bill.total_amount || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Payment Info (if submitted) */}
                  {payment && payment.status === 'pending' && (
                    <div className="mt-3 p-2.5 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-700 font-medium">⏳ ส่งสลิปแล้ว — อยู่ระหว่างรอตรวจสอบ</p>
                      <p className="text-[10px] text-yellow-600 mt-0.5">ส่งเมื่อ: {payment.createdAt || '—'} | ยอด: ฿{Number(payment.amount || 0).toLocaleString()}</p>
                    </div>
                  )}

                  {payment && (payment.status === 'paid' || payment.status === 'approved') && (
                    <div className="mt-3 p-2.5 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-700 font-medium">✅ การชำระเสร็จสิ้น — ตรวจสอบแล้ว</p>
                      <p className="text-[10px] text-green-600 mt-0.5">ยอดที่ชำระ: ฿{Number(payment.amount || 0).toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {canSubmit && (
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => openSlipModal(bill)}
                      className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      📎 ส่งสลิปชำระเงิน
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Slip Upload Modal */}
      {showSlipModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSlipModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {submitSuccess ? (
              /* Success State */
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">ส่งสลิปเรียบร้อย!</h3>
                <p className="text-sm text-gray-500 mb-6">สลิปของคุณอยู่ระหว่างรอตรวจสอบ<br/>ระบบจะแจ้งผลทางอีเมลหลังตรวจเสร็จ</p>
                <button
                  onClick={() => setShowSlipModal(false)}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition"
                >
                  ปิด
                </button>
              </div>
            ) : (
              /* Upload Form */
              <>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">📎 ส่งสลิปชำระเงิน</h3>
                  <button onClick={() => setShowSlipModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  {/* Bill Info */}
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-medium">บิลรอบ {selectedBill?.period || '—'}</p>
                    <p className="text-lg font-bold text-blue-700 mt-1">฿{Number(selectedBill?.total_amount || 0).toLocaleString()}</p>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">จำนวนเงินที่ชำระ (บาท)</label>
                    <input
                      type="number"
                      value={slipAmount}
                      onChange={e => setSlipAmount(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">แนบรูปสลิปการโอน</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-blue-300 transition cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {slipImage ? (
                        <div>
                          <img src={slipImage} alt="slip preview" className="max-h-48 mx-auto rounded-lg mb-2" />
                          <p className="text-xs text-green-600 font-medium">✅ แนบรูปแล้ว (กดเพื่อเปลี่ยน)</p>
                        </div>
                      ) : (
                        <div>
                          <span className="text-3xl block mb-2">📷</span>
                          <p className="text-sm text-gray-500">กดเพื่อเลือกรูปสลิป</p>
                          <p className="text-xs text-gray-400 mt-1">รองรับ JPG, PNG</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="p-4 border-t border-gray-100 space-y-2">
                  <button
                    onClick={handleSubmitSlip}
                    disabled={submitting || !slipAmount}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                        กำลังส่ง...
                      </>
                    ) : (
                      '📤 ยืนยันส่งสลิป'
                    )}
                  </button>
                  <button
                    onClick={() => setShowSlipModal(false)}
                    className="w-full py-2 text-gray-500 text-sm hover:text-gray-700 transition"
                  >
                    ยกเลิก
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============ Payment History Page (ประวัติการชำระ) ============
function PaymentHistoryPage({ user }: { user: any }) {
  const [bills, setBills] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [billRes, payRes] = await Promise.all([getBills(), callGasApi('payments')]);
        if (billRes.success) setBills(billRes.data || []);
        if (payRes.success) setPayments(payRes.data || []);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  const getPaymentsForBill = (billId: string) => payments.filter(p => p.billId === billId);

  const getOverdueDays = (dueDate: string, paidDate: string) => {
    if (!dueDate || !paidDate) return 0;
    const due = new Date(dueDate);
    const paid = new Date(paidDate);
    const diff = Math.floor((paid.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear() + 543;
    const time = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    return `${day}/${month}/${year} เวลา ${time} น.`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-12 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">กำลังโหลด...</p>
      </div>
    );
  }

  // Merge bills with their payments, sort newest first
  const billsWithPayments = bills
    .map(bill => ({ ...bill, billPayments: getPaymentsForBill(bill.id) }))
    .filter(b => b.billPayments.length > 0 || b.status === 'paid' || b.status === 'approved')
    .sort((a, b) => (b.period || '').localeCompare(a.period || ''));

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">📜 ประวัติการชำระ</h2>

      {billsWithPayments.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <span className="text-4xl block mb-3">📭</span>
          <p className="text-gray-500">ยังไม่มีประวัติการชำระ</p>
        </div>
      ) : (
        <div className="space-y-4">
          {billsWithPayments.map(bill => (
            <div key={bill.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Bill Period Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-800">รอบ {bill.period || '—'}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">บิล #{bill.id} | กำหนดชำระ: {bill.due_date || '—'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">ยอดบิล</p>
                    <p className="font-bold text-blue-600">฿{Number(bill.total_amount || 0).toLocaleString()}</p>
                  </div>
                </div>
                {/* Amount breakdown */}
                <div className="flex gap-4 mt-2 text-[11px] text-gray-500">
                  <span>💧 ค่าน้ำ ฿{Number(bill.water_amount || 0).toLocaleString()}</span>
                  <span>⚡ ค่าไฟ ฿{Number(bill.electricity_amount || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Records */}
              <div className="divide-y divide-gray-50">
                {bill.billPayments.length > 0 ? (
                  bill.billPayments.map((pay: any, idx: number) => {
                    const lateDays = getOverdueDays(bill.due_date, pay.createdAt);
                    return (
                      <div key={pay.id || idx} className="px-4 py-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-gray-700">ครั้งที่ {idx + 1}</span>
                              {pay.status === 'paid' || pay.status === 'approved' ? (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-medium rounded-full">✅ ชำระแล้ว</span>
                              ) : pay.status === 'pending' ? (
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-medium rounded-full">⏳ รอตรวจสอบ</span>
                              ) : (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-full">{pay.status}</span>
                              )}
                            </div>
                            <div className="space-y-0.5 text-[11px] text-gray-500">
                              <p>📅 ชำระเมื่อ: <span className="text-gray-700 font-medium">{formatDateTime(pay.createdAt)}</span></p>
                              {pay.updatedAt && pay.updatedAt !== pay.createdAt && (
                                <p>🔍 ตรวจสอบเมื่อ: <span className="text-gray-700 font-medium">{formatDateTime(pay.updatedAt)}</span></p>
                              )}
                              {lateDays > 0 && (
                                <p className="text-red-500 font-medium">⚠️ ชำระล่าช้า {lateDays} วัน (จากกำหนด {bill.due_date})</p>
                              )}
                              {lateDays === 0 && pay.createdAt && (
                                <p className="text-green-600">✓ ชำระตรงเวลา</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <p className="text-lg font-bold text-gray-800">฿{Number(pay.amount || 0).toLocaleString()}</p>
                            <p className="text-[10px] text-gray-400">ID: {pay.id}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-400">
                    ไม่พบรายการชำระสำหรับบิลนี้
                  </div>
                )}
              </div>

              {/* Summary */}
              {bill.billPayments.length > 0 && (
                <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">ชำระทั้งหมด {bill.billPayments.length} ครั้ง</span>
                  <span className="text-sm font-bold text-gray-700">
                    รวม ฿{bill.billPayments.reduce((s: number, p: any) => s + Number(p.amount || 0), 0).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ Water Record Page (บันทึกค่าน้ำ) ============
// Mock residents data (in production, fetch from API / admin settings)
const MOCK_RESIDENTS = [
  { id: 'H01', name: 'สมชาย', surname: 'ใจดี', type: 'house', prevWater: 1520, prevElec: 3200 },
  { id: 'H02', name: 'วิไล', surname: 'สุขสม', type: 'house', prevWater: 980, prevElec: 2800 },
  { id: 'H03', name: 'ประสิทธิ์', surname: 'ดีงาม', type: 'house', prevWater: 1200, prevElec: 1500 },
  { id: 'H04', name: '—', surname: '—', type: 'house', prevWater: 0, prevElec: 0, vacant: true },
  { id: 'F01', name: 'สมหญิง', surname: 'สุขใจ', type: 'flat', prevWater: 450, prevElec: 1100 },
  { id: 'F02', name: 'วราภรณ์', surname: 'แก้วมณี', type: 'flat', prevWater: 520, prevElec: 900 },
  { id: 'F03', name: 'อนุชา', surname: 'พงษ์ศรี', type: 'flat', prevWater: 380, prevElec: 750 },
  { id: 'F04', name: '—', surname: '—', type: 'flat', prevWater: 0, prevElec: 0, vacant: true },
];

function WaterRecordPage() {
  const [readings, setReadings] = useState<Record<string, string>>({});
  const [waterRate, setWaterRate] = useState(18); // default, admin can change
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Try to load water rate from admin settings
    (async () => {
      try {
        const res = await callGasApi('admin/settings');
        if (res.success && res.data?.waterUnitPrice) setWaterRate(Number(res.data.waterUnitPrice));
      } catch { /* use default */ }
    })();
  }, []);

  const houses = MOCK_RESIDENTS.filter(r => r.type === 'house');
  const flats = MOCK_RESIDENTS.filter(r => r.type === 'flat');

  const getUsage = (id: string, prev: number) => {
    const current = parseInt(readings[id] || '');
    if (isNaN(current) || current < prev) return { units: 0, cost: 0 };
    const units = current - prev;
    return { units, cost: units * waterRate };
  };

  const handleSave = async () => {
    setSaving(true);
    // In production, save to API
    await new Promise(r => setTimeout(r, 500));
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderTable = (title: string, residents: typeof MOCK_RESIDENTS) => (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-700 mb-2">{title}</h3>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-500 w-16">รหัสบ้าน</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-500">ชื่อ-นามสกุล</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold text-gray-500 w-24">มิเตอร์เดิม</th>
                <th className="text-center px-3 py-2.5 text-[11px] font-semibold text-gray-500 w-28">มิเตอร์ล่าสุด</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold text-gray-500 w-16">หน่วย</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold text-gray-500 w-24">ค่าน้ำ (฿)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {residents.map(r => {
                const usage = getUsage(r.id, r.prevWater);
                return (
                  <tr key={r.id} className={`${r.vacant ? 'bg-gray-50/50 opacity-60' : 'hover:bg-blue-50/30'} transition`}>
                    <td className="px-3 py-2 font-mono text-xs text-gray-600">{r.id}</td>
                    <td className="px-3 py-2 text-gray-700">
                      {r.vacant ? <span className="text-gray-400 italic">ว่าง</span> : `${r.name} ${r.surname}`}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-gray-500">{r.prevWater}</td>
                    <td className="px-3 py-2 text-center">
                      {r.vacant ? (
                        <span className="text-gray-300">—</span>
                      ) : (
                        <input
                          type="number"
                          value={readings[r.id] || ''}
                          onChange={e => setReadings(prev => ({ ...prev, [r.id]: e.target.value }))}
                          className="w-full border border-gray-200 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="—"
                          min={r.prevWater}
                        />
                      )}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-gray-600">{readings[r.id] ? usage.units : '—'}</td>
                    <td className="px-3 py-2 text-right font-bold text-blue-600">{readings[r.id] ? `฿${usage.cost.toLocaleString()}` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-blue-50/50 border-t border-gray-200">
                <td colSpan={4} className="px-3 py-2 text-right text-xs font-bold text-gray-600">รวม</td>
                <td className="px-3 py-2 text-right font-mono font-bold text-gray-700">
                  {residents.reduce((s, r) => s + getUsage(r.id, r.prevWater).units, 0)}
                </td>
                <td className="px-3 py-2 text-right font-bold text-blue-700">
                  ฿{residents.reduce((s, r) => s + getUsage(r.id, r.prevWater).cost, 0).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">💧 บันทึกค่าน้ำ</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">อัตราค่าน้ำ: ฿{waterRate}/หน่วย</span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? 'กำลังบันทึก...' : saved ? '✅ บันทึกแล้ว' : '💾 บันทึก'}
          </button>
        </div>
      </div>

      {renderTable('🏠 บ้านพักครู', houses)}
      {renderTable('🏢 แฟลต', flats)}
    </div>
  );
}

// ============ Electricity Record Page (บันทึกค่าไฟ) ============
function ElectricityRecordPage() {
  const [readings, setReadings] = useState<Record<string, string>>({});
  const [elecRate, setElecRate] = useState(7.5);
  const [peaTotal, setPeaTotal] = useState('');
  const [lostHouse, setLostHouse] = useState('');
  const [lostFlat, setLostFlat] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const VACANT_FEE = 9; // ค่าอ่านมิเตอร์ 9 บาท

  useEffect(() => {
    (async () => {
      try {
        const res = await callGasApi('admin/settings');
        if (res.success && res.data?.electricUnitPrice) setElecRate(Number(res.data.electricUnitPrice));
      } catch { /* use default */ }
    })();
  }, []);

  const houses = MOCK_RESIDENTS.filter(r => r.type === 'house');
  const flats = MOCK_RESIDENTS.filter(r => r.type === 'flat');

  const getCost = (id: string, resident: typeof MOCK_RESIDENTS[0]) => {
    if (resident.vacant) return { amount: VACANT_FEE, rounded: VACANT_FEE };
    const val = parseFloat(readings[id] || '');
    if (isNaN(val)) return { amount: 0, rounded: 0 };
    const raw = val * elecRate;
    const rounded = Math.ceil(raw);
    return { amount: raw, rounded };
  };

  const allResidents = [...houses, ...flats];
  const totalCollected = allResidents.reduce((s, r) => s + getCost(r.id, r).rounded, 0);
  const peaTotalNum = parseFloat(peaTotal) || 0;
  const lostHouseNum = parseFloat(lostHouse) || 0;
  const lostFlatNum = parseFloat(lostFlat) || 0;
  const roundingDiff = totalCollected - peaTotalNum;

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderTable = (title: string, residents: typeof MOCK_RESIDENTS) => (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-700 mb-2">{title}</h3>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-500 w-16">รหัสบ้าน</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-500">ชื่อ-นามสกุล</th>
                <th className="text-center px-3 py-2.5 text-[11px] font-semibold text-gray-500 w-28">ค่าไฟ (หน่วย)</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold text-gray-500 w-24">ยอดเงิน (฿)</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold text-gray-500 w-24">ปัดขึ้น (฿)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {residents.map(r => {
                const cost = getCost(r.id, r);
                return (
                  <tr key={r.id} className={`${r.vacant ? 'bg-gray-50/50' : 'hover:bg-yellow-50/30'} transition`}>
                    <td className="px-3 py-2 font-mono text-xs text-gray-600">{r.id}</td>
                    <td className="px-3 py-2 text-gray-700">
                      {r.vacant ? (
                        <span className="text-gray-400 italic">ว่าง <span className="text-[10px]">(ค่าอ่านมิเตอร์ ฿{VACANT_FEE})</span></span>
                      ) : `${r.name} ${r.surname}`}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {r.vacant ? (
                        <span className="text-gray-300">—</span>
                      ) : (
                        <input
                          type="number"
                          value={readings[r.id] || ''}
                          onChange={e => {
                            const v = e.target.value;
                            // Allow only integers - round up if decimal
                            if (v.includes('.')) {
                              setReadings(prev => ({ ...prev, [r.id]: Math.ceil(parseFloat(v)).toString() }));
                            } else {
                              setReadings(prev => ({ ...prev, [r.id]: v }));
                            }
                          }}
                          onBlur={e => {
                            const v = parseFloat(e.target.value);
                            if (!isNaN(v) && v !== Math.ceil(v)) {
                              setReadings(prev => ({ ...prev, [r.id]: Math.ceil(v).toString() }));
                            }
                          }}
                          className="w-full border border-gray-200 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-yellow-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="หน่วย"
                          min="0"
                          step="1"
                        />
                      )}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-gray-500 text-xs">
                      {r.vacant ? `${VACANT_FEE}.00` : (readings[r.id] ? cost.amount.toFixed(2) : '—')}
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-yellow-600">
                      {r.vacant ? `฿${VACANT_FEE}` : (readings[r.id] ? `฿${cost.rounded.toLocaleString()}` : '—')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-yellow-50/50 border-t border-gray-200">
                <td colSpan={3} className="px-3 py-2 text-right text-xs font-bold text-gray-600">รวม</td>
                <td className="px-3 py-2 text-right text-xs font-mono text-gray-500">
                  {residents.reduce((s, r) => s + getCost(r.id, r).amount, 0).toFixed(2)}
                </td>
                <td className="px-3 py-2 text-right font-bold text-yellow-700">
                  ฿{residents.reduce((s, r) => s + getCost(r.id, r).rounded, 0).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">⚡ บันทึกค่าไฟ</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">อัตราค่าไฟ: ฿{elecRate}/หน่วย</span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 text-xs bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
          >
            {saving ? 'กำลังบันทึก...' : saved ? '✅ บันทึกแล้ว' : '💾 บันทึก'}
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
        <p className="font-medium">📌 หมายเหตุ:</p>
        <p>• กรอกตัวเลขหน่วยค่าไฟเท่านั้น (จำนวนเต็ม ปัดเศษขึ้นอัตโนมัติ)</p>
        <p>• หน่วยพักอาศัยที่ไม่มีผู้พักอาศัย คิดค่าอ่านมิเตอร์จากการไฟฟ้า ฿{VACANT_FEE}</p>
      </div>

      {renderTable('🏠 บ้านพักครู', houses)}
      {renderTable('🏢 แฟลต', flats)}

      {/* Bottom 3 fields + difference */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <h3 className="text-sm font-bold text-gray-700">📊 สรุปค่าไฟและส่วนต่าง</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">1. ยอดค่าไฟรวมจากการไฟฟ้า (฿)</label>
            <input
              type="number"
              value={peaTotal}
              onChange={e => setPeaTotal(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">2. Lost บ้านพักครู (฿)</label>
            <input
              type="number"
              value={lostHouse}
              onChange={e => setLostHouse(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">3. Lost แฟลต (฿)</label>
            <input
              type="number"
              value={lostFlat}
              onChange={e => setLostFlat(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
          </div>
        </div>

        {/* Auto calculated summary */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">ยอดค่าไฟจากการไฟฟ้า</span>
            <span className="font-medium">฿{peaTotalNum.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">ยอดเรียกเก็บทั้งหมด (ปัดเศษขึ้น)</span>
            <span className="font-medium">฿{totalCollected.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Lost บ้านพักครู + แฟลต</span>
            <span className="font-medium">฿{(lostHouseNum + lostFlatNum).toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between text-sm">
            <span className="font-bold text-gray-700">💡 ส่วนต่างจากการปัดเศษ</span>
            <span className={`font-bold text-lg ${roundingDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {roundingDiff >= 0 ? '+' : ''}฿{roundingDiff.toLocaleString()}
            </span>
          </div>
        </div>
        <p className="text-[10px] text-gray-400">* ส่วนต่าง = ยอดเรียกเก็บ(ปัดขึ้น) − ยอดจากการไฟฟ้า</p>
      </div>
    </div>
  );
}

// ============ Generic Data Page ============
function DataPage({ title, fetchFn, columns, labels }: {
  title: string;
  fetchFn: () => Promise<any>;
  columns: string[];
  labels: string[];
}) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchFn();
      if (res.success && Array.isArray(res.data)) {
        setData(res.data);
      } else if (res.success && res.data) {
        setData(Array.isArray(res.data) ? res.data : [res.data]);
      } else {
        setData([]);
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <button onClick={loadData} className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          🔄 รีเฟรช
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">กำลังโหลดข้อมูล...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <p className="text-red-500 text-sm mb-3">{error}</p>
          <button onClick={loadData} className="text-sm text-blue-600 hover:underline">ลองอีกครั้ง</button>
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <span className="text-4xl block mb-3">📭</span>
          <p className="text-gray-500">ยังไม่มีข้อมูล</p>
          <p className="text-xs text-gray-400 mt-1">ข้อมูลจะปรากฏเมื่อมีการเพิ่มรายการใน Google Sheets</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {labels.map((label, i) => (
                    <th key={i} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-gray-50 transition">
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {col === 'status' ? (
                          <StatusBadge status={row[col]} />
                        ) : col === 'amount' || col === 'total' || col === 'water' || col === 'electric' || col === 'commonFee' ? (
                          <span>฿{Number(row[col] || 0).toLocaleString()}</span>
                        ) : col === 'imageUrl' && row[col] ? (
                          <a href={row[col]} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs">ดูรูป</a>
                        ) : (
                          String(row[col] ?? '—')
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
            แสดง {data.length} รายการ
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    paid: 'bg-green-100 text-green-700',
    verified: 'bg-green-100 text-green-700',
    approved: 'bg-green-100 text-green-700',
    completed: 'bg-green-100 text-green-700',
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    unpaid: 'bg-red-100 text-red-700',
    overdue: 'bg-red-100 text-red-700',
    rejected: 'bg-red-100 text-red-700',
  };
  const c = colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-600';
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c}`}>{status || '—'}</span>;
}

// ============ Profile Page ============
function ProfilePage({ user }: { user: any }) {
  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h2 className="text-lg font-bold text-gray-800">ข้อมูลส่วนตัว</h2>
      <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
            {(user?.Name || 'U')[0]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{user?.Title}{user?.Name} {user?.Surname}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <InfoField label="บทบาท" value={user?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้พักอาศัย'} />
          <InfoField label="อีเมล" value={user?.email || '—'} />
          <InfoField label="ชื่อ" value={`${user?.Title || ''}${user?.Name || ''}`} />
          <InfoField label="นามสกุล" value={user?.Surname || '—'} />
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-700">{value}</p>
    </div>
  );
}

// ============ Forms Page ============
function FormsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">แบบฟอร์ม</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: '📄', title: 'แบบฟอร์มขอเข้าพัก', desc: 'ยื่นคำขอเข้าพักอาศัยในบ้านพักครู' },
          { icon: '📋', title: 'แบบฟอร์มย้ายออก', desc: 'แจ้งย้ายออกจากบ้านพักครู' },
          { icon: '🔧', title: 'แบบฟอร์มแจ้งซ่อม', desc: 'แจ้งปัญหาที่ต้องการซ่อมแซม' },
          { icon: '📝', title: 'แบบฟอร์มขอใช้พื้นที่', desc: 'ขออนุญาตใช้พื้นที่ส่วนกลาง' },
        ].map((form, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition cursor-pointer">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{form.icon}</span>
              <div>
                <h4 className="font-bold text-gray-800">{form.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{form.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Admin Settings Page ============
function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await callGasApi('admin/settings');
        if (res.success) setSettings(res.data);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-lg font-bold text-gray-800">ตั้งค่าระบบ</h2>
      {loading ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SettingField label="ค่าน้ำ (บาท/หน่วย)" value={settings?.waterUnitPrice ?? 20} />
            <SettingField label="ค่าไฟ (บาท/หน่วย)" value={settings?.electricUnitPrice ?? 7.5} />
            <SettingField label="ค่าส่วนกลาง (บาท/เดือน)" value={settings?.commonFee ?? 500} />
            <SettingField label="กำหนดชำระ (วัน)" value={settings?.dueDays ?? 15} />
          </div>
          <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
            * การตั้งค่าจะมีผลกับการคำนวณบิลในเดือนถัดไป
          </p>
        </div>
      )}
    </div>
  );
}

function SettingField({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        type="text"
        defaultValue={value}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

// ============ Login Form ============
function LoginForm({ onLogin, isLoading }: { onLogin: (e: string, p: string) => void; isLoading: boolean }) {
  const [email, setEmail] = useState('pongsatorn.b@ppk.ac.th');
  const [password, setPassword] = useState('ppk2569');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">อีเมล</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">รหัสผ่าน</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 text-sm"
      >
        {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
      </button>
    </form>
  );
}
