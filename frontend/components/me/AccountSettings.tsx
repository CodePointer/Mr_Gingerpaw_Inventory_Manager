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
  const { t } = useTranslation();
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
        {t('me.accountSetting.title')}
      </TextWithView>

      <InputField
        label=""
        // label={t('me.accountSetting.promptOldPwd')}
        value={oldPwd}
        style={Layout.contentColumn}
        onChangeText={setOldPwd}
        placeholder={t('me.accountSetting.placeholderOldPwd')}
        keyboardType={'default'}
        secureTextEntry={true}
      />

      <TextWithView 
        textStyle={TextComponents.subtitleText} 
        viewStyle={{...Layout.center, ...Layout.contentColumn}}
      >
        {t('me.accountSetting.promptChangePwd')}
      </TextWithView>
      <InputField
        label=""
        value={newPwd}
        onChangeText={setNewPwd}
        style={Layout.contentColumn}
        placeholder={t('me.accountSetting.placeholderNewPwd')}
        keyboardType={'default'}
        secureTextEntry={true}
      />
      <Button onPress={handleChangePassword} style={Layout.contentColumn}>
        {t('me.accountSetting.buttonConfirmChangePwd')}
      </Button>

      <TextWithView 
        textStyle={TextComponents.subtitleText} 
        viewStyle={{...Layout.center, ...Layout.contentColumn}}
      >
        {t('me.accountSetting.promptChangeSecQuestion')}
      </TextWithView>
      <InputField
        label=""
        value={question}
        onChangeText={setQuestion}
        style={Layout.contentColumn}
        placeholder={t('me.accountSetting.placeholderNewSecQuestion')}
        keyboardType={'default'}
      />
      <InputField
        label=""
        value={answer}
        onChangeText={setAnswer}
        style={Layout.contentColumn}
        placeholder={t('me.accountSetting.placeholderNewSecAnswer')}
        keyboardType={'default'}
      />
      <Button onPress={handleChangePassword} style={Layout.contentColumn}>
        {t('me.accountSetting.buttonConfirmChangeSecQuestion')}
      </Button>

      <Button onPress={onLogout} style={Layout.contentColumn}>
        {t('me.accountSetting.buttonLogout')}
      </Button>

      {/* <Text style={styles.label}>
        {t('me.accountSetting.promptOldPwd')}
      </Text>
      <TextInput
        style={styles.input}
        placeholder={t('me.accountSetting.placeholderOldPwd')}
        secureTextEntry
        value={oldPwd}
        onChangeText={setOldPwd}
      />
      <Text style={styles.label}>
        {t('me.accountSetting.promptChangePwd')}
      </Text>
      <TextInput
        style={styles.input}
        placeholder={t('me.accountSetting.placeholderNewPwd')}
        secureTextEntry
        value={newPwd}
        onChangeText={setNewPwd}
      />
      <Button onPress={handleChangePassword}>
        {t('me.accountSetting.buttonConfirmChangePwd')}
      </Button>

      <Text style={styles.label}>
        {t('me.accountSetting.promptChangeSecQuestion')}
      </Text>
      <TextInput
        style={styles.input}
        placeholder={t('me.accountSetting.placeholderNewSecQuestion')}
        value={question}
        onChangeText={setQuestion}
      />
      <TextInput
        style={styles.input}
        placeholder={t('me.accountSetting.placeholderNewSecAnswer')}
        value={answer}
        onChangeText={setAnswer}
      />
      <Button onPress={handleChangeQuestion}>
        {t('me.accountSetting.buttonConfirmChangeSecQuestion')}
      </Button>

      <Text style={styles.label}>
        {t('me.accountSetting.promptDeactivate')}
      </Text>
      <Button onPress={handleDeactivate}>
        {t('me.accountSetting.buttonConfirmDeactivate')}
      </Button> */}
    </View>
  );
}
