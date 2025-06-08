import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, useAlertModal } from '@/hooks';
import { useTranslation } from 'react-i18next'
import Button from '@/components/common/Button';
import { Layout, ViewComponents, TextComponents } from '@/styles';
import { TextWithView } from '@/components/common/TextWithView';
import { InputField } from '@/components/common/InputField';
import { LanguageSwitcher } from '@/components/me/LanguageSwitcher';
import Constants from 'expo-constants';

const DEFAULT_EMAIL = 'alice@example.com';
const DEFAULT_PASSWORD = 'password123';


export default function LoginScreen() {
  const { t } = useTranslation();  // {t('auth.')}
  const { showModal } = useAlertModal();
  const router = useRouter();
  const { login, token } = useAuth();

  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      // Alert.alert('请输入用户名和密码');
      showModal(t('auth.login.alertEmptyFields'));
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
      showModal(t('auth.login.alertLoginFailed'));
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

  const version = Constants.expoConfig?.version ?? 'N/A';

  return (
    <View style={[Layout.column, Layout.center, ViewComponents.screen]}>
      <View>
        <TextWithView
          textStyle={TextComponents.titleText}
          viewStyle={[Layout.screenPadding]}
        >
          {t('common.appTitle')} - v{version}
        </TextWithView>

        <View style={[Layout.column, Layout.center, Layout.screenPadding]}>
          <Text style={TextComponents.subtitleText}>{t('auth.login.title')}</Text>
          <InputField
            label={t('auth.placeholderEmail')}
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth.placeholderEmail')}
            keyboardType="email-address"
            style={{ width: '100%'}}
          />
          <InputField
            label={t('auth.placeholderPassword')}
            value={password}
            onChangeText={setPassword}
            placeholder={t('auth.placeholderPassword')}
            secureTextEntry={true}
            style={{ width: '100%'}}
          />
          <Button onPress={handleLogin} disabled={loading} style={{ width: '100%' }}>
            {loading ? t('common.buttonLoading') : t('auth.login.buttonLogin')}
          </Button>
        </View>

        <View style={Layout.screenPadding}>
          <Button onPress={handleRegister} disabled={loading} style={[Layout.screenPadding, { width: '100%' }]}>
            {t('auth.register.title')}
          </Button>
        </View>
        
        <View style={Layout.screenPadding}>
          <Button onPress={handleForgetPassword} disabled={loading} style={[Layout.screenPadding, { width: '100%' }]}>
            {t('auth.forgetPassword.title')}
          </Button>
        </View>

        <LanguageSwitcher />

      </View>
    </View>
  );
}
