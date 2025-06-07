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


export default function ForgetPasswordScreen() {
  const { t } = useTranslation();
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
      await showModal(t('auth.forgetPassword.alertEmailError'));
      return;
    }
    setLoading(true);
    try {
      setSecurityQuestion(await getSecurityQuestion({ email }));
      setIsSecurityQuestionVisible(true);
    } catch (error) {
      console.error(error);
      await showModal(t('auth.forgetPassword.alertEmailError'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySecurityAnswer = async () => {
    if (!securityAnswer) {
      await showModal(t('auth.forgetPassword.alertSecurityAnswerError'));
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
      await showModal(t('auth.forgetPassword.alertSecurityAnswerError'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      await showModal(t('auth.forgetPassword.alertEmptyPassword'));
      return;
    }
    if (password !== confirmPassword) {
      await showModal(t('auth.forgetPassword.alertPasswordMismatch'));
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ token: resetToken, newPassword: password });
      await showModal(t('auth.forgetpassword.alertPasswordResetSuccess'));
      router.replace('/login');
    } catch (error) {
      console.error(error);
      await showModal(t('auth.forgetpassword.alertPasswordResetFail'));
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
            {t('auth.forgetPassword.title')}
          </TextWithView>
          <InputField
            label={t('auth.placeholderEmail')}
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth.placeholderEmail')}
            keyboardType="email-address"
            style={{ width: '100%' }}
          />
          <Button onPress={handleGetSecurityQuestion} disabled={loading}
            style={[Layout.screenPadding, { width: '100%' }]}
          >
            {loading ? t('common.buttonLoading') : t('auth.forgetPassword.buttonRequestSecurityQuestion')}
          </Button>

          {isSecurityQuestionVisible && (<>
            <TextWithView textStyle={TextComponents.boldText}>
              {securityQuestion}
            </TextWithView>
            <InputField
              label={t('auth.placeholderSecurityAnswer')}
              value={securityAnswer}
              onChangeText={setSecurityAnswer}
              placeholder={t('auth.placeholderSecurityAnswer')}
              style={{ width: '100%' }}
            />
            <Button onPress={handleVerifySecurityAnswer} disabled={loading}
              style={[Layout.screenPadding, { width: '100%' }]}
            >
              {loading ? t('common.buttonLoading') : t('auth.forgetPassword.buttonVerifySecurityAnswer')}
            </Button>
          </>)}

          {isPasswordVisible && (<>
            <InputField
              label={t('auth.placeholderNewPassword')}
              value={password}
              onChangeText={setPassword}
              placeholder={t('auth.placeholderNewPassword')}
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
            <Button onPress={handleResetPassword} disabled={loading}
              style={[Layout.screenPadding, { width: '100%' }]}
            >
              {loading ? t('common.buttonLoading') : t('auth.forgetPassword.buttonResetPassword')}
            </Button>
          </>)}

          <Button onPress={handleReturn} disabled={loading}
            style={[Layout.screenPadding, { width: '100%' }]}
          >
            {loading ? t('common.buttonLoading') : t('common.buttonReturn')}
          </Button>
        </View>
      </View>
    </View>
  );
}