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
    if (mode === 'create') return t('me:family.modal.createTitle');
    if (mode === 'edit') return t('me:family.modal.editTitle');
    return t('me:family.modal.deleteTitle');
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
          <Text variant="headlineSmall">{t('me:family.messages.deleteConfirm')}</Text>
        </View>
      ) : null}

      <TextInput
        label={t('me:family.form.name')}
        value={name}
        onChangeText={setName}
        right={<TextInput.Icon icon="close" onPress={() => setName('')} />}
        editable={mode !== 'delete'}
      />
      <TextInput
        label={t('me:family.form.notes')}
        value={notes}
        onChangeText={setNotes}
        right={<TextInput.Icon icon="close" onPress={() => setNotes('')} />}
        editable={mode !== 'delete'}
      />
    </CustomModal>
  );
}
