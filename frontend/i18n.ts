import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// import HttpBackend from 'i18next-http-backend';
// import zhTranslations from './locales/zh.json';
// import enTranslations from './locales/en.json';


const resources = {
  en: {
    common: require('./locales/en/common.json'),
    auth: require('./locales/en/auth.json'),
    draft: require('./locales/en/draft.json'),
    home: require('./locales/en/home.json'),
    items: require('./locales/en/items.json'),
    me: require('./locales/en/me.json')
  },
  zh: {
    common: require('./locales/zh/common.json'),
    auth: require('./locales/zh/auth.json'),
    draft: require('./locales/zh/draft.json'),
    home: require('./locales/zh/home.json'),
    items: require('./locales/zh/items.json'),
    me: require('./locales/zh/me.json')
  }
};

i18n
  // .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['zh', 'en'],
    ns: [
      'common', 
      'auth', 
      'draft', 
      'home',
      'items',
      'me'
    ],
    defaultNS: 'common',
    resources,
    // backend: {
    //   loadPath: './locales/{{lng}}/{{ns}}.json',
    // },
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    react: {
      useSuspense: false, // Disable suspense for better compatibility with React 18
    },
  });

i18n.on('loaded', (loaded) => {
  console.log('i18next resources loaded:', loaded);
  console.log('Available languages:', i18n.languages);
  console.log('Resources:', i18n.store.data);
});

i18n.on('failedLoading', (lng, ns, msg) => {
  console.error(`Failed to load ${lng} language:`, msg);
});

export default i18n;
