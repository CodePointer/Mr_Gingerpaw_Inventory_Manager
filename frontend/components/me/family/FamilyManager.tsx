import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useUser, useFamily } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { Layout, ViewComponents, TextComponents } from '@/styles';
import { FamilyCardList } from './FamilyCardList';
import { FamilyFormModal } from './FamilyFormModal';
import { FamilyInvitation } from './FamilyInvitation';
import { SectionInfoCard } from '../SectionInfoCard';
import { CustomModal } from '@/components/common/CustomModal';
import { Text, TextInput } from 'react-native-paper';


export function FamilyManager() {
  const { t } = useTranslation(['me']);
  const { families, fetchFamilies } = useUser();
  const { currentFamily, members, selectFamily, createFamily, updateFamily, deleteFamily } = useFamily();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete'>('create');

  useEffect(() => {
    if (!currentFamily && families.length > 0) {
      selectFamily(families[0]);
    }
  }, [currentFamily, families, selectFamily])

  useEffect(() => {
    fetchFamilies();
  }, [currentFamily]);

  const getDefaultInfo = () => {
    if (modalMode === 'create') {
      return { name: '', notes: '' }
    } else {
      return {
        name: currentFamily?.name ?? '',
        notes: currentFamily?.notes ?? ''
      }
    }
  };

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

  const handleSelect = async (familyId: number) => {
    const family = families.find((f) => f.id === familyId);
    if (!family) return;
    await selectFamily(family);
  };

  const handleConfirm = async (newName: string, newNotes: string) => {
    try {
      if (modalMode === 'create') {
        if (newName === '') {
          return;  // Alert.alert(t('me:family.alert.emptyName'));
        }
        await createFamily({
          name: newName,
          notes: newNotes,
        });
      } else {
        if (currentFamily === null) {
          return; // Alert.alert(t('me:family.alert.emptyFamily'));
        }
        if (modalMode === 'edit') {
          await updateFamily({
            name: newName,
            notes: newNotes
          });
        } else {
          await deleteFamily();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setModalVisible(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <SectionInfoCard title={t('me:family.managerTitle')}>
        <FamilyCardList
          families={families}
          currentFamilyId={currentFamily?.id}
          members={members}
          onSelectFamily={handleSelect}
          onCreateFamily={openCreate}
          onEditFamily={openEdit}
          onDeleteFamily={openDelete}
        />
      </SectionInfoCard>

      <FamilyInfoEditModal
        visible={modalVisible}
        mode={modalMode}
        defaultInfo={getDefaultInfo()}
        onClose={handleCancel}
        onDone={handleConfirm}
      />
    </>
  );
}


interface FamilyInfoEditModalProps {
  visible: boolean;
  mode: 'create' | 'edit' | 'delete';
  defaultInfo: {
    name: string,
    notes: string
  }
  onClose: () => void;
  onDone: (newName: string, newNotes: string) => Promise<void>;
}

function FamilyInfoEditModal({
  visible,
  mode,
  defaultInfo,
  onClose,
  onDone
}: FamilyInfoEditModalProps) {
  const { t } = useTranslation(['me', 'common']);

  const [name, setName] = useState<string>(defaultInfo.name ?? '');
  const [notes, setNotes] = useState<string>(defaultInfo.notes ?? '');

  const getModalTitle = () => {
    if (mode === 'create') {
      return t('me:family.createFamilyTitle');
    } else if (mode === 'edit') {
      return t('me:family.editFamilyTitle');
    } else {
      return t('me:family.deleteFamilyTitle');
    }
  };

  return (
    <CustomModal
      visible={visible}
      onDismiss={onClose}
      title={getModalTitle()}
      handleConfirm={() => onDone(name, notes)}
      handleCancel={onClose}
      containerStyle={ViewComponents.modalContainer}
    >
      {mode === 'delete' && (
        <View style={[Layout.center]}>
          <Text variant="headlineSmall">
            {t('me:family.alert.deleteFamilyConfirm')}
          </Text>
        </View>
      )}
      <TextInput
        label={t('me:family.label.familyName')}
        value={name}
        onChangeText={setName}
        right={
          <TextInput.Icon icon="close" onPress={() => setName('')} />
        }
        editable={mode !== 'delete'}
      />
      <TextInput
        label={t('me:family.label.familyNotes')}
        value={notes}
        onChangeText={setNotes}
        right={
          <TextInput.Icon icon="close" onPress={() => setNotes('')} />
        }
        editable={mode !== 'delete'}
      />
    </CustomModal>
  )
}


