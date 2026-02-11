import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'th', name: t('common.thai'), flag: '🇹🇭' },
    { code: 'en', name: t('common.english'), flag: '🇺🇸' },
  ];

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    // Update HTML lang attribute
    document.documentElement.lang = lang;
  };

  return (
    <div className="language-switcher flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            i18n.language === lang.code
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          title={lang.name}
        >
          <span className="mr-1">{lang.flag}</span>
          {lang.name}
        </button>
      ))}
    </div>
  );
};

export const LanguageSwitcherDropdown: React.FC = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'th', name: t('common.thai') },
    { code: 'en', name: t('common.english') },
  ];

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  };

  return (
    <select
      value={i18n.language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
