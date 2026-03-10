import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { CustomModal } from '@/components/common/CustomModal';
import { LocationSelector } from '@/components/common/LocationSelector';
import { TagSelector } from '@/components/tags/TagSelector';
import { LocationOut, TagOut } from '@/services/types';
import { Layout, Spacing, ViewComponents } from '@/styles';


interface ItemFilterModalProps {
  visible: boolean;
  locations: LocationOut[];
  tags: TagOut[];
  selectedLocation: string | null;
  selectedTagIds: Set<string>;
  onCancel: () => void;
  onSubmit: (selectedLocation: string | null, selectedTagIds: Set<string>) => void;
}

export function ItemFilterModal({
  visible,
  locations,
  tags,
  selectedLocation,
  selectedTagIds,
  onCancel,
  onSubmit,
}: ItemFilterModalProps) {
  const { t } = useTranslation(['items']);
  const [nextLocation, setNextLocation] = useState<string | null>(selectedLocation);
  const [nextTagIds, setNextTagIds] = useState<Set<string>>(new Set(selectedTagIds));

  useEffect(() => {
    if (!visible) return;
    setNextLocation(selectedLocation);
    setNextTagIds(new Set(selectedTagIds));
  }, [visible, selectedLocation, selectedTagIds]);

  const toggleLocation = (locationName: string) => {
    setNextLocation((prev) => (prev === locationName ? null : locationName));
  };

  const toggleTagIds = (tagId: string) => {
    setNextTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    onSubmit(nextLocation, new Set(nextTagIds));
  };

  return (
    <CustomModal
      visible={visible}
      onDismiss={onCancel}
      title={t('items:itemFilterBar')}
      handleConfirm={handleConfirm}
      handleCancel={onCancel}
      containerStyle={ViewComponents.modalContainer}
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={[Layout.column, { gap: Spacing.small }]}> 
          <Text variant="titleMedium">{t('items:itemForm.label.location')}</Text>
          <LocationSelector
            locations={locations}
            selectedLocationName={nextLocation}
            toggleLocation={toggleLocation}
            onCreateLocation={null}
          />

          <Text variant="titleMedium">{t('items:itemForm.label.tags')}</Text>
          <TagSelector
            tags={tags}
            selectedTagIds={nextTagIds}
            toggleTagIds={toggleTagIds}
            onCreateTag={null}
          />
        </View>
      </ScrollView>
    </CustomModal>
  );
}
