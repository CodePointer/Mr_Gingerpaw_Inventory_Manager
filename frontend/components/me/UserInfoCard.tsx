// components/me/UserInfoCard.tsx
import { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useUser } from "@/hooks";
import { useTranslation } from "react-i18next";
import { TextComponents, ViewComponents, Colors, Spacing, Layout } from "@/styles";
import { Feather } from "@expo/vector-icons";
import Button from "@/components/common/Button";
import { InputField } from '@/components/common/InputField';

export function UserInfoCard() {

  const { t } = useTranslation(['me', 'common']);
  const { user, updateUserInfo } = useUser();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    if (user) {
      // console.log('Update username & email:', user);
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
    <View style={[Layout.column, ViewComponents.card]}>

      <Text style={TextComponents.titleText}>{t('me:userInfo.title')}</Text>

      {editing ? (
        <View style={Layout.column}>
          <InputField 
            label={t('me:userInfo.label.userName')}
            value={username}
            onChangeText={setUsername}
            placeholder={t('me:userInfo.placeholder.userName')}
            style={{ marginVertical: Spacing.small }}
          />
          <InputField 
            label={t('me:userInfo.label.email')}
            value={email}
            onChangeText={setEmail}
            placeholder={t('me:userInfo.placeholder.email')}
            style={{ marginVertical: Spacing.small }}
          />

          <View style={[Layout.buttonRow, { marginVertical: Spacing.small }]}>
            <Button onPress={handleSave} style={{ flex: 1, marginHorizontal: Spacing.xsmall }}>
              {t('common:button.confirm')}
            </Button>
            <Button onPress={() => setEditing(false)} style={{ flex: 1, marginHorizontal: Spacing.xsmall }}>
              {t('common:button.cancel')}
            </Button>
          </View>
        </View>
      ) : (
        <View style={[Layout.row]}>
          <TouchableOpacity onPress={() => setEditing(true)} style={{ padding: Spacing.small }}>
            <Feather name="edit" size={24} color={Colors.primary} />
          </TouchableOpacity>

          <View style={[Layout.column, { flex: 1 }]}>
            <Text style={TextComponents.subtitleText}>
              {user?.username || t('me:userInfo.alert.emptyInfo')}
            </Text>
            <Text style={TextComponents.plainText}>
              {user?.email || t('me:userInfo.alert.emptyInfo')}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
