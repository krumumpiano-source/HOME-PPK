/**
 * HOME PPK - งานส่งเสริม กำกับ ดูแล และพัฒนาบ้านพักครู 2569
 * ออกแบบและพัฒนาโดย ครูพงศธร โพธิแก้ว
 */

import React, { useState, useEffect } from 'react';
import {
  authenticateUser,
  getBills,
  getPaymentSlips,
  getRequests,
  getExpenses,
  getRegulations,
  callGasApi,
} from '../services/api';

// ============ Types ============
export type PageId =
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
  | 'admin-settings'
  | 'send-slip';
interface MenuItem {
  id: PageId;
  icon: string;
  label: string;
  group: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', icon: '🏠', label: 'หน้าแรก', group: 'หลัก' },
  { id: 'payments', icon: '💳', label: 'ยอดชำระ / ส่งสลิป', group: 'การเงิน' },
  { id: 'payment-history', icon: '📜', label: 'ประวัติการชำระ', group: 'การเงิน' },
  { id: 'slip-verify', icon: '✅', label: 'ตรวจสลิป', group: 'การเงิน' },
  { id: 'water-record', icon: '💧', label: 'บันทึกค่าน้ำ', group: 'สาธารณูปโภค' },
  { id: 'electricity-record', icon: '⚡', label: 'บันทึกค่าไฟ', group: 'สาธารณูปโภค' },
  { id: 'monthly-bill', icon: '📋', label: 'แจ้งยอดประจำเดือน', group: 'สาธารณูปโภค' },
  { id: 'requests', icon: '🔧', label: 'แจ้งซ่อม / คำร้อง', group: 'คำร้อง' },
  { id: 'forms', icon: '📝', label: 'แบบฟอร์ม', group: 'คำร้อง' },
  { id: 'admin-requests', icon: '📬', label: 'จัดการคำร้อง', group: 'คำร้อง' },
  { id: 'accounting', icon: '📊', label: 'บัญชีรายรับรายจ่าย', group: 'บัญชี' },
  { id: 'expenses', icon: '💰', label: 'ค่าใช้จ่ายอื่น ๆ', group: 'บัญชี' },
  { id: 'disbursement', icon: '💸', label: 'เบิกจ่าย', group: 'บัญชี' },
  { id: 'regulations', icon: '📖', label: 'ระเบียบ / ประกาศ', group: 'อื่น ๆ' },
  { id: 'profile', icon: '👤', label: 'ข้อมูลส่วนตัว', group: 'อื่น ๆ' },
  { id: 'admin-settings', icon: '⚙️', label: 'ตั้งค่าระบบ', group: 'อื่น ๆ' },
  { id: 'send-slip', icon: '📤', label: 'ส่งสลิป', group: 'การเงิน' },
];

export { MENU_ITEMS };

// ============ Main App ============
export default function App() {
  const [user, setUser] = useState<any>(null);
  const [page, setPage] = useState<PageId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const navigateTo = (p: PageId) => {
    setPage(p);
    setSidebarOpen(false);
  };

  const handleLogin = async (email: string, password: string) => {
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await authenticateUser(email, password);
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        setLoginError(res.error || 'เข้าสู่ระบบไม่สำเร็จ');
      }
    } catch {
      setLoginError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
    setLoginLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    setPage('dashboard');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl text-white font-bold">H</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">HOME PPK</h1>
            <p className="text-sm text-gray-500 mt-1">ระบบจัดการบ้านพักครู</p>
          </div>
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">{loginError}</div>
          )}
          <LoginForm onLogin={handleLogin} isLoading={loginLoading} />
        </div>
      </div>
    );
  }

  const groups = [...new Set(MENU_ITEMS.map(m => m.group))];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-200 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
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
                    page === item.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm flex-shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
              {(user?.Name || 'U')[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-700 truncate">{user?.Title}{user?.Name}</p>
              <p className="text-[10px] text-gray-400">{user?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้พัก'}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition p-1" title="ออกจากระบบ">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-base font-bold text-gray-800">
              {MENU_ITEMS.find(m => m.id === page)?.icon}{' '}
              {MENU_ITEMS.find(m => m.id === page)?.label || 'หน้าแรก'}
            </h1>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <PageContent page={page} user={user} navigateTo={navigateTo} />
        </main>
        <footer className="bg-white border-t border-gray-100 px-4 py-2 text-center">
          <p className="text-[11px] text-gray-400">HOME PPK v1.0.0 | ออกแบบและพัฒนาโดย ครูพงศธร โพธิแก้ว</p>
        </footer>
      </div>
    </div>
  );
}

// ============ Page Content Router ============
function PageContent({ page, user, navigateTo }: { page: PageId; user: any; navigateTo: (page: PageId) => void }) {
  switch (page) {
    case 'dashboard': return <DashboardPage user={user} navigateTo={navigateTo} />;
    case 'payments': return <PaymentsPage user={user} />;
    case 'monthly-bill': return <MonthlyBillPage />;
    case 'payment-history': return <PaymentHistoryPage />;
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
    case 'send-slip': return <SendSlipPage />;
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

// ============ Electricity Record Page (บันทึกค่าไฟ) ============
function ElectricityRecordPage() {
  const { residents, loading: residentsLoading } = useResidents();
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [peaTotal, setPeaTotal] = useState('');
  const [lossHouse, setLossHouse] = useState('');
  const [lossFlat, setLossFlat] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() + 543);
  const [exporting, setExporting] = useState(false);

  const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + 543 - i);

  if (residentsLoading) {
    return (
      <div className="bg-white rounded-xl p-12 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-yellow-200 border-t-yellow-600 rounded-full mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">กำลังโหลดข้อมูลผู้พัก...</p>
      </div>
    );
  }

  const houses = residents.filter(r => r.type === 'house');
  const flats = residents.filter(r => r.type === 'flat');

  // ปัดเศษขึ้นเป็นจำนวนเต็มเสมอ
  const getRoundedAmount = (id: string): number => {
    const val = parseFloat(amounts[id] || '');
    if (isNaN(val) || val <= 0) return 0;
    return Math.ceil(val);
  };

  const getRoundedLossHouse = Math.ceil(parseFloat(lossHouse) || 0);
  const getRoundedLossFlat = Math.ceil(parseFloat(lossFlat) || 0);
  const peaTotalNum = parseFloat(peaTotal) || 0;

  const houseTotalCollected = houses.reduce((s, r) => s + getRoundedAmount(r.id), 0);
  const flatTotalCollected = flats.reduce((s, r) => s + getRoundedAmount(r.id), 0);
  const totalCollected = houseTotalCollected + flatTotalCollected + getRoundedLossHouse + getRoundedLossFlat;
  const roundingDifference = totalCollected - peaTotalNum;

  const handleAmountChange = (id: string, value: string) => {
    // อนุญาตให้กรอกตัวเลขและจุดทศนิยม แต่แสดงปัดเศษขึ้นในตาราง
    const v = value.replace(/[^0-9.]/g, '');
    setAmounts(prev => ({ ...prev, [id]: v }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // บันทึกข้อมูลค่าไฟ
      await callGasApi('electricity/save', {
        method: 'POST',
        data: {
          month: selectedMonth,
          year: selectedYear,
          peaTotal: peaTotalNum,
          lossHouse: getRoundedLossHouse,
          lossFlat: getRoundedLossFlat,
          amounts: Object.fromEntries(
            Object.entries(amounts).map(([id, val]) => [id, Math.ceil(parseFloat(val) || 0)])
          ),
          totalCollected,
          roundingDifference,
        },
      });

      // บันทึกส่วนต่างจากการปัดเศษเป็นรายรับอัตโนมัติ
      if (roundingDifference !== 0) {
        await callGasApi('expenses', {
          method: 'POST',
          data: {
            description: `ส่วนต่างจากการปัดเศษค่าไฟ ${thaiMonths[selectedMonth - 1]} ${selectedYear}`,
            amount: roundingDifference,
            category: 'รายรับ-ส่วนต่างปัดเศษ',
            date: new Date().toISOString().split('T')[0],
            type: 'income',
          },
        });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* ignore */ }
    setSaving(false);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await callGasApi('electricity/export', {
        method: 'POST',
        data: { month: selectedMonth, year: selectedYear },
      });
      alert(`ส่งออกข้อมูลค่าไฟ ${thaiMonths[selectedMonth - 1]} ${selectedYear} เรียบร้อย`);
    } catch {
      alert('ไม่สามารถส่งออกข้อมูลได้');
    }
    setExporting(false);
  };

  const renderTable = (title: string, residents: Resident[]) => {
    const totalCost = residents.reduce((s, r) => s + getRoundedAmount(r.id), 0);

    return (
      <div className="mb-6">
        <h3 className="text-base font-bold text-gray-800 mb-3">{title}</h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b-2 border-yellow-200">
                  <th className="text-center px-2 py-3 font-bold text-gray-700 border-r border-gray-200 w-14">เลขที่</th>
                  <th className="text-left px-2 py-3 font-bold text-gray-700 border-r border-gray-200 w-48">ชื่อผู้พักอาศัย</th>
                  <th className="text-right px-3 py-3 font-bold text-gray-700 w-36">ค่าไฟ (฿)</th>
                </tr>
              </thead>
              <tbody>
                {residents.map((r, idx) => {
                  const rounded = getRoundedAmount(r.id);
                  return (
                    <tr key={r.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-yellow-50/30 transition`}>
                      <td className="text-center px-2 py-2.5 font-mono text-gray-600 border-r border-gray-100">{r.id}</td>
                      <td className="px-2 py-2.5 text-gray-800 border-r border-gray-100 max-w-[192px] truncate" title={r.name}>{r.name}</td>
                      <td className="text-center px-1 py-1.5">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={amounts[r.id] || ''}
                          onChange={e => handleAmountChange(r.id, e.target.value)}
                          onBlur={() => {
                            const val = parseFloat(amounts[r.id] || '');
                            if (!isNaN(val) && val > 0 && val !== Math.ceil(val)) {
                              setAmounts(prev => ({ ...prev, [r.id]: String(Math.ceil(val)) }));
                            }
                          }}
                          className="w-full px-2 py-1.5 text-center font-mono border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                          placeholder="0"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gradient-to-r from-yellow-100 to-orange-100 border-t-2 border-yellow-300 font-bold">
                  <td colSpan={2} className="text-right px-3 py-3 text-gray-800">รวม</td>
                  <td className="text-right px-4 py-3 text-lg text-yellow-700">฿{totalCost.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800">⚡ บันทึกค่าไฟ</h2>
          <p className="text-xs text-gray-500 mt-1">กรอกจำนวนเงินค่าไฟรายหลัง (หากกรอกทศนิยม ระบบจะปัดเศษขึ้นอัตโนมัติ)</p>
          
          {/* Month/Year Selector */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-gray-500">เลือกเดือน:</span>
            <select 
              value={selectedMonth} 
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {thaiMonths.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <select 
              value={selectedYear} 
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm font-medium bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition shadow-sm disabled:opacity-50"
          >
            {saving ? '⏳ กำลังบันทึก...' : saved ? '✅ บันทึกแล้ว' : '💾 บันทึก'}
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-5 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm disabled:opacity-50"
          >
            {exporting ? '⏳ กำลังส่งออก...' : '📊 รายงาน'}
          </button>
        </div>
      </div>

      {/* ค่าไฟรวมจาก PEA + Loss */}
      <div className="bg-white rounded-xl border-2 border-blue-200 p-5 shadow-sm">
        <h3 className="text-base font-bold text-gray-800 mb-4">💡 ยอดค่าไฟจากการไฟฟ้า (PEA) และ Loss</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-2">ค่าไฟรวมที่เรียกเก็บจาก PEA (บาท)</label>
            <input
              type="text"
              inputMode="decimal"
              value={peaTotal}
              onChange={e => setPeaTotal(e.target.value.replace(/[^0-9.]/g, ''))}
              className="w-full px-4 py-3 text-lg font-mono border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
              placeholder="0.00"
            />
            {peaTotalNum > 0 && (
              <p className="text-[10px] text-blue-500 mt-1">฿{peaTotalNum.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-2">Loss บ้านพักครู (บาท)</label>
            <input
              type="text"
              inputMode="decimal"
              value={lossHouse}
              onChange={e => setLossHouse(e.target.value.replace(/[^0-9.]/g, ''))}
              className="w-full px-4 py-3 text-lg font-mono border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-orange-50"
              placeholder="0"
            />

          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-2">Loss แฟลต (บาท)</label>
            <input
              type="text"
              inputMode="decimal"
              value={lossFlat}
              onChange={e => setLossFlat(e.target.value.replace(/[^0-9.]/g, ''))}
              className="w-full px-4 py-3 text-lg font-mono border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-orange-50"
              placeholder="0"
            />

          </div>
        </div>
      </div>

      {/* ตารางบ้านพักครู */}
      {renderTable('🏠 บ้านพักครู', houses)}

      {/* ตารางแฟลต */}
      {renderTable('🏢 แฟลต', flats)}

      {/* สรุปยอดรวม */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">📊 สรุปยอดรวมทั้งหมด</h3>
          <div className="text-xs opacity-90">{thaiMonths[selectedMonth - 1]} {selectedYear}</div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs opacity-90 mb-1">บ้านพักครู</div>
            <div className="text-xl font-bold">฿{houseTotalCollected.toLocaleString()}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs opacity-90 mb-1">แฟลต</div>
            <div className="text-xl font-bold">฿{flatTotalCollected.toLocaleString()}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs opacity-90 mb-1">Loss (บ้าน + แฟลต)</div>
            <div className="text-xl font-bold">฿{(getRoundedLossHouse + getRoundedLossFlat).toLocaleString()}</div>
            <div className="text-[10px] opacity-75">บ้าน ฿{getRoundedLossHouse.toLocaleString()} | แฟลต ฿{getRoundedLossFlat.toLocaleString()}</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 border-2 border-white/30">
            <div className="text-xs opacity-90 mb-1">เรียกเก็บรวมทั้งหมด</div>
            <div className="text-2xl font-bold">฿{totalCollected.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* ส่วนต่างจากการปัดเศษ */}
      {peaTotalNum > 0 && (
        <div className={`rounded-xl border-2 p-5 shadow-sm ${roundingDifference >= 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
          <h3 className="text-base font-bold text-gray-800 mb-4">🔄 ส่วนต่างจากการปัดเศษ</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">ยอด PEA ที่เรียกเก็บ</span>
              <span className="font-bold font-mono">฿{peaTotalNum.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">ยอดเรียกเก็บจากผู้พัก (ปัดเศษขึ้น)</span>
              <span className="font-bold font-mono">฿{(houseTotalCollected + flatTotalCollected).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Loss รวม (บ้าน + แฟลต)</span>
              <span className="font-bold font-mono">฿{(getRoundedLossHouse + getRoundedLossFlat).toLocaleString()}</span>
            </div>
            <div className="border-t-2 border-dashed pt-3 mt-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-gray-800">ส่วนต่างจากการปัดเศษ</span>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    สูตร: (ยอดเรียกเก็บทุกหลัง + Loss ทั้งหมด) − ยอด PEA
                  </p>
                </div>
                <span className={`text-2xl font-bold font-mono ${roundingDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {roundingDifference >= 0 ? '+' : ''}฿{roundingDifference.toLocaleString()}
                </span>
              </div>
              {roundingDifference !== 0 && (
                <div className={`mt-3 p-2.5 rounded-lg text-xs font-medium ${roundingDifference > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {roundingDifference > 0
                    ? `💰 ส่วนต่าง ฿${roundingDifference.toLocaleString()} จะถูกบันทึกเป็น "รายรับ" ในบัญชีรายรับรายจ่ายโดยอัตโนมัติ`
                    : `⚠️ ยอดเรียกเก็บน้อยกว่ายอด PEA ฿${Math.abs(roundingDifference).toLocaleString()} กรุณาตรวจสอบข้อมูล`
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ Monthly Bill Page (แจ้งยอดประจำเดือน) ============
function MonthlyBillPage() {
  const { residents, loading: residentsLoading } = useResidents();
  const [waterReadings, setWaterReadings] = useState<Record<string, string>>({});
  const [elecAmounts, setElecAmounts] = useState<Record<string, string>>({});
  const [vacantIds, setVacantIds] = useState<Set<string>>(new Set());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() + 543);
  const [waterRate, setWaterRate] = useState(18);
  const [sharing, setSharing] = useState(false);
  const COMMON_FEE = 110;

  const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + 543 - i);

  useEffect(() => {
    (async () => {
      try {
        const res = await callGasApi('admin/settings');
        if (res.success && res.data?.waterUnitPrice) setWaterRate(Number(res.data.waterUnitPrice));
      } catch { /* use default */ }
    })();
  }, []);

  if (residentsLoading) {
    return (
      <div className="bg-white rounded-xl p-12 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">กำลังโหลดข้อมูลผู้พัก...</p>
      </div>
    );
  }

  const houses = residents.filter(r => r.type === 'house');
  const flats = residents.filter(r => r.type === 'flat');

  const getWaterUnits = (id: string) => {
    const r = residents.find(res => res.id === id);
    const current = parseInt(waterReadings[id] || '');
    const prev = r?.waterPrev ?? 0;
    if (isNaN(current) || current < prev) return 0;
    return current - prev;
  };

  const getWaterCost = (id: string) => getWaterUnits(id) * waterRate;
  const getElecCost = (id: string) => Math.ceil(parseFloat(elecAmounts[id] || '') || 0);
  const getCommonFee = (id: string) => vacantIds.has(id) ? 0 : COMMON_FEE;
  const getTotal = (id: string) => getWaterCost(id) + getElecCost(id) + getCommonFee(id);

  const toggleVacant = (id: string) => {
    setVacantIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // ฟังก์ชันสร้างรูปแบบตารางเพื่อแชร์
  const generateShareImage = async (type: 'house' | 'flat') => {
    setSharing(true);
    const targetResidents = type === 'house' ? houses : flats;
    const title = type === 'house' ? 'บ้านพักครู' : 'แฟลต';
    const canvas = document.createElement('canvas');
    const padding = 30;
    const headerH = 80;
    const colHeaderH = 45;
    const rowH = 38;
    const footerH = 50;
    const w = 950;
    const totalRows = targetResidents.length;
    const h = headerH + colHeaderH + (totalRows * rowH) + footerH + padding * 2;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Header
    ctx.fillStyle = type === 'house' ? '#1e40af' : '#7c3aed';
    ctx.fillRect(0, 0, w, headerH);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Sarabun", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`📋 แจ้งยอดชำระประจำเดือน ${thaiMonths[selectedMonth - 1]} ${selectedYear}`, w / 2, 32);
    ctx.font = '16px "Sarabun", sans-serif';
    ctx.fillText(`${type === 'house' ? '🏠' : '🏢'} ${title} | อัตราค่าน้ำ ฿${waterRate}/หน่วย | ค่าส่วนกลาง ฿${COMMON_FEE}`, w / 2, 60);

    // Table columns
    const cols = [
      { label: '#', x: padding, w: 40, align: 'center' as CanvasTextAlign },
      { label: 'ชื่อผู้พัก', x: padding + 40, w: 200, align: 'left' as CanvasTextAlign },
      { label: 'มิเตอร์น้ำ(ก่อน)', x: padding + 240, w: 100, align: 'center' as CanvasTextAlign },
      { label: 'มิเตอร์น้ำ(ล่าสุด)', x: padding + 340, w: 100, align: 'center' as CanvasTextAlign },
      { label: 'ค่าน้ำ', x: padding + 440, w: 90, align: 'right' as CanvasTextAlign },
      { label: 'ค่าไฟ', x: padding + 530, w: 90, align: 'right' as CanvasTextAlign },
      { label: 'ส่วนกลาง', x: padding + 620, w: 80, align: 'right' as CanvasTextAlign },
      { label: 'รวม', x: padding + 700, w: 100, align: 'right' as CanvasTextAlign },
    ];

    // Column headers background
    const tableY = headerH;
    ctx.fillStyle = type === 'house' ? '#dbeafe' : '#ede9fe';
    ctx.fillRect(0, tableY, w, colHeaderH);
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 13px "Sarabun", sans-serif';
    cols.forEach(col => {
      ctx.textAlign = col.align;
      const tx = col.align === 'right' ? col.x + col.w - 5 : col.align === 'center' ? col.x + col.w / 2 : col.x + 5;
      ctx.fillText(col.label, tx, tableY + 28);
    });

    // Rows
    let grandWater = 0, grandElec = 0, grandCommon = 0, grandTotal = 0;
    targetResidents.forEach((r, idx) => {
      const y = tableY + colHeaderH + idx * rowH;
      ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f9fafb';
      ctx.fillRect(0, y, w, rowH);

      // Grid line
      ctx.strokeStyle = '#e5e7eb';
      ctx.beginPath();
      ctx.moveTo(0, y + rowH);
      ctx.lineTo(w, y + rowH);
      ctx.stroke();

      const res = residents.find(x => x.id === r.id)!;
      const waterUnits = getWaterUnits(r.id);
      const waterCost = getWaterCost(r.id);
      const elecCost = getElecCost(r.id);
      const commonFee = getCommonFee(r.id);
      const total = waterCost + elecCost + commonFee;
      grandWater += waterCost;
      grandElec += elecCost;
      grandCommon += commonFee;
      grandTotal += total;

      const prev = res.waterPrev;
      const current = parseInt(waterReadings[r.id] || '') || 0;

      ctx.fillStyle = vacantIds.has(r.id) ? '#9ca3af' : '#374151';
      ctx.font = '13px "Sarabun", sans-serif';

      const rowData = [
        r.id,
        (r.name + (r.coResidents ? ',' + r.coResidents : '')).substring(0, 25),
        prev.toLocaleString(),
        waterReadings[r.id] ? current.toLocaleString() : '—',
        waterCost > 0 ? `฿${waterCost.toLocaleString()}` : '—',
        elecCost > 0 ? `฿${elecCost.toLocaleString()}` : '—',
        vacantIds.has(r.id) ? 'ว่าง' : `฿${commonFee}`,
        total > 0 ? `฿${total.toLocaleString()}` : '—',
      ];

      cols.forEach((col, ci) => {
        ctx.textAlign = col.align;
        const tx = col.align === 'right' ? col.x + col.w - 5 : col.align === 'center' ? col.x + col.w / 2 : col.x + 5;
        if (ci === 7 && total > 0) {
          ctx.font = 'bold 14px "Sarabun", sans-serif';
          ctx.fillStyle = '#dc2626';
        }
        ctx.fillText(rowData[ci], tx, y + 24);
        ctx.font = '13px "Sarabun", sans-serif';
        ctx.fillStyle = vacantIds.has(r.id) ? '#9ca3af' : '#374151';
      });
    });

    // Footer total row
    const footerY = tableY + colHeaderH + totalRows * rowH;
    ctx.fillStyle = type === 'house' ? '#1e40af' : '#7c3aed';
    ctx.fillRect(0, footerY, w, footerH);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Sarabun", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('รวมทั้งหมด', padding + 5, footerY + 30);
    ctx.textAlign = 'right';
    ctx.fillText(`฿${grandWater.toLocaleString()}`, padding + 440 + 90 - 5, footerY + 30);
    ctx.fillText(`฿${grandElec.toLocaleString()}`, padding + 530 + 90 - 5, footerY + 30);
    ctx.fillText(`฿${grandCommon.toLocaleString()}`, padding + 620 + 80 - 5, footerY + 30);
    ctx.font = 'bold 18px "Sarabun", sans-serif';
    ctx.fillText(`฿${grandTotal.toLocaleString()}`, padding + 700 + 100 - 5, footerY + 32);

    // Convert to blob & download
    canvas.toBlob(blob => {
      if (!blob) { setSharing(false); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `แจ้งยอด_${title}_${thaiMonths[selectedMonth - 1]}${selectedYear}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setSharing(false);
    }, 'image/png');
  };

  const renderBillTable = (title: string, tableResidents: Resident[], type: 'house' | 'flat') => {
    const totalWater = tableResidents.reduce((s, r) => s + getWaterCost(r.id), 0);
    const totalElec = tableResidents.reduce((s, r) => s + getElecCost(r.id), 0);
    const totalCommon = tableResidents.reduce((s, r) => s + getCommonFee(r.id), 0);
    const totalAll = tableResidents.reduce((s, r) => s + getTotal(r.id), 0);

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-gray-800">{title}</h3>
          <button
            onClick={() => generateShareImage(type)}
            disabled={sharing}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition shadow-sm text-white ${
              type === 'house' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
            } disabled:opacity-50`}
          >
            {sharing ? '⏳ กำลังสร้างรูป...' : `📸 แชร์รูป${type === 'house' ? 'บ้าน' : 'แฟลต'}`}
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className={`bg-gradient-to-r ${type === 'house' ? 'from-blue-50 to-indigo-50 border-b-2 border-blue-200' : 'from-purple-50 to-violet-50 border-b-2 border-purple-200'}`}>
                  <th className="text-center px-2 py-3 font-bold text-gray-700 border-r border-gray-200 w-12">#</th>
                  <th className="text-left px-2 py-3 font-bold text-gray-700 border-r border-gray-200 w-44">ชื่อผู้พัก</th>
                  <th className="text-center px-2 py-3 font-bold text-gray-700 border-r border-gray-200 w-24">มิเตอร์น้ำ<br/><span className="text-[10px] font-normal">(ก่อน)</span></th>
                  <th className="text-center px-2 py-3 font-bold text-gray-700 border-r border-gray-200 w-24">มิเตอร์น้ำ<br/><span className="text-[10px] font-normal">(ล่าสุด)</span></th>
                  <th className="text-right px-2 py-3 font-bold text-gray-700 border-r border-gray-200 w-20">ค่าน้ำ</th>
                  <th className="text-right px-2 py-3 font-bold text-gray-700 border-r border-gray-200 w-20">ค่าไฟ</th>
                  <th className="text-right px-2 py-3 font-bold text-gray-700 border-r border-gray-200 w-20">ส่วนกลาง</th>
                  <th className="text-right px-3 py-3 font-bold text-gray-700 w-24">รวม</th>
                </tr>
              </thead>
              <tbody>
                {tableResidents.map((r, idx) => {
                  const waterUnits = getWaterUnits(r.id);
                  const waterCost = getWaterCost(r.id);
                  const elecCost = getElecCost(r.id);
                  const commonFee = getCommonFee(r.id);
                  const total = getTotal(r.id);
                  const isVacant = vacantIds.has(r.id);
                  return (
                    <tr key={r.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} ${isVacant ? 'opacity-50' : ''} hover:bg-blue-50/30 transition`}>
                      <td className="text-center px-2 py-2 font-mono text-gray-600 border-r border-gray-100">{r.id}</td>
                      <td className="px-2 py-2 border-r border-gray-100">
                        <div className="flex items-center gap-1">
                          <button onClick={() => toggleVacant(r.id)} className={`flex-shrink-0 w-5 h-5 rounded border text-[10px] flex items-center justify-center ${isVacant ? 'bg-gray-300 border-gray-400 text-white' : 'bg-green-100 border-green-400 text-green-700'}`} title={isVacant ? 'ว่าง' : 'มีผู้พัก'}>
                            {isVacant ? '✕' : '✓'}
                          </button>
                          <span className="text-gray-800 truncate max-w-[160px]" title={r.name + (r.coResidents ? ',' + r.coResidents : '')}>
                            {r.name}{r.coResidents ? <span className="text-[10px] text-gray-400">,{r.coResidents}</span> : ''}
                          </span>
                        </div>
                      </td>
                      <td className="text-center px-2 py-2 font-mono text-gray-500 border-r border-gray-100 text-xs">{r.waterPrev.toLocaleString()}</td>
                      <td className="text-center px-1 py-1 border-r border-gray-100">
                        <input type="text" inputMode="numeric" value={waterReadings[r.id] || ''}
                          onChange={e => setWaterReadings(prev => ({ ...prev, [r.id]: e.target.value.replace(/[^0-9]/g, '') }))}
                          className="w-full px-1 py-1 text-center font-mono text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                          placeholder="กรอก" />
                      </td>
                      <td className="text-right px-2 py-2 font-mono text-blue-600 border-r border-gray-100 text-xs">
                        {waterCost > 0 ? `฿${waterCost.toLocaleString()}` : '—'}
                        {waterUnits > 0 && <div className="text-[9px] text-gray-400">{waterUnits} หน่วย</div>}
                      </td>
                      <td className="text-right px-1 py-1 border-r border-gray-100">
                        <input type="text" inputMode="decimal" value={elecAmounts[r.id] || ''}
                          onChange={e => setElecAmounts(prev => ({ ...prev, [r.id]: e.target.value.replace(/[^0-9.]/g, '') }))}
                          className="w-full px-1 py-1 text-right font-mono text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
                          placeholder="0" />
                      </td>
                      <td className="text-right px-2 py-2 font-mono text-gray-600 border-r border-gray-100 text-xs">
                        {isVacant ? <span className="text-red-400">ว่าง</span> : `฿${COMMON_FEE}`}
                      </td>
                      <td className="text-right px-3 py-2 font-bold text-red-600 text-sm">
                        {total > 0 ? `฿${total.toLocaleString()}` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className={`font-bold ${type === 'house' ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-t-2 border-blue-300' : 'bg-gradient-to-r from-purple-100 to-violet-100 border-t-2 border-purple-300'}`}>
                  <td colSpan={4} className="text-right px-3 py-3 text-gray-800">รวม</td>
                  <td className="text-right px-2 py-3 text-blue-700">฿{totalWater.toLocaleString()}</td>
                  <td className="text-right px-2 py-3 text-yellow-700">฿{totalElec.toLocaleString()}</td>
                  <td className="text-right px-2 py-3 text-gray-700">฿{totalCommon.toLocaleString()}</td>
                  <td className="text-right px-3 py-3 text-lg text-red-700">฿{totalAll.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const grandWater = residents.reduce((s, r) => s + getWaterCost(r.id), 0);
  const grandElec = residents.reduce((s, r) => s + getElecCost(r.id), 0);
  const grandCommon = residents.reduce((s, r) => s + getCommonFee(r.id), 0);
  const grandTotal = residents.reduce((s, r) => s + getTotal(r.id), 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800">📋 แจ้งยอดประจำเดือน</h2>
          <p className="text-xs text-gray-500 mt-1">สรุปยอดค่าน้ำ ค่าไฟ ค่าส่วนกลาง — เซฟรูปเพื่อแชร์ในไลน์กลุ่ม</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-gray-500">เลือกเดือน:</span>
            <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}
              className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400">
              {thaiMonths.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}
              className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400">
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <span className="text-[10px] text-gray-400 ml-2">ค่าน้ำ ฿{waterRate}/หน่วย | ส่วนกลาง ฿{COMMON_FEE}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">ยอดรวมทั้งหมด</div>
          <div className="text-2xl font-bold text-red-600">฿{grandTotal.toLocaleString()}</div>
          <div className="text-[10px] text-gray-400">น้ำ ฿{grandWater.toLocaleString()} | ไฟ ฿{grandElec.toLocaleString()} | ส่วนกลาง ฿{grandCommon.toLocaleString()}</div>
        </div>
      </div>

      {/* ตารางบ้านพัก */}
      {renderBillTable('🏠 บ้านพักครู', houses, 'house')}

      {/* ตารางแฟลต */}
      {renderBillTable('🏢 แฟลต', flats, 'flat')}

      {/* สรุปยอดรวม */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">📊 สรุปยอดรวมทั้งหมด</h3>
          <div className="text-xs opacity-90">{thaiMonths[selectedMonth - 1]} {selectedYear}</div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs opacity-90 mb-1">ค่าน้ำ</div>
            <div className="text-xl font-bold">฿{grandWater.toLocaleString()}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs opacity-90 mb-1">ค่าไฟ</div>
            <div className="text-xl font-bold">฿{grandElec.toLocaleString()}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs opacity-90 mb-1">ค่าส่วนกลาง</div>
            <div className="text-xl font-bold">฿{grandCommon.toLocaleString()}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs opacity-90 mb-1">จำนวนผู้พัก</div>
            <div className="text-xl font-bold">{residents.length - vacantIds.size} / {residents.length}</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 border-2 border-white/30">
            <div className="text-xs opacity-90 mb-1">ยอดรวมทั้งหมด</div>
            <div className="text-2xl font-bold">฿{grandTotal.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* ปุ่มแชร์รูป */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => generateShareImage('house')} disabled={sharing}
          className="flex-1 max-w-xs px-6 py-4 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
          📸 <span>เซฟรูปแจ้งยอด<br/><span className="text-xs font-normal opacity-90">🏠 บ้านพักครู</span></span>
        </button>
        <button onClick={() => generateShareImage('flat')} disabled={sharing}
          className="flex-1 max-w-xs px-6 py-4 text-sm font-bold bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
          📸 <span>เซฟรูปแจ้งยอด<br/><span className="text-xs font-normal opacity-90">🏢 แฟลต</span></span>
        </button>
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

// ============ Payment History Page (ประวัติการชำระ) ============
function PaymentHistoryPage() {
  return <div>Payment History Page</div>;
}

// ============ Water Record Page (บันทึกค่าน้ำ) ============
function WaterRecordPage() {
  const { residents, loading: residentsLoading } = useResidents();
  const [readings, setReadings] = useState<Record<string, string>>({});
  const [waterRate, setWaterRate] = useState(18);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() + 543);
  const [exporting, setExporting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [prevReadings, setPrevReadings] = useState<Record<string, number>>({});

  const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + 543 - i);

  useEffect(() => {
    (async () => {
      try {
        const res = await callGasApi('admin/settings');
        if (res.success && res.data?.waterUnitPrice) setWaterRate(Number(res.data.waterUnitPrice));
      } catch { /* use default */ }
    })();
  }, []);

  useEffect(() => {
    const initial: Record<string, number> = {};
    residents.forEach(r => { initial[r.id] = r.waterPrev; });
    setPrevReadings(initial);
  }, [residents]);

  if (residentsLoading) {
    return (
      <div className="bg-white rounded-xl p-12 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">กำลังโหลดข้อมูลผู้พัก...</p>
      </div>
    );
  }

  const houses = residents.filter(r => r.type === 'house');
  const flats = residents.filter(r => r.type === 'flat');

  const getPrevReading = (id: string) => prevReadings[id] ?? residents.find(r => r.id === id)?.waterPrev ?? 0;

  const getUsage = (id: string) => {
    const prev = getPrevReading(id);
    const current = parseInt(readings[id] || '');
    if (isNaN(current) || current < prev) return { units: 0, cost: 0, valid: false };
    const units = current - prev;
    return { units, cost: units * waterRate, valid: true };
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await callGasApi('water-record', {
        method: 'POST',
        data: {
          month: selectedMonth,
          year: selectedYear,
          readings: Object.fromEntries(
            Object.entries(readings).map(([id, val]) => [id, parseInt(val) || 0])
          ),
          prevReadings,
          waterRate,
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* ignore */ }
    setSaving(false);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await callGasApi('water-record/export', { method: 'POST', data: { month: selectedMonth, year: selectedYear } });
      alert(`ส่งออกข้อมูลค่าน้ำ ${thaiMonths[selectedMonth - 1]} ${selectedYear} เรียบร้อย`);
    } catch {
      alert('ไม่สามารถส่งออกข้อมูลได้');
    }
    setExporting(false);
  };

  const renderTable = (title: string, tableResidents: Resident[]) => {
    const totalUnits = tableResidents.reduce((s, r) => s + getUsage(r.id).units, 0);
    const totalCost = tableResidents.reduce((s, r) => s + getUsage(r.id).cost, 0);

    return (
      <div className="mb-6">
        <h3 className="text-base font-bold text-gray-800 mb-3">{title}</h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200">
                  <th className="text-center px-2 py-3 font-bold text-gray-700 border-r border-gray-200 w-14">เลขที่</th>
                  <th className="text-left px-2 py-3 font-bold text-gray-700 border-r border-gray-200 w-48">ชื่อผู้พักอาศัย</th>
                  <th className="text-center px-2 py-3 font-bold text-gray-700 border-r border-gray-200 w-28">เลขมิเตอร์ก่อนหน้า</th>
                  <th className="text-center px-2 py-3 font-bold text-gray-700 border-r border-gray-200 w-28">เลขมิเตอร์ล่าสุด</th>
                  <th className="text-center px-2 py-3 font-bold text-gray-700 border-r border-gray-200 w-20">หน่วย</th>
                  <th className="text-right px-3 py-3 font-bold text-gray-700 w-28">รวมค่าน้ำ</th>
                </tr>
              </thead>
              <tbody>
                {tableResidents.map((r, idx) => {
                  const usage = getUsage(r.id);
                  const prevVal = getPrevReading(r.id);
                  return (
                    <tr key={r.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-blue-50/30 transition`}>
                      <td className="text-center px-2 py-2.5 font-mono text-gray-600 border-r border-gray-100">{r.id}</td>
                      <td className="px-2 py-2.5 text-gray-800 border-r border-gray-100 max-w-[192px] truncate" title={r.name}>{r.name}{r.coResidents ? `,${r.coResidents}` : ''}</td>
                      <td className="text-center px-1 py-1.5 border-r border-gray-100">
                        {editMode ? (
                          <input type="text" inputMode="numeric" pattern="[0-9]*" value={prevVal}
                            onChange={e => {
                              const v = e.target.value.replace(/[^0-9]/g, '');
                              setPrevReadings(prev => ({ ...prev, [r.id]: parseInt(v) || 0 }));
                            }}
                            className="w-full px-2 py-1.5 text-center font-mono border border-orange-400 rounded bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        ) : (
                          <span className="font-mono text-gray-600">{prevVal.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="text-center px-1 py-1.5 border-r border-gray-100">
                        <input type="text" inputMode="numeric" pattern="[0-9]*" value={readings[r.id] || ''}
                          onChange={e => {
                            const v = e.target.value.replace(/[^0-9]/g, '');
                            setReadings(prev => ({ ...prev, [r.id]: v }));
                          }}
                          className="w-full px-2 py-1.5 text-center font-mono border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                          placeholder="กรอก"
                        />
                      </td>
                      <td className="text-center px-2 py-2.5 font-mono font-medium text-gray-700 border-r border-gray-100">
                        {usage.valid ? usage.units.toLocaleString() : '—'}
                      </td>
                      <td className="text-right px-3 py-2.5 font-bold text-blue-600">
                        {usage.valid ? `฿${usage.cost.toLocaleString()}` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gradient-to-r from-blue-100 to-cyan-100 border-t-2 border-blue-300 font-bold">
                  <td colSpan={4} className="text-right px-3 py-3 text-gray-800">รวม</td>
                  <td className="text-center px-2 py-3 font-mono text-lg text-gray-800 border-r border-blue-200">{totalUnits.toLocaleString()}</td>
                  <td className="text-right px-4 py-3 text-lg text-blue-700">฿{totalCost.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const allUnits = [...houses, ...flats].reduce((s, r) => s + getUsage(r.id).units, 0);
  const allCost = [...houses, ...flats].reduce((s, r) => s + getUsage(r.id).cost, 0);
  const houseUnits = houses.reduce((s, r) => s + getUsage(r.id).units, 0);
  const houseCost = houses.reduce((s, r) => s + getUsage(r.id).cost, 0);
  const flatUnits = flats.reduce((s, r) => s + getUsage(r.id).units, 0);
  const flatCost = flats.reduce((s, r) => s + getUsage(r.id).cost, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800">💧 บันทึกค่าน้ำ</h2>
          <p className="text-xs text-gray-500 mt-1">อัตราค่าน้ำ: <span className="font-bold text-blue-600">฿{waterRate}/หน่วย</span></p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-gray-500">เลือกเดือน:</span>
            <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}
              className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
              {thaiMonths.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}
              className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-gray-500">ยอดรวมทั้งหมด</div>
            <div className="text-2xl font-bold text-blue-600">฿{allCost.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400">{allUnits.toLocaleString()} หน่วย</div>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => setEditMode(!editMode)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition shadow-sm ${
                editMode ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}>
              {editMode ? '🔒 ปิดแก้ไข' : '✏️ แก้ไขมิเตอร์เก่า'}
            </button>
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-50">
              {saving ? '⏳ กำลังบันทึก...' : saved ? '✅ บันทึกแล้ว' : '💾 บันทึก'}
            </button>
            <button onClick={handleExport} disabled={exporting}
              className="px-5 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm disabled:opacity-50">
              {exporting ? '⏳ กำลังส่งออก...' : '📊 รายงาน'}
            </button>
          </div>
        </div>
      </div>

      {editMode && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
          <p className="text-sm text-orange-800">
            <strong>⚠️ โหมดแก้ไข:</strong> คุณสามารถแก้ไขเลขมิเตอร์ก่อนหน้าได้ในคอลัมน์ที่ 3 (พื้นหลังสีส้ม)
          </p>
        </div>
      )}

      {renderTable('🏠 บ้านพักครู', houses)}
      {renderTable('🏢 แฟลต', flats)}

      {/* Grand Total Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">📊 สรุปยอดรวมทั้งหมด</h3>
          <div className="text-xs opacity-90">{thaiMonths[selectedMonth - 1]} {selectedYear}</div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs opacity-90 mb-1">บ้านพักครู</div>
            <div className="text-xl font-bold">฿{houseCost.toLocaleString()}</div>
            <div className="text-[10px] opacity-75">{houseUnits.toLocaleString()} หน่วย</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs opacity-90 mb-1">แฟลต</div>
            <div className="text-xl font-bold">฿{flatCost.toLocaleString()}</div>
            <div className="text-[10px] opacity-75">{flatUnits.toLocaleString()} หน่วย</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 border-2 border-white/30">
            <div className="text-xs opacity-90 mb-1">รวมทั้งหมด</div>
            <div className="text-2xl font-bold">฿{allCost.toLocaleString()}</div>
            <div className="text-[10px] opacity-75">{allUnits.toLocaleString()} หน่วย</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Resident Data (fallback เมื่อ API ไม่พร้อม) ============
interface Resident {
  id: string;
  name: string;
  type: 'house' | 'flat';
  unit: string;
  waterPrev: number;
  elecPrev: number;
  coResidents: string;
}

const FALLBACK_RESIDENTS: Resident[] = [
  // ===== บ้านพักครู (house) =====
  { id: '1', name: 'บ้านพักนักการ', type: 'house', unit: 'H1', waterPrev: 162755, elecPrev: 0, coResidents: '' },
  { id: '2', name: 'นางสาวพิมพ์ใจ สมศรี', type: 'house', unit: 'H2', waterPrev: 2175, elecPrev: 2156, coResidents: '' },
  { id: '3', name: 'นางบุษบา อริยะคำ', type: 'house', unit: 'H3', waterPrev: 1999, elecPrev: 1982, coResidents: '' },
  { id: '4', name: 'นายรณชัย วรรณรัตน์', type: 'house', unit: 'H4', waterPrev: 1149, elecPrev: 1116, coResidents: '' },
  { id: '5', name: 'นางสาวปิโยรส ใจเอื้อ', type: 'house', unit: 'H5', waterPrev: 1552, elecPrev: 1549, coResidents: 'นางสาวชุลีมาศ คำบุญเรือง' },
  { id: '6', name: 'บ้านพักครูจีน', type: 'house', unit: 'H6', waterPrev: 899, elecPrev: 695, coResidents: '' },
  { id: '7', name: 'นางสาวรัตนา สบายจิตร', type: 'house', unit: 'H7', waterPrev: 1837, elecPrev: 1825, coResidents: '' },
  { id: '8', name: 'นายเจษฏาวัชส์ เสียงเย็น', type: 'house', unit: 'H8', waterPrev: 1696, elecPrev: 1682, coResidents: 'นายอดิสรณ์ ปินตามูล' },
  { id: '9', name: 'นายพงศธร โพธิแก้ว', type: 'house', unit: 'H9', waterPrev: 1834, elecPrev: 1808, coResidents: '' },
  { id: '10', name: 'นางจีรพา กันทา', type: 'house', unit: 'H10', waterPrev: 2450, elecPrev: 2409, coResidents: '' },
  { id: '11', name: 'น.ส.ลัดดาวัลย์ บุญคุ้ม', type: 'house', unit: 'H11', waterPrev: 1716, elecPrev: 1700, coResidents: '' },
  { id: '12', name: 'น.ส.ญาณกร ศรีชาติ', type: 'house', unit: 'H12', waterPrev: 1418, elecPrev: 1405, coResidents: '' },
  { id: '13', name: 'นางดารากร จางคพิเชียร', type: 'house', unit: 'H13', waterPrev: 1909, elecPrev: 1881, coResidents: '' },
  { id: '14', name: 'นางสาวเจนจิรา จันทร์หล้า', type: 'house', unit: 'H14', waterPrev: 2270, elecPrev: 2249, coResidents: '' },
  { id: '15', name: 'น.ส.กานท์ชญา อ่อนนวล', type: 'house', unit: 'H15', waterPrev: 3214, elecPrev: 3192, coResidents: '' },
  { id: '16', name: 'นางดวงจันทร์ หลายแห่ง', type: 'house', unit: 'H16', waterPrev: 1179, elecPrev: 1164, coResidents: '' },
  { id: '17', name: 'นายเฉลิมพล ปามา', type: 'house', unit: 'H17', waterPrev: 1835, elecPrev: 1826, coResidents: 'นายกัญจน์ณัฏฐ์ โลกคำลือ' },
  // ===== แฟลต (flat) =====
  { id: 'F1', name: 'นายณัฐพงศ์ คำเป็ง', type: 'flat', unit: 'F1', waterPrev: 756, elecPrev: 753, coResidents: '' },
  { id: 'F2', name: 'น.ส.กันยา กันทะ', type: 'flat', unit: 'F2', waterPrev: 1590, elecPrev: 0, coResidents: '' },
  { id: 'F3', name: 'น.ส.ขวัญดาว วงษ์พันธ์', type: 'flat', unit: 'F3', waterPrev: 1501, elecPrev: 0, coResidents: 'น.ส.อรอนงค์ ยามเลย' },
  { id: 'F4', name: 'แฟลตครูญี่ปุ่น', type: 'flat', unit: 'F4', waterPrev: 749, elecPrev: 0, coResidents: '' },
  { id: 'F5', name: 'นายสุมงคล จ่อยพิรัตน์', type: 'flat', unit: 'F5', waterPrev: 1656, elecPrev: 0, coResidents: '' },
  { id: 'F6', name: 'นายทรงศักดิ์ แก้ววิลัย', type: 'flat', unit: 'F6', waterPrev: 46, elecPrev: 0, coResidents: '' },
  { id: 'F7', name: 'นายพงศกร หงษ์ระนัย', type: 'flat', unit: 'F7', waterPrev: 1255, elecPrev: 0, coResidents: '' },
  { id: 'F8', name: 'นายพงศกร วังศิลา', type: 'flat', unit: 'F8', waterPrev: 1029, elecPrev: 0, coResidents: 'นายอภินันท์ ผ่องกมล' },
  { id: 'F9', name: 'น.ส.สุกันญา ตามสมัย', type: 'flat', unit: 'F9', waterPrev: 50, elecPrev: 0, coResidents: 'น.ส.กัญนิกา สีเสน' },
  { id: 'F10', name: 'น.ส.ดารากรณ์ นาคสุกเอี่ยม', type: 'flat', unit: 'F10', waterPrev: 57, elecPrev: 0, coResidents: '' },
  { id: 'F11', name: 'นางสาวกนกพร ภู่ปรางทอง', type: 'flat', unit: 'F11', waterPrev: 917, elecPrev: 0, coResidents: '' },
  { id: 'F12', name: 'นายราชนุชา อินจันทร์', type: 'flat', unit: 'F12', waterPrev: 31, elecPrev: 0, coResidents: '' },
  { id: 'F13', name: 'น.ส.จริญญา ศิลธรรม', type: 'flat', unit: 'F13', waterPrev: 1728, elecPrev: 0, coResidents: 'น.ส.ปาริฉัตร์ คันธิสา' },
  { id: 'F14', name: 'นายจิรพันธ์ จันจินะ', type: 'flat', unit: 'F14', waterPrev: 1294, elecPrev: 0, coResidents: 'นายอุดม พลทองมาก' },
  { id: 'F15', name: 'นางสาวรุจิรา กาจินา', type: 'flat', unit: 'F15', waterPrev: 1349, elecPrev: 0, coResidents: '' },
  { id: 'F16', name: 'นายจรูญพงษ์ ชลสินธุ์', type: 'flat', unit: 'F16', waterPrev: 36, elecPrev: 0, coResidents: '' },
];

// Hook: ดึงข้อมูลผู้พักอาศัยจาก API (fallback เป็นข้อมูลในเครื่อง)
function useResidents() {
  const [residents, setResidents] = useState<Resident[]>(FALLBACK_RESIDENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await callGasApi('users/residents');
        if (res.success && res.data && res.data.length > 0) {
          const mapped: Resident[] = res.data.map((u: any) => ({
            id: u.id || u.ID,
            name: u.name || u.Name || '',
            type: (u.type || u.Type || 'house') as 'house' | 'flat',
            unit: u.unit || u.Unit || '',
            waterPrev: Number(u.waterPrev || u.WaterPrev) || 0,
            elecPrev: Number(u.elecPrev || u.ElecPrev) || 0,
            coResidents: u.coResidents || u.CoResidents || '',
          }));
          setResidents(mapped);
        }
      } catch {
        // ใช้ FALLBACK_RESIDENTS
      }
      setLoading(false);
    })();
  }, []);

  return { residents, loading };
}

// ============ Send Slip Page ============
function SendSlipPage() {
  return <div>Send Slip Page</div>;
}
