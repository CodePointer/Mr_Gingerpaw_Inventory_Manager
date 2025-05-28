import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks';
import { useTranslation } from 'react-i18next'
import Button from '@/components/common/Button';
import { Layout, Typography, Spacing } from '@/styles';

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
    <View style={[Layout.center, styles.container]}>
      <Text style={Typography.title}>{t('login.title')}</Text>

      <TextInput
        style={styles.input}
        placeholder={t('login.placeholderEmail')}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder={t('login.placeholderPassword')}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button onPress={handleLogin} disabled={loading} style={styles.button}>
        {loading ? t('login.buttonLoading') : t('login.buttonLogin')}
      </Button>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
      width: '80%',
  },
  input: {
      width: '100%',
      backgroundColor: '#ffffff',
      borderColor: '#cccccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 15,
      fontSize: 16,
      color: '#333333',
      marginVertical: Spacing.small,
  },
  button: {
      marginTop: Spacing.medium,
      width: '100%',
  },
});
