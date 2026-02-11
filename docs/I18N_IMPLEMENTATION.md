# Multi-Language (i18n) Implementation Guide

## Overview
The HOME PPK application now supports bilingual interface (Thai & English) using `i18next` framework with React integration.

## Technology Stack
- **i18next**: Internationalization framework
- **react-i18next**: React bindings for i18next
- **i18next-browser-languagedetector**: Automatic language detection
- **Storage**: localStorage for language preference persistence

## Architecture

### 1. i18n Configuration (`frontend/src/i18n/config.ts`)
- Initializes i18next with Thai (th) and English (en) language support
- Automatic language detection from:
  1. localStorage (user preference)
  2. Browser cookies
  3. HTML `lang` attribute
  4. Browser language settings
- Default language: Thai (th)
- Language preferences are automatically saved to localStorage

### 2. Translation Files
Located in `frontend/src/i18n/locales/`:

#### Thai Translation (`th.json`)
- Contains 200+ translation keys organized by feature:
  - `common.*`: Common UI elements (appName, buttons, etc...)
  - `navigation.*`: Navigation menu items
  - `dashboard.*`: Dashboard page strings
  - `bills.*`: Bills/invoicing strings
  - `payments.*`: Payment-related strings
  - `utilities.*`: Water/electricity readings
  - `requests.*`: Request management
  - `users.*`: User management
  - `auth.*`: Authentication screens
  - `forms.*`: Form validation messages
  - `errors.*`: Error messages
  - `messages.*`: General notifications

#### English Translation (`en.json`)
- Complete English translations of all Thai keys
- Same structure and keys as Thai version

### 3. Language Switcher Component (`frontend/src/components/LanguageSwitcher.tsx`)

Two export versions:

#### LanguageSwitcher (Default - Button Group)
```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

<LanguageSwitcher />
// Displays: [🇹🇭 ไทย] [🇺🇸 English]
```

#### LanguageSwitcherDropdown (Select Dropdown)
```tsx
import { LanguageSwitcherDropdown } from '@/components/LanguageSwitcher';

<LanguageSwitcherDropdown />
// Displays: <select>ไทย / English</select>
```

Features:
- Visual indication of current language (blue highlight)
- Smooth transition between languages
- Automatically updates document.lang attribute
- Persists language preference to localStorage
- Real-time UI update without page reload

## Usage in Components

### Basic Setup in Components
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('common.appName')}</h1>
      <button>{t('common.save')}</button>
      <p>Current: {i18n.language}</p>
    </div>
  );
}
```

### Key Points
1. **Import Hook**: `import { useTranslation } from 'react-i18next'`
2. **Destructure**: `const { t, i18n } = useTranslation()`
3. **Use Translation**: `t('key.path')` - replaces with translated string
4. **Access Language**: `i18n.language` - returns current language code (th/en)
5. **Change Language**: `i18n.changeLanguage('en')` - switches language

## Component Updates Made

### App.tsx
✅ Integrated LanguageSwitcher in both login and main screens
✅ Updated all hardcoded text to use translation keys:
- Header title: `t('common.appName')`
- Welcome message: `t('dashboard.welcome')`
- Section headers: `t('bills.title')`, `t('utilities.waterReading')`
- Buttons: `t('common.logout')`, `t('auth.signIn')`

### LoginForm Component (in App.tsx)
✅ Email label & placeholder: `t('common.email')`
✅ Password label & placeholder: `t('common.password')`
✅ Submit button: `t('auth.signIn')` / `t('messages.loading')`

## Translation Key Structure

### Naming Convention
- Use dot notation for nested keys
- Lowercase first letter
- Examples:
  - `common.appName` → App name
  - `bills.title` → Bills page title
  - `auth.signIn` → Sign in button
  - `errors.notFound` → 404 error

### Common Keys by Context

**Common UI:**
- `common.appName` - App name
- `common.save`, `.edit`, `.delete`, `.cancel`
- `common.loading` - Loading indicator
- `common.error`, `.warning`, `.success`

**Forms:**
- `forms.required` - Field validation
- `forms.submit`, `.reset`
- `forms.validation` - Validation error

**Navigation:**
- `navigation.dashboard`, `.bills`, `.payments`
- `navigation.users`, `.admin`

**Features:**
- `bills.title`, `.create`, `.edit`, `.list`
- `payments.upload`, `.list`, `.status`
- `utilities.waterReading`, `.electricReading`

## Advanced Features

### Pluralization
```tsx
t('key', { count: items.length })
// translation: { "key_one": "Item", "key_other": "Items" }
```

### Interpolation
```tsx
t('welcome', { name: 'John' })
// translation: { "welcome": "Hello {{name}}!" }
```

### Namespace Usage (if expanding)
```tsx
const { t } = useTranslation('payments');
t('title') // Instead of t('payments.title')
```

## Language Persistence

Language preference is automatically saved to localStorage under key: `i18nextLng`

```tsx
// Saved on language change
localStorage.getItem('i18nextLng') // Returns: 'th' or 'en'
```

## File Manifest

| File | Purpose |
|------|---------|
| `frontend/src/i18n/config.ts` | i18next configuration and initialization |
| `frontend/src/i18n/locales/th.json` | Thai translations (100+ keys) |
| `frontend/src/i18n/locales/en.json` | English translations (100+ keys) |
| `frontend/src/components/LanguageSwitcher.tsx` | Language switcher UI component |
| `frontend/src/main.tsx` | Updated to import i18n config |
| `frontend/src/app/App.tsx` | Updated to use useTranslation hook |

## Performance Considerations

1. **Bundle Size**: i18next adds ~30KB minified to production build
2. **Translation Files**: JSON files are bundled, not loaded at runtime
3. **Language Detection**: Happens only once at app startup
4. **Re-renders**: Only components using `useTranslation()` re-render on language change

## Next Steps for Full Implementation

To complete bilingual support across entire application:

1. **Update All Components**:
   - Use `useTranslation()` hook in all React components
   - Replace hardcoded strings with `t('key.path')`

2. **Expand Translation Keys**:
   - Add keys for all error messages
   - Add keys for all form placeholders
   - Add keys for all tooltips and help text

3. **Create Utility Wrapper** (Optional):
   ```tsx
   // useAppTranslation.ts
   export const useAppTranslation = () => {
     const { t } = useTranslation();
     return { t };
   };
   ```

4. **Add Language Switcher to Header** (Done in App.tsx):
   - Place in sticky header for easy access
   - Show current language prominently

5. **Test Translation Coverage**:
   - Use browser DevTools to check all visible text
   - Verify no hardcoded strings remain

## Troubleshooting

### Language Not Persisting
- Clear localStorage and reload
- Check `i18nextLng` key in DevTools

### Translations Show as Undefined
- Verify key path exists in JSON file
- Check for typos in key names
- Ensure JSON is valid (use JSONLint)

### MIME Type Error for JSON
- Already handled by config (uses JSON imports)
- No additional setup needed

## Browser Support
Language switching works in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS 12+, Android 6+)

## Reference Links
- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Guide](https://react.i18next.com/)
- [Language Detection Plugin](https://github.com/i18next/i18next-browser-languagedetector)
