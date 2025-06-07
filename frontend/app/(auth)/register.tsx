import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAlertModal, useAuth } from '@/hooks';
import { useTranslation } from 'react-i18next'
import Button from '@/components/common/Button';
import { Layout, ViewComponents, TextComponents } from '@/styles';
import { TextWithView } from '@/components/common/TextWithView';
import { InputField } from '@/components/common/InputField';


export default function RegisterScreen() {
  const { t } = useTranslation();
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
      await showModal(t('auth.register.passwordMismatch'));
      return;
    }
    if (!username || !email || !password
      || !confirmPassword || !securityQuestion || !securityAnswer
    ) {
      await showModal(t('auth.register.alertEmptyFields'));
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
      showModal(t('auth.register.alertRegisterFail'));
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = () => {
    router.push('/login');
  };

  return (
    <View style={[Layout.column, Layout.center, ViewComponents.screen]}>
      <View>
        <TextWithView
          textStyle={TextComponents.titleText}
          viewStyle={[Layout.center, Layout.screenPadding]}
        >
          {t('common.appTitle')} - v0.0.1
        </TextWithView>

        <View style={[Layout.column, Layout.center, Layout.screenPadding]}>
          <TextWithView textStyle={TextComponents.subtitleText}>
            {t('auth.register.title')}
          </TextWithView>
          <InputField
            label={t('auth.placeholderUserName')}
            value={username}
            onChangeText={setUsername}
            placeholder={t('auth.placeholderUserName')}
            style={{ width: '100%' }}
          />
          <InputField
            label={t('auth.placeholderEmail')}
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth.placeholderEmail')}
            keyboardType="email-address"
            style={{ width: '100%' }}
          />
          <InputField
            label={t('auth.placeholderPassword')}
            value={password}
            onChangeText={setPassword}
            placeholder={t('auth.placeholderPassword')}
            secureTextEntry={true}
            style={{ width: '100%' }}
          />
          <InputField
            label={t('auth.placeholderConfirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t('auth.placeholderConfirmPassword')}
            secureTextEntry={true}
            style={{ width: '100%' }}
          />
          <InputField
            label={t('auth.placeholderSecurityQuestion')}
            value={securityQuestion}
            onChangeText={setSecurityQuestion}
            placeholder={t('auth.placeholderSecurityQuestion')}
            style={{ width: '100%' }}
          />
          <InputField
            label={t('auth.placeholderSecurityAnswer')}
            value={securityAnswer}
            onChangeText={setSecurityAnswer}
            placeholder={t('auth.placeholderSecurityAnswer')}
            style={{ width: '100%' }}
          />
        </View>

        <Button onPress={handleRegister} disabled={loading} 
          style={[Layout.screenPadding, { width: '100%' }]}
        >
          {loading ? t('common.buttonLoading') : t('auth.register.buttonRegister')}
        </Button>
        <Button onPress={handleReturn} disabled={loading} 
          style={[Layout.screenPadding, { width: '100%' }]}
        >
          {loading ? t('common.buttonLoading') : t('common.buttonReturn')}
        </Button>
      </View>
    </View>
  )
}