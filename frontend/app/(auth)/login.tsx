import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks';
import { useTranslation } from 'react-i18next'
import Button from '@/components/common/Button';
import { Layout, ViewComponents, TextComponents } from '@/styles';
import { TextWithView } from '@/components/common/TextWithView';
import { InputField } from '@/components/common/InputField';
import { LanguageSwitcher } from '@/components/me/LanguageSwitcher';

const DEFAULT_EMAIL = 'alice@example.com';
const DEFAULT_PASSWORD = 'password123';


export default function LoginScreen() {
  const { t } = useTranslation();  // {t('login.')}
  const router = useRouter();
  const { login, token } = useAuth();

  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      // Alert.alert('请输入用户名和密码');
      return;
    }

    setLoading(true);

    try {
      await login({ email, password });
      router.replace('/(tabs)/items');
    } catch (error: any) {
      console.error(error);
      // Alert.alert('登录失败', error?.response?.data?.detail || '请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[Layout.column, Layout.center, ViewComponents.screen]}>
      <View>
        <TextWithView
          textStyle={TextComponents.titleText}
          viewStyle={[Layout.screenPadding]}
        >
          {t('login.title')}
        </TextWithView>

        <View style={[Layout.column, Layout.center, Layout.screenPadding]}>
          <Text style={TextComponents.subtitleText}>{t('login.subtitle')}</Text>
          <InputField
            label={t('login.placeholderEmail')}
            value={email}
            onChangeText={setEmail}
            placeholder={t('login.placeholderEmail')}
            keyboardType="email-address"
          />
          <InputField
            label={t('login.placeholderPassword')}
            value={password}
            onChangeText={setPassword}
            placeholder={t('login.placeholderPassword')}
            secureTextEntry={true}
          />
          <Button onPress={handleLogin} disabled={loading} style={{ width: '100%' }}>
            {loading ? t('login.buttonLoading') : t('login.buttonLogin')}
          </Button>
        </View>

        <Button onPress={() => {}} disabled={loading} style={[Layout.screenPadding, { width: '100%' }]}>
          {t('login.buttonRegister')}
        </Button>

        <Button onPress={() => {}} disabled={loading} style={[Layout.screenPadding, { width: '100%' }]}>
          {t('login.buttonForgotPassword')}
        </Button>

        <LanguageSwitcher />

      </View>
    </View>
  );
}
