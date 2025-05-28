// components/me/FamilyCard.tsx
import { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, Alert,
  TextInput, Modal, FlatList, TouchableOpacity
} from "react-native";
import { useUser, useFamily, useMembership } from "@/hooks";
import { useTranslation } from "react-i18next";
import { Colors, Layout } from "@/styles";
import Button from "@/components/common/Button";
import RolePicker from "@/components/common/Picker";
import { Picker } from "@react-native-picker/picker";

export function FamilyCard() {
  const { t } = useTranslation();
  const { families, fetchFamilies } = useUser();
  const { currentFamily, selectFamily, createFamily, deleteFamily } = useFamily();
  const { createInviteToken, joinFamilyWithToken } = useMembership();

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [tokenRole, setTokenRole] = useState<"adult" | "child">("adult");
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [joinToken, setJoinToken] = useState("");

  useEffect(() => {
    if (!currentFamily && families.length > 0) {
      selectFamily(families[0]);
    }
  }, [currentFamily, families, selectFamily])

  useEffect(() => {
    fetchFamilies();
  }, [currentFamily]);

  const handleSelect = async (fam: typeof families[0]) => {
    await selectFamily(fam);
    setModalVisible(false);
  };

  const handleCreate = async () => {
    if (!newName.trim()) {
      // Alert.alert("请输入家庭名称");
      return;
    }
    await createFamily({ name: newName });
    setNewName("");
    // 自动选中新建的家庭
    const justCreated = families.find((f) => f.name === newName);
    if (justCreated) await selectFamily(justCreated);
  };

  const handleInvite = async () => {
    const token = await createInviteToken(tokenRole);
    if (token) {
      setGeneratedToken(token);
      // Alert.alert("邀请码", token);
    } else {
      // Alert.alert("生成失败");
      return;
    }
  };

  const handleJoin = async () => {
    const ok = await joinFamilyWithToken(joinToken);
    // Alert.alert(ok ? "加入成功" : "加入失败");
    setJoinToken("");
  };

  // {t('me.familyCard.title')}

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {t('me.familyCard.title')}
      </Text>
      <Text style={styles.current}>
        {t('me.familyCard.current', { name: currentFamily?.name })}
      </Text>
      <Button onPress={() => setModalVisible(true)}>
        {t('me.familyCard.buttonSwitchCreate')}
      </Button>

      <View style={styles.invite}>
        <RolePicker
          label={t('me.familyCard.labelInviteRole')}
          selectedValue={tokenRole}
          onValueChange={(value) => {
            if (value === "adult" || value === "child") {
              setTokenRole(value);
            }
          }}
        >
          <Picker.Item label={t('me.familyCard.roleAdult')} value="adult" />
          <Picker.Item label={t('me.familyCard.roleChild')} value="child" />
        </RolePicker>
        <Button onPress={handleInvite}>{t('me.familyCard.buttonGenToken')}</Button>
      </View>
      {generatedToken && (
        <Text style={styles.current}>{generatedToken}</Text>
      )}

      <View style={styles.join}>
        <TextInput
          style={styles.input}
          placeholder={t('me.familyCard.placeholderJoinToken')}
          value={joinToken}
          onChangeText={setJoinToken}
        />
        <Button onPress={handleJoin}>{t('me.familyCard.buttonJoinFamily')}</Button>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('me.familyCard.modalTitle')}</Text>
            <FlatList
              data={families}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  style={styles.familyItem}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TextInput
              style={styles.input}
              placeholder={t('me.familyCard.placeholderNewFamilyName')}
              value={newName}
              onChangeText={setNewName}
            />
            <Button onPress={handleCreate}>{t('me.familyCard.buttonCreateNewFamily')}</Button>
            <Button onPress={() => setModalVisible(false)} style={styles.cancel}>
              {t('me.familyCard.buttonClose')}
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...Layout.card,
    marginBottom: 16,
    backgroundColor: Colors.backgroundCard,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  current: { marginBottom: 12 },
  invite: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  join: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  input: {
    flex: 1,
    backgroundColor: Colors.white,
    borderColor: Colors.borderSoft,
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 8,
    padding: 16,
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  familyItem: {
    padding: 12,
    borderBottomColor: Colors.borderSoft,
    borderBottomWidth: 1,
  },
  cancel: { marginTop: 8, backgroundColor: Colors.borderSoft },
});
