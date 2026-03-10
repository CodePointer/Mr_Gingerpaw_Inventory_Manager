import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Avatar, Button, Text, TextInput } from 'react-native-paper';
import Constants from 'expo-constants';
import { ButtonGroup } from '@/components/common/ButtonGroup';
import { Layout, Spacing, ViewComponents } from '@/styles';


export type ForgetPasswordStep =
  | 'Start'
  | 'EmailVerified'
  | 'SecurityAnswerVerified'
  | 'NewPasswordVerified';


interface ForgetPasswordScreenProps {
  step: ForgetPasswordStep;
  email: string;
  securityQuestion: string;
  securityAnswer: string;
  password: string;
  confirmPassword: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onSecurityAnswerChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onRequestSecurityQuestion: () => void;
  onVerifySecurityAnswer: () => void;
  onResetPassword: () => void;
  onBackToLogin: () => void;
}


export function ForgetPasswordScreen({
  step,
  email,
  securityQuestion,
  securityAnswer,
  password,
  confirmPassword,
  loading,
  onEmailChange,
  onSecurityAnswerChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onRequestSecurityQuestion,
  onVerifySecurityAnswer,
  onResetPassword,
  onBackToLogin,
}: ForgetPasswordScreenProps) {
  const { t } = useTranslation(['auth', 'common']);
  const version = Constants.expoConfig?.version ?? 'N/A';
  const isEmailStepActive = step === 'Start';
  const isSecurityStepVisible = step !== 'Start';
  const isSecurityStepActive = step === 'EmailVerified';
  const isPasswordStepVisible = step === 'SecurityAnswerVerified' || step === 'NewPasswordVerified';
  const isPasswordStepActive = step === 'SecurityAnswerVerified';

  return (
    <View style={[ViewComponents.screen, { paddingHorizontal: Spacing.large, gap: Spacing.xlarge }]}> 
      <View style={[ViewComponents.rowTitle]}>
        <View style={{ flexWrap: 'wrap', maxWidth: '75%' }}>
          <Text variant="headlineLarge">
            {t('common:appTitle')} (v{version})
          </Text>
        </View>
        <Avatar.Image
          size={100}
          source={require('@/assets/images/favicon.png')}
        />
      </View>

      <View style={[ViewComponents.groupContainer]}>
        <Text variant="titleLarge">{t('auth:forgetPassword.title')}</Text>

        <TextInput
          label={t('auth:placeholder.email')}
          value={email}
          onChangeText={onEmailChange}
          keyboardType="email-address"
          disabled={!isEmailStepActive}
          right={<TextInput.Icon icon="close" onPress={() => onEmailChange('')} />}
        />

        <Button
          mode="contained"
          onPress={onRequestSecurityQuestion}
          disabled={loading || !isEmailStepActive}
        >
          {loading
            ? t('common:button.loading')
            : t('auth:button.requestSecurityQuestion')}
        </Button>

        {isSecurityStepVisible ? (
          <>
            <Text variant="titleMedium">{securityQuestion}</Text>
            <TextInput
              label={t('auth:placeholder.securityAnswer')}
              value={securityAnswer}
              onChangeText={onSecurityAnswerChange}
              disabled={!isSecurityStepActive}
              right={<TextInput.Icon icon="close" onPress={() => onSecurityAnswerChange('')} />}
            />
            <Button
              mode="contained"
              onPress={onVerifySecurityAnswer}
              disabled={loading || !isSecurityStepActive}
            >
              {loading
                ? t('common:button.loading')
                : t('auth:button.verifySecurityAnswer')}
            </Button>
          </>
        ) : null}

        {isPasswordStepVisible ? (
          <>
            <TextInput
              label={t('auth:placeholder.newPassword')}
              value={password}
              onChangeText={onPasswordChange}
              secureTextEntry
              disabled={!isPasswordStepActive}
              right={<TextInput.Icon icon="close" onPress={() => onPasswordChange('')} />}
            />
            <TextInput
              label={t('auth:placeholder.confirmPassword')}
              value={confirmPassword}
              onChangeText={onConfirmPasswordChange}
              secureTextEntry
              disabled={!isPasswordStepActive}
              right={<TextInput.Icon icon="close" onPress={() => onConfirmPasswordChange('')} />}
            />
            <Button
              mode="contained"
              onPress={onResetPassword}
              disabled={loading || !isPasswordStepActive}
            >
              {loading
                ? t('common:button.loading')
                : t('auth:button.resetPassword')}
            </Button>
          </>
        ) : null}
      </View>

      <View style={[ViewComponents.groupContainer]}>
        <ButtonGroup
          buttons={[
            {
              label: t('common:button.return'),
              mode: 'outlined',
              icon: 'arrow-left',
              onPress: onBackToLogin,
              disabled: loading,
            },
          ]}
          style={[Layout.column, { gap: Spacing.small }]}
        />
      </View>
    </View>
  );
}
