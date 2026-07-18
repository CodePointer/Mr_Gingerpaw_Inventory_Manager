import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAlertModal, useAuth } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { ViewComponents } from '@/styles';
import { ForgetPasswordScreen, ForgetPasswordStep } from '@/components/auth/ForgetPasswordScreen';


export default function ForgetPasswordPage() {
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
  const [step, setStep] = useState<ForgetPasswordStep>('Start');
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setStep('Start');
      setLoading(false);
    }, [])
  );

  const handleGetSecurityQuestion = async () => {
    if (!email) {
      await showModal(t('auth:validation.invalidEmail'));
      return;
    }
    setLoading(true);
    try {
      setSecurityQuestion(await getSecurityQuestion({ email }));
      setStep('EmailVerified');
    } catch (error) {
      console.error(error);
      await showModal(t('auth:validation.invalidEmail'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySecurityAnswer = async () => {
    if (!securityAnswer) {
      await showModal(t('auth:validation.securityAnswerIncorrect'));
      return;
    }
    setLoading(true);
    try {
      const token = await verifySecurityAnswer({ email, securityAnswer });
      if (!token) {
        throw new Error('Invalid answer');
      }
      setResetToken(token);
      setStep('SecurityAnswerVerified');
    } catch (error) {
      console.error(error);
      await showModal(t('auth:validation.securityAnswerIncorrect'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      await showModal(t('auth:validation.emptyNewPassword'));
      return;
    }
    if (password !== confirmPassword) {
      await showModal(t('auth:validation.passwordMismatch'));
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ token: resetToken, newPassword: password });
      setStep('NewPasswordVerified');
      await showModal(t('auth:status.passwordResetSucceeded'));
      router.replace('/(auth)/login');
    } catch (error) {
      console.error(error);
      await showModal(t('auth:status.passwordResetFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = () => {
    router.push('/(auth)/login');
  };

  return (
    <View style={ViewComponents.background}>
      <ForgetPasswordScreen
        step={step}
        email={email}
        securityQuestion={securityQuestion}
        securityAnswer={securityAnswer}
        password={password}
        confirmPassword={confirmPassword}
        loading={loading}
        onEmailChange={setEmail}
        onSecurityAnswerChange={setSecurityAnswer}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onRequestSecurityQuestion={handleGetSecurityQuestion}
        onVerifySecurityAnswer={handleVerifySecurityAnswer}
        onResetPassword={handleResetPassword}
        onBackToLogin={handleReturn}
      />
    </View>
  );
}
