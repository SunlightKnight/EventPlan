import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import stringsIT from "./it/strings.json"
import stringsEN from "./en/strings.json"
import { NativeModules, Platform } from 'react-native';

export const resources = {
  it: { translation: stringsIT },
  en: { translation: stringsEN }
}

const locale =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale
    : NativeModules.I18nManager.localeIdentifier;

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: locale.substring(0, 2),
  fallbackLng: "it",
  interpolation: {
    escapeValue: false,
    },
 });

export default i18n;