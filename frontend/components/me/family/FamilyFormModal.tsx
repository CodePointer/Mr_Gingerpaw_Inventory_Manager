// components/items/ItemFormModal.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Modal,
  Alert,
  Dimensions
} from 'react-native';
import { useFamily } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { InputField } from '@/components/common/InputField';
import Button from '@/components/common/Button';
import { TextWithView } from '@/components/common/TextWithView';
import { Colors, Layout, Spacing, TextComponents, ViewComponents } from '@/styles';


interface FamilyFormModalProps {
  visible: boolean;
  mode: 'create' | 'edit' | 'delete';
  onClose: () => void;
  onDone: () => void;
}

export function FamilyFormModal({
  visible,
  mode,
  onClose,
  onDone
}: FamilyFormModalProps) {
  const { t } = useTranslation(['me', 'common']);
  const { currentFamily, createFamily, updateFamily, deleteFamily } = useFamily();

  const [name, setName] = useState<string>(currentFamily?.name ?? '');
  const [notes, setNotes] = useState<string>(currentFamily?.notes ?? '');

  const resetForm = () => {
    if (mode === 'create') {
      setName('');
      setNotes('');
    } else {
      setName(currentFamily?.name ?? '');
      setNotes(currentFamily?.notes ?? '');
    }
  };

  useEffect(() => {
    resetForm();
  }, [visible]);

  const handleSubmit = async () => {
    try {
      if (mode === 'create') {
        if (name === '') {
          return Alert.alert(t('me:family.alert.emptyName'));
        }
        await createFamily({
          name: name,
          notes: notes === '' ? undefined : notes
        });
        resetForm();
      } else if (mode === 'edit') {
        if (currentFamily === null) {
          return Alert.alert(t('me:family.alert.emptyFamily'));
        }
        await updateFamily({
          name: name === '' ? undefined : name,
          notes: notes === '' ? undefined : notes
        })
      } else {
        if (currentFamily === null) {
          return Alert.alert(t('me:family.alert.emptyFamily'));
        }
        await deleteFamily();
      }
    } catch (error) {
      console.error(error);
    } finally {
      onDone();
    }
  };

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
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[Layout.center, ViewComponents.modalOverlay, { flex: 1 }]}>
        <View style={ViewComponents.modalContainer}>
          <ScrollView
            style={{ maxHeight: Dimensions.get('window').height * 0.8, padding: Spacing.medium}}
            // contentContainerStyle={Layout.contentColumn}
          >
            <TextWithView
              textStyle={TextComponents.subtitleText}
              viewStyle={{...Layout.center, ...Layout.contentColumn}}
            >
              {getModalTitle()}
            </TextWithView>

            <InputField
              label={t('me:family.label.familyName')}
              value={name}
              style={Layout.contentColumn}
              onChangeText={setName}
              placeholder={t('me:family.placeholder.familyName')}
              editable={mode !== 'delete'}
            />

            <InputField
              label={t('me:family.label.familyNotes')}
              value={notes}
              style={Layout.contentColumn}
              onChangeText={setNotes}
              placeholder={t('me:family.placeholder.familyNotes')}
              editable={mode !== 'delete'}
            />

            {mode === 'delete' && <TextWithView
              textStyle={TextComponents.subtitleText}
              viewStyle={{...Layout.center, ...Layout.contentColumn}}
            >
              {t('me:family.alert.deleteFamilyConfirm')}
            </TextWithView>}

            <View style={[Layout.buttonRow, Layout.contentColumn]}>
              <Button
                style={ViewComponents.buttonInRow}
                onPress={handleSubmit}
              >
                {t('common:button.confirm')}
              </Button>
              <Button
                style={[ViewComponents.buttonInRow, { backgroundColor: Colors.textMuted }]}
                onPress={onClose}
              >
                {t('common:button.cancel')}
              </Button>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
