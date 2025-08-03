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
import { ItemFormModalValues, LocationOut, TagOut } from '@/services/types';
import { useFamily, useItems, useTags, useUser } from '@/hooks';
import { TagSelector } from '@/components/tags/TagSelector';
import InputSelector from '@/components/common/InputSelector';
import { InputField } from '@/components/common/InputField';
import Button from '@/components/common/Button';
import { Layout, Colors, Typography, Spacing, ViewComponents, TextComponents } from '@/styles';
import { TextWithView } from '../common/TextWithView';
import { Tag } from '@/services/utils/types';


interface ItemFormModalProps {
  visible: boolean;
  mode: 'create' | 'edit';
  initial: ItemFormModalValues | null;
  locations: LocationOut[];
  tags: TagOut[];
  onCancel: () => void;
  onSubmit: (values: ItemFormModalValues, mode: 'create' | 'edit') => void;
}


export function ItemFormModal({
  visible,
  mode,
  initial,
  locations,
  tags,
  onCancel,
  onSubmit,
}: ItemFormModalProps) {
  const { t } = useTranslation(['item', 'common']);
  // const { tags, fetchTags, createTag } = useTags();

  const initialValues: ItemFormModalValues = {
    name: initial?.name ?? '',
    location: initial?.location ?? '',
    unit: initial?.unit ?? '',
    quantity: initial?.quantity.toString() ?? '',
    notes: initial?.notes ?? '',
    checkIntervalDays: initial?.checkIntervalDays ?? '',
    restockThreshold: initial?.restockThreshold ?? '',
    tagIds: initial?.tagIds ?? new Set<string>(),
    rawInput: initial?.rawInput ?? undefined,
  }
  const [values, setValues] = useState<ItemFormModalValues>(initialValues);

  // console.log('ItemFormModal values:', values);

  const toggleTag = (id: string) => {
    const newSet = new Set(values.tagIds);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setValues({ ...values, tagIds: newSet });
  }

  const resetForm = () => {
    setValues(initialValues);
  };
  useEffect(resetForm, [initial]);

  const handleValueChange = (key: keyof ItemFormModalValues, value: string) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={[Layout.center, ViewComponents.modalOverlay, { flex: 1 }]}>
        <View style={ViewComponents.modalContainer}>
          <ScrollView
            style={{ maxHeight: Dimensions.get('window').height * 0.8, padding: Spacing.medium}}
          >
            <TextWithView textStyle={TextComponents.titleText} viewStyle={[Layout.center, Layout.modalPadding]}>
              {mode === 'create' ? t('items:itemForm.titleCreate') : t('items:itemForm.titleEdit')}
            </TextWithView>

            {values.rawInput && (<TextWithView
              textStyle={TextComponents.plainText}
              viewStyle={[Layout.center, Layout.modalPadding]}
            >
              "{values.rawInput}"
            </TextWithView>)}

            <InputField
              label={t('items:itemForm.label.name')}
              value={values.name}
              style={Layout.modalPadding}
              onChangeText={(text) => handleValueChange('name', text)}
              placeholder={t('items:itemForm.placeholder.name')}
            // editable={mode === 'create'}
            />
            <InputField
              label={t('items:itemForm.label.unit')}
              value={values.unit}
              style={Layout.modalPadding}
              onChangeText={(text) => handleValueChange('unit', text)}
              placeholder={t('items:itemForm.placeholder.unit')}
            // editable={mode === 'create'}
            />
            <InputSelector
              label={t('items:itemForm.label.location')}
              value={values.location}
              style={Layout.modalPadding}
              onChange={(text) => handleValueChange('location', text)}
              placeholder={t('items:itemForm.placeholder.location')}
              presets={locations.map(loc => loc.locationName)}
            />
            {mode === 'create' && <InputField
              label={t('items:itemForm.label.quantity')}
              value={values.quantity}
              style={Layout.modalPadding}
              onChangeText={(text) => handleValueChange('quantity', text)}
              // keyboardType='numeric'
              placeholder={t('items:itemForm.placeholder.quantity')}
            // editable={mode === 'create'}
            />}

            <TagSelector
              tags={tags}
              selectedTagIds={values.tagIds}
              style={Layout.modalPadding}
              toggleTagIds={toggleTag}
              onCreateTag={null}
            />
            <InputField
              label={t('items:itemForm.label.note')}
              value={values.notes}
              style={Layout.modalPadding}
              onChangeText={(text) => handleValueChange('notes', text)}
              placeholder={t('items:itemForm.placeholder.note')}
            />
            <InputSelector
              label={t('items:itemForm.label.restock')}
              value={values.restockThreshold?.toString() ?? ''}
              style={Layout.modalPadding}
              onChange={(text) => handleValueChange('restockThreshold', text)}
              placeholder={t('items:itemForm.placeholder.restock')}
              presets={['-1', '0.0', '1.0', '3.0', '10.0']}
            />
            <InputSelector
              label={t('items:itemForm.label.check')}
              value={values.checkIntervalDays?.toString() ?? ''}
              style={Layout.modalPadding}
              onChange={(text) => handleValueChange('checkIntervalDays', text)}
              placeholder={t('items:itemForm.placeholder.check')}
              presets={['3', '7', '15', '30', '90']}
            />

            <View style={[Layout.buttonRow, Layout.modalPadding]}>
              <Button style={ViewComponents.buttonInRow} onPress={() => onSubmit(values, mode)}>
                {t('common:button.confirm')}
              </Button>
              <Button style={ViewComponents.buttonInRow} onPress={onCancel}>
                {t('common:button.cancel')}
              </Button>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
