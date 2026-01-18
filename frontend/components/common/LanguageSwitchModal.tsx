// components/common/LanguageSwitchModal.tsx
import { use, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ButtonGroup } from './ButtonGroup';
import { CustomModal } from './CustomModal';
import { Layout, Spacing, ViewComponents } from '@/styles';


export interface LanguageSwitchModalProps {
  visible: boolean;
  onDismiss: () => void;
}


export function LanguageSwitchModal({
  visible,
  onDismiss
}: LanguageSwitchModalProps) {
  const { t, i18n } = useTranslation(['me']);
  const [lang, setLang] = useState(i18n.language);

  const changeLanguage = () => {
    i18n.changeLanguage(lang);
    setLang(lang);
    onDismiss();
  }

  useEffect(() => {
    setLang(i18n.language);
  }, [i18n.language]);

  const getLanguageButtonMode = (buttonLang: string) => {
    return lang === buttonLang ? 'contained' : 'outlined';
  }

  return (
    <CustomModal
      visible={visible}
      onDismiss={onDismiss}
      title={t('me:language.title')}
      handleConfirm={changeLanguage}
      handleCancel={onDismiss}
      containerStyle={ViewComponents.modalContainer}
    >
      <ButtonGroup
        buttons={[
          { 
            label: t('me:language.english'),
            mode: getLanguageButtonMode('en'),
            onPress: () => setLang('en')
          },
          {
            label: t('me:language.chinese'),
            mode: getLanguageButtonMode('zh'),
            onPress: () => setLang('zh')
          }
        ]}
        style={[Layout.column, { gap: Spacing.small }]}
      />
    </CustomModal>
  );
}