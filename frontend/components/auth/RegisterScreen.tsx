// components/auth/RegisterScreen.tsx
import { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TextInput,
  Avatar,
} from 'react-native-paper';
import Constants from 'expo-constants';
import { ViewComponents, Layout, Spacing } from '@/styles';
import { ButtonGroup } from '@/components/common/ButtonGroup';


interface RegisterScreenProps {
  handleRegister?: (
    password: string, 
    confirmPassword: string,
    username: string,
    email: string,
    securityQuestion: string,
    securityAnswer: string
  ) => Promise<void>;
  handleBackToLogin?: () => void;
}


export function RegisterScreen(props: RegisterScreenProps) {
  const { t } = useTranslation(['auth', 'common']);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const version = Constants.expoConfig?.version ?? 'N/A';

  const handleRegister = () => {
    props.handleRegister?.(
      password,
      confirmPassword,
      username,
      email,
      securityQuestion,
      securityAnswer
    );
  };

  const handleBackToLogin = () => {
    props.handleBackToLogin?.();
  };

  return (
    <View style={[ViewComponents.screen, { 'paddingHorizontal': Spacing.large, 'gap': Spacing.xlarge }]}>
      {/* Title with Avatar */}
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
        {/* Username Input */}
        <TextInput
          label={t('auth:placeholder.userName')}
          value={username}
          onChangeText={setUsername}
          right={<TextInput.Icon icon="close" onPress={() => setUsername('')} />}
        />
        {/* Email Input */}
        <TextInput
          label={t('auth:placeholder.email')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          right={<TextInput.Icon icon="close" onPress={() => setEmail('')} />}
        />
        {/* Password Input */}
        <TextInput
          label={t('auth:placeholder.password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          right={<TextInput.Icon icon="close" onPress={() => setPassword('')} />}
        />
        {/* Confirm Password Input */}
        <TextInput
          label={t('auth:placeholder.confirmPassword')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          right={<TextInput.Icon icon="close" onPress={() => setConfirmPassword('')} />}
        />
        {/* Security Question Input */}
        <TextInput
          label={t('auth:placeholder.securityQuestion')}
          value={securityQuestion}
          onChangeText={setSecurityQuestion}
          right={<TextInput.Icon icon="close" onPress={() => setSecurityQuestion('')} />}
        />
        {/* Security Answer Input */}
        <TextInput
          label={t('auth:placeholder.securityAnswer')}
          value={securityAnswer}
          onChangeText={setSecurityAnswer}
          right={<TextInput.Icon icon="close" onPress={() => setSecurityAnswer('')} />}
        />

        <ButtonGroup
          buttons={[
            { label: t('auth:button.register'), mode: 'contained', icon: 'check', onPress: handleRegister },
            { label: t('common:button.cancel'), mode: 'outlined', icon: 'close', onPress: handleBackToLogin },
          ]}
          style={[Layout.row, Layout.normalGap, { marginTop: Spacing.medium }]}
        />
      </View>
    </View>
  );
}
