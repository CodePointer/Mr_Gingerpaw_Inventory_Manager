import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAlertModal, useAuth } from '@/hooks';
import { useTranslation } from 'react-i18next'
import Button from '@/components/common/Button';
import { Layout, ViewComponents, TextComponents } from '@/styles';
import { TextWithView } from '@/components/common/TextWithView';
import { InputField } from '@/components/common/InputField';
import Constants from 'expo-constants';


export default function RegisterScreen() {
  const { t } = useTranslation(['auth', 'common']);
  const { showModal } = useAlertModal();
  const router = useRouter();
  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
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

  const version = Constants.expoConfig?.version ?? 'N/A';

  return (
    <View style={[Layout.column, Layout.center, ViewComponents.screen]}>
      <View>
        <TextWithView
          textStyle={TextComponents.titleText}
          viewStyle={[Layout.center, Layout.screenPadding]}
        >
          {t('common:appTitle')} - v{version}
        </TextWithView>

        <View style={[Layout.column, Layout.center, Layout.screenPadding]}>
          <TextWithView textStyle={TextComponents.subtitleText}>
            {t('auth:register.title')}
          </TextWithView>
          <InputField
            label={t('auth:placeholder.userName')}
            value={username}
            onChangeText={setUsername}
            placeholder={t('auth:placeholder.userName')}
            style={{ width: '100%' }}
          />
          <InputField
            label={t('auth:placeholder.email')}
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth:placeholder.email')}
            keyboardType="email-address"
            style={{ width: '100%' }}
          />
          <InputField
            label={t('auth:placeholder.password')}
            value={password}
            onChangeText={setPassword}
            placeholder={t('auth:placeholder.password')}
            secureTextEntry={true}
            style={{ width: '100%' }}
          />
          <InputField
            label={t('auth:placeholder.confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t('auth:placeholder.confirmPassword')}
            secureTextEntry={true}
            style={{ width: '100%' }}
          />
          <InputField
            label={t('auth:placeholder.securityQuestion')}
            value={securityQuestion}
            onChangeText={setSecurityQuestion}
            placeholder={t('auth:placeholder.securityQuestion')}
            style={{ width: '100%' }}
          />
          <InputField
            label={t('auth:placeholder.securityAnswer')}
            value={securityAnswer}
            onChangeText={setSecurityAnswer}
            placeholder={t('auth:placeholder.securityAnswer')}
            style={{ width: '100%' }}
          />
        </View>

        <Button onPress={handleRegister} disabled={loading} 
          style={[Layout.screenPadding, { width: '100%' }]}
        >
          {loading ? 
          t('common:button.loading') : t('auth:button.register')}
        </Button>
        <Button onPress={handleReturn} disabled={loading} 
          style={[Layout.screenPadding, { width: '100%' }]}
        >
          {loading ? t('common:button.loading') : t('common:button.return')}
        </Button>
      </View>
    </View>
  )
}