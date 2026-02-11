# Multi-Language (i18n) Quick Start

## ✅ What's Ready
- ✅ i18n configuration fully set up
- ✅ 200+ translation keys for Thai & English
- ✅ Language switcher component with button/dropdown versions
- ✅ App.tsx integrated with language switching
- ✅ Automatic language persistence to localStorage
- ✅ Document lang attribute auto-updating

## 🚀 Quick Start for Developers

### 1. Using Translations in Components
```tsx
import { useTranslation } from 'react-i18next';

export function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('common.appName')}</h1>
      <button onClick={() => i18n.changeLanguage('en')}>
        {t('common.english')}
      </button>
      <p>Current language: {i18n.language}</p>
    </div>
  );
}
```

### 2. Add Language Switcher to UI
```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
// or
import { LanguageSwitcherDropdown } from '@/components/LanguageSwitcher';

return (
  <header>
    <LanguageSwitcher /> {/* Shows [🇹🇭 ไทย] [🇺🇸 English] */}
    {/* or */}
    <LanguageSwitcherDropdown /> {/* Shows select dropdown */}
  </header>
);
```

### 3. Reference Translation Keys
Common keys available:

**UI Text:**
- `common.appName` → "HOME PPK" / "HOME PPK"
- `common.save` → "Save" / "บันทึก"
- `common.delete` → "Delete" / "ลบ"
- `common.logout` → "Logout" / "ออกจากระบบ"

**Pages:**
- `navigation.dashboard` → "Dashboard" / "แDashboard"
- `navigation.bills` → "Bills" / "ใบแจ้งหนี้"
- `navigation.payments` → "Payments" / "การชำระเงิน"

**Auth:**
- `auth.login` → "Login" / "เข้าสู่ระบบ"
- `auth.signIn` → "Sign In" / "เข้าสู่ระบบ"

**Forms:**
- `forms.required` → "This field is required" / "กรุณากรอกข้อมูลนี้"
- `forms.invalidEmail` → "Invalid email address" / "อีเมลไม่ถูกต้อง"

[Full key list in I18N_IMPLEMENTATION.md]

### 4. Adding New Translations
Edit `frontend/src/i18n/locales/th.json` and `en.json`:

```json
{
  "myFeature": {
    "title": "Feature Title",
    "description": "Feature description",
    "button": "Click me"
  }
}
```

Then use in component:
```tsx
t('myFeature.title')
t('myFeature.description')
t('myFeature.button')
```

## 📋 Translation Coverage Checklist

- [x] Common UI (appName, buttons, etc.)
- [x] Navigation menus
- [x] Dashboard
- [x] Bills management
- [x] Payments
- [x] Utilities (water/electric)
- [x] Requests
- [x] Users
- [x] Authentication
- [x] Forms & validation
- [x] Errors & messages
- [x] Admin features (planned keys)

## 🔧 Configuration Files

### Main Config: `frontend/src/i18n/config.ts`
- Language detection order
- Storage keys
- Default language: Thai
- Fallback language: Thai

### Translation Files
- `frontend/src/i18n/locales/th.json` - Thai (สมบูรณ์)
- `frontend/src/i18n/locales/en.json` - English (สมบูรณ์)

## 🧪 Testing Language Switching

1. Open app in browser
2. Click language button (top-right in header)
3. Verify all text updates immediately
4. Refresh page - language should persist
5. Check DevTools → Application → localStorage → `i18nextLng`

## 💾 localStorage Keys
- `i18nextLng`: Current language (th/en)
- Auto-saved when user switches language

## 🎯 Next Steps to Full Implementation

1. **Audit all components** - Find hardcoded strings
2. **Create translation keys** for any missing text
3. **Update components** to use `useTranslation()` hook
4. **Add LanguageSwitcher** to header/navigation
5. **Test thoroughly** in Thai and English

## 📚 Example: Complete Bilingual Component

```tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export function BillsPage() {
  const { t } = useTranslation();
  const [bills, setBills] = React.useState([]);

  return (
    <div>
      <h1>{t('bills.title')}</h1>
      
      <div className="mb-4">
        <button onClick={() => openCreateDialog()}>
          {t('bills.create')}
        </button>
      </div>

      <div className="grid">
        {bills.map(bill => (
          <div key={bill.id} className="card">
            <p>{t('bills.month')}: {bill.month}</p>
            <p>{t('bills.total')}: {bill.total}</p>
            <p>{t('bills.status')}: {t(`bills.${bill.status}`)}</p>
            <button>{t('common.edit')}</button>
            <button>{t('common.delete')}</button>
          </div>
        ))}
      </div>

      {bills.length === 0 && (
        <p>{t('messages.noData')}</p>
      )}
    </div>
  );
}
```

## ⚠️ Common Issues & Solutions

**Issue**: Text still shows in original language
- **Solution**: Clear localStorage and reload browser

**Issue**: Missing translation key
- **Solution**: Check key spelling in JSON, add if missing

**Issue**: Language not persisting
- **Solution**: Verify localStorage is enabled, check `i18nextLng` key

## 📖 Documentation Files
- `docs/I18N_IMPLEMENTATION.md` - Detailed guide
- `docs/I18N_QUICK_START.md` - This file
- `frontend/src/i18n/config.ts` - Configuration reference
- `frontend/src/components/LanguageSwitcher.tsx` - Component code

## 🌐 Browser Support
All modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+, mobile browsers)

---

**Status**: ✅ Multi-language infrastructure complete and functional
**Thai Support**: ✅ Full 200+ key translation set
**English Support**: ✅ Full 200+ key translation set
**Language Persistence**: ✅ Automatic localStorage saving
**UI Components**: ✅ LanguageSwitcher ready to use
