import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button'
import { Layout, ViewComponents, TextComponents, Components, Spacing } from '@/styles'


export const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLang(lng);
  };

  useEffect(() => {
    setLang(i18n.language);
  }, [i18n.language]);

  return (
    <View style={[Layout.column, ViewComponents.card]}>
      <Text style={[TextComponents.titleText]}>
        {t('me.languageSwitcher.title')}
      </Text>

      <View style={Layout.buttonRow}>
        <Button
          style={ViewComponents.buttonInRow}
          onPress={() => changeLanguage('en')}
        >
          {t('me.languageSwitcher.buttonEnglish')}
        </Button>

        <Button
          style={ViewComponents.buttonInRow}
          onPress={() => changeLanguage('zh')}
        >
          {t('me.languageSwitcher.buttonChineseSimp')}
        </Button>
      </View>
    </View>
  );
}
