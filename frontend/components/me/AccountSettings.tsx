// components/me/AccountSettings.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import Button from "@/components/common/Button";
import { useUser } from "@/hooks";
import { useTranslation } from "react-i18next";
import { Colors, Layout } from "@/styles";

export function AccountSettings() {
  const { t } = useTranslation();
  const { updatePassword, updateSecurityQuestion, deactivateAccount } = useUser();
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleChangePassword = async () => {
    const ok = await updatePassword({ oldPassword: oldPwd, newPassword: newPwd });
    // Alert.alert(ok ? "修改成功" : "修改失败");
  };

  const handleChangeQuestion = async () => {
    const ok = await updateSecurityQuestion({
      password: oldPwd,
      securityQuestion: question, 
      securityAnswer: answer,
    });
    // Alert.alert(ok ? "更新成功" : "更新失败");
  };

  const handleDeactivate = async () => {
    const ok = await deactivateAccount();
    // Alert.alert(ok ? "已注销" : "注销失败");
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {t('me.accountSetting.title')}
      </Text>
      <Text style={styles.label}>
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
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...Layout.card,
    marginBottom: 16,
    backgroundColor: Colors.backgroundCard,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: "500",
  },
  input: {
    backgroundColor: Colors.white,
    borderColor: Colors.borderSoft,
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
});
