import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import zhTranslations from './locales/zh.json';
import enTranslations from './locales/en.json';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['zh', 'en'],
    ns: ['translation'],
    defaultNS: 'translation',
    resources: {
      zh: {
        translation: zhTranslations,
      },
      en: {
        translation: enTranslations,
      },
    },
    // backend: {
    //   loadPath: 'locales/{{lng}}.json',
    // },
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

i18n.on('loaded', (loaded) => {
  // console.log('i18next resources loaded:', loaded);
  // console.log('Available languages:', i18n.languages);
  // console.log('Resources:', i18n.store.data);
});

i18n.on('failedLoading', (lng, ns, msg) => {
  // console.error(`Failed to load ${lng} language:`, msg);
});

export default i18n;
