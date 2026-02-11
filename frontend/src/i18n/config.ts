import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import th from './locales/th.json';
import en from './locales/en.json';

// Configuration
i18n
  // Detect user language
  .use(LanguageDetector)
  // Load translation using http backend
  .use(Backend)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources: {
      th: { translation: th },
      en: { translation: en },
    },
    fallbackLng: 'th', // Default to Thai
    debug: false,
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: [
        'localStorage',      // Check localStorage first
        'cookie',
        'htmlTag',
        'navigator',
      ],
      caches: ['localStorage', 'cookie'], // Cache to localStorage and cookie
    },
    react: {
      useSuspense: false, // Disable suspense for SSR compatibility
    },
  });

export default i18n;
