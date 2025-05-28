// utils/useToast.ts
import { Alert, Platform, ToastAndroid } from 'react-native';
import { useTranslation } from 'react-i18next';

export const useToast = () => {
  const { t } = useTranslation();

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else if (Platform.OS === 'ios') {
      Alert.alert(t('alert.warning'), message);
    } else {
      alert(message);
    }
  };

  return { showToast };
};
