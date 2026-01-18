// components/auth/LoginScreen.tsx
import { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TextInput,
  Button,
  Avatar,
} from 'react-native-paper';
import Constants from 'expo-constants';
import { ViewComponents, Layout, Spacing } from '@/styles';
import { ButtonGroup } from '@/components/common/ButtonGroup';


interface LoginScreenProps {
  defaultEmail?: string;
  defaultPassword?: string;
  handleLogin?: (email: string, password: string) => Promise<void>;
  handleRegister?: () => void;
  handleForgetPassword?: () => void;
  onLanguageSetting?: () => void;
}


export function LoginScreen(props: LoginScreenProps) {
  const { t } = useTranslation(['auth', 'common']);
  const version = Constants.expoConfig?.version ?? 'N/A';

  const [email, setEmail] = useState(props.defaultEmail || '');
  const [password, setPassword] = useState(props.defaultPassword || '');

  const handleLogin = () => {
    props.handleLogin?.(email, password);
  };

  const handleRegister = () => {
    props.handleRegister?.();
  };

  const handleForgotPassword = () => {
    props.handleForgetPassword?.();
  };

  const handleLanguageSetting = () => {
    console.log('Language Setting clicked');
    props.onLanguageSetting?.();
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
        {/* Email Input */}
        <TextInput
          label={t('auth:placeholder.email')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          right={
            <TextInput.Icon icon="close" onPress={() => setEmail('')} />
          }
        />
        {/* Password Input */}
        <TextInput
          label={t('auth:placeholder.password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          right={
            <TextInput.Icon icon="close" onPress={() => setPassword('')} />
          }
        />
        {/* Login Button */}
        <Button mode="contained" onPress={handleLogin}>
          {t('auth:button.login')}
        </Button>
      </View>

      <View style={[ViewComponents.groupContainer]}>
        {/* Register and Forget Password Buttons */}
        <ButtonGroup
          buttons={[
            { label: t('auth:button.register'), mode: 'outlined', onPress: handleRegister },
            { label: t('auth:button.forgetPassword'), mode: 'outlined', onPress: handleForgotPassword },
          ]}
          style={[Layout.row, Layout.normalGap]}
        />
        {/* Language Setting Button */}
        <Button
          mode="outlined"
          onPress={handleLanguageSetting}
        >
          {t('common:settings.languageSettings')}
        </Button>
      </View>
    </View>
  );
}
