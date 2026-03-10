import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonGroup } from '@/components/common/ButtonGroup';
import { CustomModal } from '@/components/common/CustomModal';
import { Layout, Spacing, ViewComponents } from '@/styles';


export interface LanguageSwitchModalProps {
  visible: boolean;
  onDismiss: () => void;
}


export function LanguageSwitchModal({ visible, onDismiss }: LanguageSwitchModalProps) {
  const { t, i18n } = useTranslation(['me']);
  const [lang, setLang] = useState(i18n.language);

  useEffect(() => {
    setLang(i18n.language);
  }, [i18n.language]);

  const getLanguageButtonMode = (buttonLang: string) => {
    return lang === buttonLang ? 'contained' : 'outlined';
  };

  const changeLanguage = () => {
    i18n.changeLanguage(lang);
    onDismiss();
  };

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
            onPress: () => setLang('en'),
          },
          {
            label: t('me:language.chinese'),
            mode: getLanguageButtonMode('zh'),
            onPress: () => setLang('zh'),
          },
        ]}
        style={[Layout.column, { gap: Spacing.small }]}
      />
    </CustomModal>
  );
}
