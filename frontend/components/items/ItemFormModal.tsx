// components/items/ItemFormModal.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ItemOut } from '@/services/types';
import { useFamily, useItems, useTags, useUser } from '@/hooks';
import { TagSelector } from '@/components/tags/TagSelector';
import InputSelector from '@/components/common/InputSelector';
import { InputField } from '@/components/common/InputField';
import Button from '@/components/common/Button';
import { Layout, Colors, Typography, Spacing, ViewComponents, TextComponents } from '@/styles';
import { TextWithView } from '../common/TextWithView';


interface ItemFormModalProps {
  visible: boolean;
  mode: 'create' | 'edit';
  initial: ItemOut | null;
  onClose: () => void;
  onDone: () => void;
}


export function ItemFormModal({
  visible,
  mode,
  initial,
  onClose,
  onDone,
}: ItemFormModalProps) {
  const { t } = useTranslation();
  const { createItem, updateItem, deleteItem } = useItems();
  const { tags, fetchTags, createTag } = useTags();
  const { currentFamily } = useFamily();
  const { user } = useUser();

  const [name, setName] = useState(initial?.name || '');
  const [location, setLocation] = useState(initial?.location || '');
  const [unit, setUnit] = useState(initial?.unit || '');
  const [quantity, setQuantity] = useState(initial?.quantity.toString() || '');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [checkDays, setCheckDays] = useState(
    initial?.checkIntervalDays?.toString() || ''
  );
  const [restockThreshold, setRestockThreshold] = useState(
    initial?.restockThreshold?.toString() || '-1'
  );
  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(
    new Set(initial?.tags?.map((t) => t.id))
  );

  useEffect(() => {
    fetchTags();
  }, []);

  const toggleTag = (id: number) => {
    const newSet = new Set(selectedTagIds);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelectedTagIds(newSet);
  }

  const resetForm = () => {
    if (mode === 'create') {
      setName('');
      setLocation('');
      setUnit('');
      setQuantity('');
      setNotes('');
      setCheckDays('');
      setRestockThreshold('-1');
      setSelectedTagIds(new Set());
    } else if (mode === 'edit') {
      setName(initial?.name || '');
      setLocation(initial?.location || '');
      setUnit(initial?.unit || '');
      setNotes(initial?.notes || '');
      setCheckDays(initial?.checkIntervalDays?.toString() || '');
      setRestockThreshold(initial?.restockThreshold?.toString() || '-1');
      setSelectedTagIds(new Set(initial?.tags?.map((t) => t.id)));
    }
  };

  useEffect(resetForm, [initial]);

  const handleSubmit = async () => {
    if (!currentFamily || !user) {
      return Alert.alert('Please select a family and log in to create an item');
    }

    const handleCreateItem = async () => {
      if (!name || !location || !unit) {
        return Alert.alert('Please fill in all required fields');
      }
      await createItem({
        name: name,
        unit: unit,
        quantity: parseFloat(quantity),
        location: location,
        familyId: currentFamily.id,
        ownerId: user.id,
        notes: notes,
        checkIntervalDays: parseInt(checkDays),
        restockThreshold: restockThreshold ? parseFloat(restockThreshold) : undefined,
        tags: Array.from(selectedTagIds),
      });
      // console.log('quantity:', quantity);
      resetForm();
    }

    const handleUpdateItem = async () => {
      if (!initial) {
        return Alert.alert('No item selected');
      }
      await updateItem(initial.id, {
        name: name,
        unit: unit,
        location: location,
        familyId: currentFamily.id,
        ownerId: user.id,
        notes: notes,
        checkIntervalDays: parseInt(checkDays),
        restockThreshold: restockThreshold ? parseFloat(restockThreshold) : undefined,
        tags: Array.from(selectedTagIds),
      });
    }

    try {
      if (mode === 'create') {
        await handleCreateItem();
      } else if (mode === 'edit') {
        await handleUpdateItem();
      }
    } catch (error) {
      console.error(error);
    } finally {
      onDone();
    }
  };

  const onDelete = async () => {
    if (!initial) {
      return Alert.alert('No item selected');
    }
    const ok = await deleteItem(initial.id);
    onDone();
    // Alert.alert('确认删除？', '', [
    //   { text: '取消', style: 'cancel' },
    //   {
    //     text: '删除',
    //     style: 'destructive',
    //     onPress: async () => {
    //       const ok = await deleteItem(initial.id);
    //       if (ok) {
    //         Alert.alert('删除成功');
    //         onDone();
    //       } else {
    //         Alert.alert('删除失败');
    //       }
    //     },
    //   },
    // ]);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[Layout.center, ViewComponents.modalOverlay, { flex: 1 }]}>
        <View style={ViewComponents.modalContainer}>
          <ScrollView
            style={{ maxHeight: Dimensions.get('window').height * 0.8, padding: Spacing.medium}}
          >
            <TextWithView textStyle={TextComponents.titleText} viewStyle={[Layout.center, Layout.modalPadding]}>
              {mode === 'create' ? t('items.itemModal.headingCreate') : t('items.itemModal.headingEdit')}
            </TextWithView>

            <InputField
              label={t('items.itemModal.labelName')}
              value={name}
              style={Layout.modalPadding}
              onChangeText={setName}
              placeholder={t('items.itemModal.placeholderName')}
            // editable={mode === 'create'}
            />
            <InputField
              label={t('items.itemModal.labelUnit')}
              value={unit}
              style={Layout.modalPadding}
              onChangeText={setUnit}
              placeholder={t('items.itemModal.placeholderUnit')}
            // editable={mode === 'create'}
            />
            <InputField
              label={t('items.itemModal.labelLocation')}
              value={location}
              style={Layout.modalPadding}
              onChangeText={setLocation}
              placeholder={t('items.itemModal.placeholderLocation')}
            // editable={mode === 'create'}
            />
            {mode === 'create' && <InputField
              label={t('items.itemModal.labelQuantity')}
              value={quantity}
              style={Layout.modalPadding}
              onChangeText={setQuantity}
              keyboardType='numeric'
              placeholder={t('items.itemModal.placeholderQuantity')}
            // editable={mode === 'create'}
            />}

            <TagSelector
              tags={tags}
              selectedTagIds={selectedTagIds}
              style={Layout.modalPadding}
              toggleTagIds={toggleTag}
              onCreateTag={createTag}
            />
            <InputField
              label={t('items.itemModal.labelNotes')}
              value={notes}
              style={Layout.modalPadding}
              onChangeText={setNotes}
            />
            <InputSelector
              label={t('items.itemModal.labelRestock')}
              value={restockThreshold}
              style={Layout.modalPadding}
              onChange={setRestockThreshold}
              placeholder={t('items.itemModal.placeholderRestock')}
              presets={['-1', '0.0', '1.0', '3.0', '10.0']}
            />
            <InputSelector
              label={t('items.itemModal.labelCheck')}
              value={checkDays}
              style={Layout.modalPadding}
              onChange={setCheckDays}
              presets={['3', '7', '15', '30', '90']}
            />

            <View style={[Layout.buttonRow, Layout.modalPadding]}>
              <Button style={ViewComponents.buttonInRow} onPress={handleSubmit}>
                {t('items.itemModal.buttonConfirm')}
              </Button>
              <Button style={ViewComponents.buttonInRow} onPress={onClose}>
                {t('items.itemModal.buttonCancel')}
              </Button>
            </View>
            {mode === 'edit' && (
              <Button style={[ViewComponents.buttonInRow, Layout.modalPadding]} onPress={onDelete}>
                {t('items.itemModal.buttonDelete')}
              </Button>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
