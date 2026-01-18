import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAlertModal, useAuth } from '@/hooks';
import { useTranslation } from 'react-i18next'
import { ViewComponents } from '@/styles';
import Constants from 'expo-constants';
import { LoadingScreen } from '@/components/common/DefaultScreen';
import { RegisterScreen } from '@/components/auth/RegisterScreen';


export default function RegisterPage() {
  const { t } = useTranslation(['auth', 'common']);
  const { showModal } = useAlertModal();
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (
    password: string,
    confirmPassword: string,
    username: string,
    email: string,
    securityQuestion: string,
    securityAnswer: string
  ) => {
    if (password !== confirmPassword) {
      await showModal(t('auth:alert.passwordMismatch'));
      return;
    }
    if (!username || !email || !password
      || !confirmPassword || !securityQuestion || !securityAnswer
    ) {
      await showModal(t('auth:alert.emptyFields'));
      return;
    }
    setLoading(true);
    try {
      await register({
        username, email, password,
        securityQuestion, securityAnswer
      });
      router.replace('/(tabs)/me');
    } catch (error: any) {
      console.error(error);
      showModal(t('auth:alert.registerFail'));
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = () => {
    router.push('/login');
  };

  if (loading) return <LoadingScreen />;

  return (
    <View style={[ViewComponents.background]}>
      <RegisterScreen
        handleRegister={handleRegister}
        handleBackToLogin={handleReturn}
      />
    </View>
  )
}