import React from 'react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { formatDateThaiWithDayName } from '../utils/dateUtils';
import { PageId, MENU_ITEMS } from '../app/App';

interface MainLayoutProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPage: PageId;
  currentUser: any;
  navigateTo: (page: string) => void;
  handleLogout: () => void;
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  sidebarOpen,
  setSidebarOpen,
  currentPage,
  currentUser,
  navigateTo,
  handleLogout,
  children,
}) => {
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
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 px-4 py-2 text-center">
          <p className="text-[11px] text-gray-400">HOME PPK v1.0.0 | ออกแบบและพัฒนาโดย ครูพงศธร โพธิแก้ว</p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;