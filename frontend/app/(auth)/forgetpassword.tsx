import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAlertModal, useAuth } from '@/hooks';
import { useTranslation } from 'react-i18next'
import Button from '@/components/common/Button';
import { Layout, ViewComponents, TextComponents } from '@/styles';
import { TextWithView } from '@/components/common/TextWithView';
import { InputField } from '@/components/common/InputField';
import Constants from 'expo-constants';


export default function ForgetPasswordScreen() {
  const { t } = useTranslation(['auth', 'common']);
  const { showModal } = useAlertModal();
  const router = useRouter();
  const { getSecurityQuestion, verifySecurityAnswer, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSecurityQuestionVisible, setIsSecurityQuestionVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsSecurityQuestionVisible(false);
      setIsPasswordVisible(false);
      setLoading(false);
    }, [])
  );

  const handleGetSecurityQuestion = async () => {
    if (!email) {
      await showModal(t('auth:alert.emailError'));
      return;
    }
    setLoading(true);
    try {
      setSecurityQuestion(await getSecurityQuestion({ email }));
      setIsSecurityQuestionVisible(true);
    } catch (error) {
      console.error(error);
      await showModal(t('auth:alert.emailError'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySecurityAnswer = async () => {
    if (!securityAnswer) {
      await showModal(t('auth:alert.securityAnswerError'));
      return;
    }
    setLoading(true);
    try {
      const token = await verifySecurityAnswer({ email, securityAnswer });
      if (!token) {
        throw new Error('Invalid answer');
      }
      setResetToken(token);
      setIsPasswordVisible(true);
    } catch (error) {
      console.error(error);
      await showModal(t('auth:alert.securityAnswerError'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      await showModal(t('auth:alert.emptyPassword'));
      return;
    }
    if (password !== confirmPassword) {
      await showModal(t('auth:alert.passwordMismatch'));
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ token: resetToken, newPassword: password });
      await showModal(t('auth:alert.passwordResetSuccess'));
      router.replace('/login');
    } catch (error) {
      console.error(error);
      await showModal(t('auth:alert.passwordResetFail'));
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
            {t('auth:forgetPassword.title')}
          </TextWithView>
          <InputField
            label={t('auth:placeholder.email')}
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth:placeholder.email')}
            keyboardType="email-address"
            style={{ width: '100%' }}
          />
          <Button onPress={handleGetSecurityQuestion} disabled={loading}
            style={[Layout.screenPadding, { width: '100%' }]}
          >
            {loading ? 
            t('common:button.loading') : 
            t('auth:button.requestSecurityQuestion')}
          </Button>

          {isSecurityQuestionVisible && (<>
            <TextWithView textStyle={TextComponents.boldText}>
              {securityQuestion}
            </TextWithView>
            <InputField
              label={t('auth:placeholder.securityAnswer')}
              value={securityAnswer}
              onChangeText={setSecurityAnswer}
              placeholder={t('auth:placeholder.securityAnswer')}
              style={{ width: '100%' }}
            />
            <Button onPress={handleVerifySecurityAnswer} disabled={loading}
              style={[Layout.screenPadding, { width: '100%' }]}
            >
              {loading ?
               t('common:button.loading') : 
               t('auth:button.verifySecurityAnswer')}
            </Button>
          </>)}

          {isPasswordVisible && (<>
            <InputField
              label={t('auth:placeholder.newPassword')}
              value={password}
              onChangeText={setPassword}
              placeholder={t('auth:placeholder.newPassword')}
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
            <Button onPress={handleResetPassword} disabled={loading}
              style={[Layout.screenPadding, { width: '100%' }]}
            >
              {loading ? 
              t('common:button.loading') : 
              t('auth:button.resetPassword')}
            </Button>
          </>)}

          <Button onPress={handleReturn} disabled={loading}
            style={[Layout.screenPadding, { width: '100%' }]}
          >
            {loading ? 
            t('common:button.loading') : 
            t('common:button.return')}
          </Button>
        </View>
      </View>
    </View>
  );
}