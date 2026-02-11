import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher, LanguageSwitcherDropdown } from './LanguageSwitcher';

/**
 * Complete i18n Usage Examples
 * 
 * This component demonstrates how to use translations in various scenarios:
 * - Basic text translation
 * - Dynamic content
 * - Lists with translations
 * - Form labels and validation
 * - State-dependent translations
 * - Conditional rendering
 */
export const I18nExamplesComponent: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedBill, setSelectedBill] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Example data
  const mockBills = [
    { id: '1', month: 'January', status: 'paid', amount: 5000 },
    { id: '2', month: 'February', status: 'pending', amount: 5500 },
    { id: '3', month: 'March', status: 'overdue', amount: 6000 },
  ];

  const handleValidation = () => {
    const errors: Record<string, string> = {};
    
    if (!selectedBill) {
      errors.bill = t('forms.required');
    }
    
    setFormErrors(errors);
  };

  return (
    <div className="p-8 space-y-8">
      {/* ============ SECTION 1: Basic Translation ============ */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">
          {t('common.appName')} - {t('common.description')}
        </h2>
        
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>{t('common.language')}:</strong> {i18n.language === 'th' ? 'ไทย' : 'English'}
          </p>
          <p>
            {t('auth.loginSuccess')} - {t('dashboard.welcome')}
          </p>
        </div>
      </section>

      {/* ============ SECTION 2: Language Switcher ============ */}
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">{t('common.language')} {t('common.settings')}</h3>
        
        <div className="space-y-4">
          <div>
            <p className="mb-2 font-medium">Button Group Version:</p>
            <LanguageSwitcher />
          </div>
          
          <div>
            <p className="mb-2 font-medium">Dropdown Version:</p>
            <LanguageSwitcherDropdown />
          </div>
        </div>
      </section>

      {/* ============ SECTION 3: Feature Navigation ============ */}
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">{t('navigation.dashboard')}</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: 'bills', icon: '💳' },
            { key: 'payments', icon: '💰' },
            { key: 'utilities', icon: '💧' },
            { key: 'requests', icon: '📋' },
            { key: 'users', icon: '👥' },
            { key: 'admin', icon: '⚙️' },
          ].map((nav) => (
            <div
              key={nav.key}
              className="p-4 border rounded-lg hover:shadow-md transition cursor-pointer bg-gray-50"
            >
              <div className="text-2xl mb-2">{nav.icon}</div>
              <p className="font-medium">{t(`navigation.${nav.key}`)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {t(`${nav.key}.title`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SECTION 4: Bill Management Example ============ */}
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">{t('bills.title')}</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">{t('bills.month')}</th>
                <th className="p-2 text-left">{t('bills.total')}</th>
                <th className="p-2 text-left">{t('bills.status')}</th>
                <th className="p-2 text-left">{t('common.action')}</th>
              </tr>
            </thead>
            <tbody>
              {mockBills.map((bill) => (
                <tr key={bill.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{bill.month}</td>
                  <td className="p-2">฿{bill.amount}</td>
                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        bill.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : bill.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {t(`bills.${bill.status}`)}
                    </span>
                  </td>
                  <td className="p-2 space-x-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                      {t('common.edit')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============ SECTION 5: Form with Validation ============ */}
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">{t('bills.create')}</h3>
        
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleValidation(); }}>
          <div>
            <label className="block font-medium mb-2">
              {t('bills.month')} <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedBill || ''}
              onChange={(e) => setSelectedBill(e.target.value)}
              className={`w-full p-2 border rounded ${
                formErrors.bill ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- {t('common.select')} --</option>
              {mockBills.map((bill) => (
                <option key={bill.id} value={bill.id}>
                  {bill.month}
                </option>
              ))}
            </select>
            {formErrors.bill && (
              <p className="text-red-500 text-sm mt-1">{formErrors.bill}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-2">
              {t('bills.waterCost')}
            </label>
            <input
              type="number"
              placeholder={t('bills.unitPrice')}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              {t('bills.electricCost')}
            </label>
            <input
              type="number"
              placeholder={t('bills.unitPrice')}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t('common.save')}
            </button>
            <button
              type="reset"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      </section>

      {/* ============ SECTION 6: Error & Message Examples ============ */}
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">{t('common.error')} & {t('messages')}</h3>
        
        <div className="space-y-3">
          {/* Success Message */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <p className="font-medium">✓ {t('messages.saveSuccess')}</p>
          </div>

          {/* Warning Message */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            <p className="font-medium">⚠ {t('common.warning')}</p>
            <p className="text-sm mt-1">{t('messages.confirmDelete')}</p>
          </div>

          {/* Error Message */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <p className="font-medium">✗ {t('errors.serverError')}</p>
            <button className="text-sm mt-2 underline">
              {t('errors.tryAgain')}
            </button>
          </div>

          {/* Info Message */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
            <p className="font-medium">ℹ {t('messages.loading')}</p>
          </div>
        </div>
      </section>

      {/* ============ SECTION 7: User Role-Based Content ============ */}
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">{t('users.title')}</h3>
        
        <div className="space-y-3">
          {[
            { role: 'admin', title: t('users.admin') },
            { role: 'staff', title: t('users.staff') },
            { role: 'resident', title: t('users.resident') },
          ].map((item) => (
            <div key={item.role} className="p-3 border rounded bg-gray-50">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-600 mt-1">
                {t(`users.${item.role}`)} {t('users.status')}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SECTION 8: Payment Status Example ============ */}
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">{t('payments.title')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { status: 'approved', icon: '✓', color: 'green' },
            { status: 'pending', icon: '⏳', color: 'yellow' },
            { status: 'rejected', icon: '✗', color: 'red' },
          ].map((item) => (
            <div
              key={item.status}
              className={`p-4 border rounded-lg bg-${item.color}-50 text-${item.color}-800`}
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="font-medium">{t(`payments.${item.status}`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SECTION 9: Date & Time Format ============ */}
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">{t('common.date')} & {t('common.time')}</h3>
        
        <div className="space-y-2 text-gray-700">
          <p><strong>Today:</strong> {new Date().toLocaleDateString(i18n.language === 'th' ? 'th-TH' : 'en-US')}</p>
          <p><strong>Time:</strong> {new Date().toLocaleTimeString(i18n.language === 'th' ? 'th-TH' : 'en-US')}</p>
          <p className="text-sm text-gray-500 mt-4">
            💡 {t('messages.loading')} - {t('messages.noData')}
          </p>
        </div>
      </section>

      {/* ============ CURRENT STATUS ============ */}
      <section className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow p-6 border border-blue-200">
        <h3 className="text-xl font-bold mb-4">✅ i18n Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Current Language:</p>
            <p className="text-lg text-blue-600 mt-1">
              {i18n.language === 'th' ? '🇹🇭 Thai (ไทย)' : '🇺🇸 English'}
            </p>
          </div>
          
          <div>
            <p className="font-medium">Translation Status:</p>
            <p className="text-green-600 mt-1">✓ 200+ keys translated</p>
          </div>
          
          <div>
            <p className="font-medium">Persistence:</p>
            <p className="text-green-600 mt-1">✓ Saved to localStorage</p>
          </div>
          
          <div>
            <p className="font-medium">Components Ready:</p>
            <p className="text-green-600 mt-1">✓ App.tsx, LoginForm updated</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default I18nExamplesComponent;
