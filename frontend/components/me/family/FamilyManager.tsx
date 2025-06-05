import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useUser, useFamily, useMembership } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { Layout, ViewComponents, TextComponents } from '@/styles';
import { FamilyCardList } from './FamilyCardList';
import { FamilyFormModal } from './FamilyFormModal';
import { FamilyInvitation } from './FamilyInvitation';


export function FamilyManager() {
  const { t } = useTranslation();
  const { families, fetchFamilies } = useUser();
  const { currentFamily, members, selectFamily, createFamily, deleteFamily } = useFamily();
  const { createInviteToken, joinFamilyWithToken } = useMembership();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete'>('create');

  const [newName, setNewName] = useState('');
  const [tokenRole, setTokenRole] = useState<'adult' | 'child'>('adult');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [joinToken, setJoinToken] = useState('');

  useEffect(() => {
    if (!currentFamily && families.length > 0) {
      selectFamily(families[0]);
    }
  }, [currentFamily, families, selectFamily])

  useEffect(() => {
    fetchFamilies();
  }, [currentFamily]);

  const openCreate = () => {
    setModalMode('create');
    setModalVisible(true);
  };

  const openEdit = () => {
    setModalMode('edit');
    setModalVisible(true);
  };

  const openDelete = () => {
    setModalMode('delete');
    setModalVisible(true);
  }

  const closeModal = () => {
    setModalVisible(false);
  }

  const handleSelect = async (fam: typeof families[0]) => {
    await selectFamily(fam);
    setModalVisible(false);
  };

  const handleCreate = async () => {
    if (!newName.trim()) {
      // Alert.alert('请输入家庭名称');
      return;
    }
    await createFamily({ name: newName });
    setNewName('');
    // 自动选中新建的家庭
    const justCreated = families.find((f) => f.name === newName);
    if (justCreated) await selectFamily(justCreated);
  };

  const handleInvite = async () => {
    const token = await createInviteToken(tokenRole);
    if (token) {
      setGeneratedToken(token);
      // Alert.alert('邀请码', token);
    } else {
      // Alert.alert('生成失败');
      return;
    }
  };

  const handleJoin = async () => {
    const ok = await joinFamilyWithToken(joinToken);
    // Alert.alert(ok ? '加入成功' : '加入失败');
    setJoinToken('');
  };

  return (
    <View style={[Layout.column, ViewComponents.card]}>

      <Text style={TextComponents.titleText}>
        {t('family.familyManagerTitle')}
      </Text>

      <FamilyCardList
        onCreateFamily={openCreate}
        onEditFamily={openEdit}
        onDeleteFamily={openDelete}
      />

      <FamilyFormModal 
        visible={modalVisible}
        mode={modalMode}
        onClose={closeModal}
        onDone={async () => {
          await fetchFamilies();
          closeModal();
        }}
      />
      <FamilyInvitation />
    </View>
  );
}
