// components/me/UserInfoCard.tsx
import { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useUser } from "@/hooks";
import { useTranslation } from "react-i18next";
import { Colors, Layout } from "@/styles";
import Button from "@/components/common/Button";

export function UserInfoCard() {

  const { t } = useTranslation();  // {t('me.userInfoCard.')}
  const { user, updateUserInfo } = useUser();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    const ok = await updateUserInfo({ username, email });
    if (ok) {
      setEditing(false);
    }
  };

  return (
    <View style={styles.card}>
      {editing ? (
        <>
          <Text style={styles.label}>{t('me.userInfoCard.labelUserName')}</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder={t('me.userInfoCard.placeholderUserName')}
          />

          <Text style={styles.label}>{t('me.userInfoCard.labelEmail')}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder={t('me.userInfoCard.placeholderEmail')}
            keyboardType="email-address"
          />

          <Button onPress={handleSave} style={styles.button}>
            {t('me.userInfoCard.buttonConfirm')}
          </Button>
          <Button onPress={() => setEditing(false)} style={styles.cancelButton}>
            {t('me.userInfoCard.buttonCancel')}
          </Button>
        </>
      ) : (
        <>
          <Text style={styles.infoText}>
            {t('me.userInfoCard.labelUserName')}: {user?.username || "未设置"}
          </Text>
          <Text style={styles.infoText}>
            {t('me.userInfoCard.labelEmail')}: {user?.email || "未设置"}
          </Text>
          <TouchableOpacity onPress={() => setEditing(true)} style={styles.editButton}>
            <Text style={styles.editText}>
              {t('me.userInfoCard.buttonEdit')}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...Layout.card,
    marginBottom: 16,
    backgroundColor: Colors.backgroundCard,
  },
  label: {
    fontSize: 16, fontWeight: "500", color: Colors.textDark, marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderColor: Colors.borderSoft,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    marginBottom: 8,
  },
  cancelButton: {
    backgroundColor: Colors.borderSoft,
  },
  infoText: {
    fontSize: 16,
    color: Colors.textDark,
    marginBottom: 8,
  },
  editButton: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editText: {
    color: Colors.white,
    fontWeight: "500",
  },
});
