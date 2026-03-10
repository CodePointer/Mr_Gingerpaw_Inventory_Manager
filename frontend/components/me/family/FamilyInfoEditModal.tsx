import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, TextInput } from 'react-native-paper';
import { CustomModal } from '@/components/common/CustomModal';
import { Layout, ViewComponents } from '@/styles';


export interface FamilyInfoEditModalProps {
  visible: boolean;
  mode: 'create' | 'edit' | 'delete';
  defaultInfo: {
    name: string;
    notes: string;
  };
  onDismiss: () => void;
  onDone: (newName: string, newNotes: string) => Promise<void> | void;
}


export function FamilyInfoEditModal({
  visible,
  mode,
  defaultInfo,
  onDismiss,
  onDone,
}: FamilyInfoEditModalProps) {
  const { t } = useTranslation(['me', 'common']);
  const [name, setName] = useState<string>(defaultInfo.name ?? '');
  const [notes, setNotes] = useState<string>(defaultInfo.notes ?? '');

  useEffect(() => {
    setName(defaultInfo.name ?? '');
    setNotes(defaultInfo.notes ?? '');
  }, [defaultInfo.name, defaultInfo.notes, mode, visible]);

  const getModalTitle = () => {
    if (mode === 'create') return t('me:family.createFamilyTitle');
    if (mode === 'edit') return t('me:family.editFamilyTitle');
    return t('me:family.deleteFamilyTitle');
  };

  const handleConfirm = async () => {
    await Promise.resolve(onDone(name, notes));
  };

  return (
    <CustomModal
      visible={visible}
      onDismiss={onDismiss}
      title={getModalTitle()}
      handleConfirm={handleConfirm}
      handleCancel={onDismiss}
      containerStyle={ViewComponents.modalContainer}
    >
      {mode === 'delete' ? (
        <View style={[Layout.center]}>
          <Text variant="headlineSmall">{t('me:family.alert.deleteFamilyConfirm')}</Text>
        </View>
      ) : null}

      <TextInput
        label={t('me:family.label.familyName')}
        value={name}
        onChangeText={setName}
        right={<TextInput.Icon icon="close" onPress={() => setName('')} />}
        editable={mode !== 'delete'}
      />
      <TextInput
        label={t('me:family.label.familyNotes')}
        value={notes}
        onChangeText={setNotes}
        right={<TextInput.Icon icon="close" onPress={() => setNotes('')} />}
        editable={mode !== 'delete'}
      />
    </CustomModal>
  );
}
