// components/me/AccountSettings.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import Button from '@/components/common/Button';
import { useUser } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { Colors, Layout, ViewComponents, TextComponents } from '@/styles';
import { TextWithView } from '../common/TextWithView';
import { InputField } from '../common/InputField';


interface AccountSettingsProps {
  onLogout: () => void;
}


export function AccountSettings({ onLogout }: AccountSettingsProps) {
  const { t } = useTranslation(['me']);
  const { updatePassword, updateSecurityQuestion, deactivateAccount } = useUser();
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleChangePassword = async () => {
    const ok = await updatePassword({ oldPassword: oldPwd, newPassword: newPwd });
    // Alert.alert(ok ? '修改成功' : '修改失败');
  };

  const handleChangeQuestion = async () => {
    const ok = await updateSecurityQuestion({
      password: oldPwd,
      securityQuestion: question, 
      securityAnswer: answer,
    });
    // Alert.alert(ok ? '更新成功' : '更新失败');
  };

  const handleDeactivate = async () => {
    const ok = await deactivateAccount();
    // Alert.alert(ok ? '已注销' : '注销失败');
  };

  return (
    <View style={[Layout.column, ViewComponents.card]}>
      <TextWithView
        textStyle={TextComponents.titleText}
        viewStyle={Layout.contentColumn}
      >
        {t('me:account.title')}
      </TextWithView>

      <InputField
        label=""
        value={oldPwd}
        style={Layout.contentColumn}
        onChangeText={setOldPwd}
        placeholder={t('me:account.placeholder.oldPassword')}
        keyboardType={'default'}
        secureTextEntry={true}
      />

      <TextWithView 
        textStyle={TextComponents.subtitleText} 
        viewStyle={{...Layout.center, ...Layout.contentColumn}}
      >
        {t('me:account.prompt.changePassword')}
      </TextWithView>
      <InputField
        label=""
        value={newPwd}
        onChangeText={setNewPwd}
        style={Layout.contentColumn}
        placeholder={t('me:account.placeholder.newPassword')}
        keyboardType={'default'}
        secureTextEntry={true}
      />
      <Button onPress={handleChangePassword} style={Layout.contentColumn}>
        {t('me:account.button.confirmChangePassword')}
      </Button>

      <TextWithView 
        textStyle={TextComponents.subtitleText} 
        viewStyle={{...Layout.center, ...Layout.contentColumn}}
      >
        {t('me:account.prompt.changeSecQuestion')}
      </TextWithView>
      <InputField
        label=""
        value={question}
        onChangeText={setQuestion}
        style={Layout.contentColumn}
        placeholder={t('me:account.placeholder.newSecurityQuestion')}
        keyboardType={'default'}
      />
      <InputField
        label=""
        value={answer}
        onChangeText={setAnswer}
        style={Layout.contentColumn}
        placeholder={t('me:account.placeholder.newSecurityAnswer')}
        keyboardType={'default'}
      />
      <Button onPress={handleChangePassword} style={Layout.contentColumn}>
        {t('me:account.button.confirmChangeSecurityQuestion')}
      </Button>

      <Button onPress={onLogout} style={Layout.contentColumn}>
        {t('me:account.button.logout')}
      </Button>
    </View>
  );
}
