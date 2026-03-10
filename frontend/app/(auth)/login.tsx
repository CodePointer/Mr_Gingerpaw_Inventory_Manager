import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, useAlertModal } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { useModal } from '@/hooks/modal/useModal';
import { ViewComponents } from '@/styles';
import { LoadingScreen } from '@/components/common/DefaultScreen';
import { LoginScreen } from '@/components/auth/LoginScreen';

const DEFAULT_EMAIL = 'alice@example.com';
const DEFAULT_PASSWORD = 'password123';


export default function LoginPage() {
  const { t } = useTranslation(['auth', 'common']);
  const { showModal } = useAlertModal();
  const router = useRouter();
  const { open } = useModal();
  const { login, token } = useAuth();

  // const [email, setEmail] = useState(DEFAULT_EMAIL);
  // const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      // Alert.alert('请输入用户名和密码');
      showModal(t('auth:alert.emptyFields'));
      return;
    }
    setLoading(true);
    try {
      const success = await login({ email, password });
      if (success) {
        router.replace('/(tabs)/me');
      } else {
        throw new Error('Login failed');
      }
    } catch (error: any) {
      // console.error(error);
      showModal(t('auth:alert.loginFail'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.replace('/(auth)/register');
  }

  const handleForgetPassword = () => {
    router.replace('/(auth)/forgetpassword');
  }

  const handleLanguageSetting = () => {
    open('LanguageSwitch', {});
  };

  if (loading) return (<LoadingScreen />);

  return (
    <View style={ViewComponents.background}>
      <LoginScreen
        defaultEmail={DEFAULT_EMAIL}
        defaultPassword={DEFAULT_PASSWORD}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        handleForgetPassword={handleForgetPassword}
        onLanguageSetting={handleLanguageSetting}
      />
    </View>
  );
}
