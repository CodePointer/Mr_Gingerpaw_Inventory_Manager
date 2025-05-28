// components/items/ItemFormModal.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { ItemOut } from '@/services/types';
import { useFamily, useItems, useTags, useUser } from '@/hooks';
import { useTranslation } from 'react-i18next';
import TagSelectorWithCreate from '@/components/common/TagSelectorWithCreate';
import InputSelector from '@/components/common/InputSelector';
import { InputField } from '@/components/common/InputField';
import Button from '@/components/common/Button';
import { Layout, Colors, Typography, Spacing } from '@/styles';


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
    setName('');
    setLocation('');
    setUnit('');
    setQuantity('');
    setNotes('');
    setCheckDays('');
    setRestockThreshold('-1');
    setSelectedTagIds(new Set());
  };

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
      console.log('quantity:', quantity);
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
      <View style={{ 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
      }}>
      
      <ScrollView 
        style={[Layout.container, {maxHeight: '80%'}]} 
        contentContainerStyle={{ padding: 16 }}
      >
        <View style={Layout.center}>
          <Text style={Typography.heading}>
            {mode === 'create' ? t('itemModal.headingCreate') : t('itemModal.headingEdit')}
          </Text>
        </View>

        <InputField 
          label={t('itemModal.labelName')}
          value={name}
          onChangeText={setName}
          placeholder={t('itemModal.placeholderName')}
          // editable={mode === 'create'}
        />
        <InputField 
          label={t('itemModal.labelUnit')}
          value={unit}
          onChangeText={setUnit}
          placeholder={t('itemModal.placeholderUnit')}
          // editable={mode === 'create'}
        />
        <InputField 
          label={t('itemModal.labelLocation')}
          value={location}
          onChangeText={setLocation}
          placeholder={t('itemModal.placeholderLocation')}
          // editable={mode === 'create'}
        />
        {mode === 'create' && <InputField 
          label={t('itemModal.labelQuantity')}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType='numeric'
          placeholder={t('itemModal.placeholderQuantity')}
          // editable={mode === 'create'}
        />}

        {/* <hr /> */}

        <TagSelectorWithCreate 
          tags={tags}
          selectedTagIds={selectedTagIds}
          toggleTag={toggleTag}
          onCreateTag={createTag}
        />
        <InputField
          label={t('itemModal.labelNotes')}
          value={notes}
          onChangeText={setNotes}
        />
        <InputSelector
          label={t('itemModal.labelRestock')}
          value={restockThreshold}
          onChange={setRestockThreshold}
          placeholder={t('itemModal.placeholderRestock')}
          presets={['-1', '0.0', '1.0', '3.0', '10.0']}
        />
        <InputSelector 
          label={t('itemModal.labelCheck')}
          value={checkDays}
          onChange={setCheckDays}
          presets={['3', '7', '15', '30', '90']}
        />

        <View style={styles.buttonRow}>
          <Button style={styles.ok} onPress={handleSubmit}>
            {t('itemModal.buttonConfirm')}
          </Button>
          <Button style={styles.cancel} onPress={onClose}>
            {t('itemModal.buttonCancel')}
          </Button>
        </View>
        {mode === 'edit' && (
          <Button style={styles.delete} onPress={onDelete}>
            {t('itemModal.buttonDelete')}
          </Button>
        )}
      </ScrollView>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.medium,
  },
  ok: { 
    flex: 1, 
    marginRight: Spacing.small
  },
  cancel: {
    flex: 1, 
    backgroundColor: Colors.borderSoft, 
    marginLeft: Spacing.small,
  },
  delete: {
    flex: 1,
    marginTop: Spacing.medium,
    backgroundColor: Colors.primaryDeep,
  },
});