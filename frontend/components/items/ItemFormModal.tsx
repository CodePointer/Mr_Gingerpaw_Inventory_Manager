import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, Dialog, Icon, IconButton, Portal, Searchbar, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { ItemFormModalValues, ItemOut, ItemOut2FormValues, LocationOut, TagOut } from '@/services/types';
import { CustomModal } from '@/components/common/CustomModal';
import { TagSelector } from '@/components/tags/TagSelector';
import { LocationSelector } from '@/components/common/LocationSelector';
import { Layout, Spacing, ViewComponents } from '@/styles';
import { useTranslation } from 'react-i18next';

interface ItemFormModalProps {
  visible: boolean;
  mode: 'create' | 'edit';
  initial: ItemFormModalValues | null;
  locations: LocationOut[];
  tags: TagOut[];
  existingItems?: ItemOut[];
  selectedItemId?: string | null;
  onCancel: () => void;
  onSubmit: (
    values: ItemFormModalValues,
    mode: 'create' | 'edit',
    selectedItemId?: string | null
  ) => void | Promise<void>;
}

function toFormValues(initial: ItemFormModalValues | null): ItemFormModalValues {
  return {
    name: initial?.name ?? '',
    location: initial?.location ?? '',
    unit: initial?.unit ?? '',
    quantity: initial?.quantity ?? '',
    notes: initial?.notes ?? '',
    checkIntervalDays: initial?.checkIntervalDays ?? '',
    restockThreshold: initial?.restockThreshold ?? '',
    tagIds: new Set(initial?.tagIds ?? []),
    tags: initial?.tags ?? [],
    rawInput: initial?.rawInput,
  };
}

export function ItemFormModal({
  visible,
  mode,
  initial,
  locations,
  tags,
  existingItems = [],
  selectedItemId = null,
  onCancel,
  onSubmit,
}: ItemFormModalProps) {
  const { t } = useTranslation(['items', 'common']);

  const [activeMode, setActiveMode] = useState<'create' | 'edit'>(mode);
  const [values, setValues] = useState<ItemFormModalValues>(toFormValues(initial));
  const [selectedExistingItemId, setSelectedExistingItemId] = useState<string | null>(selectedItemId);
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const [locationExpanded, setLocationExpanded] = useState(false);
  const [existingItemDialogVisible, setExistingItemDialogVisible] = useState(false);
  const [locationCreateDialogVisible, setLocationCreateDialogVisible] = useState(false);
  const [draftLocationName, setDraftLocationName] = useState('');
  const [customLocation, setCustomLocation] = useState<LocationOut | null>(null);

  useEffect(() => {
    if (!visible) return;

    setActiveMode(mode);
    setValues(toFormValues(initial));
    setSelectedExistingItemId(selectedItemId);
    setTagsExpanded(false);
    setLocationExpanded(false);
    setExistingItemDialogVisible(false);
    setLocationCreateDialogVisible(false);
    setDraftLocationName('');
    setCustomLocation(null);
  }, [visible, mode, initial, selectedItemId, existingItems]);

  const selectedExistingItem = useMemo(
    () => existingItems.find((item) => item.id === selectedExistingItemId) ?? null,
    [existingItems, selectedExistingItemId]
  );

  const selectedExistingItemInfo = useMemo(() => {
    if (!selectedExistingItem) return t('items:form.noItemSelected');
    return `${selectedExistingItem.name} (${selectedExistingItem.location}, ${selectedExistingItem.quantity} ${selectedExistingItem.unit})`;
  }, [selectedExistingItem, t]);

  const isEditLocked = activeMode === 'edit' && !selectedExistingItem;

  const mergedLocations = useMemo(() => {
    const deduped = new Map<string, LocationOut>();
    [...locations, ...(customLocation ? [customLocation] : [])].forEach((location) => {
      const normalizedName = location.locationName.trim();
      if (!normalizedName) return;

      const key = normalizedName.toLowerCase();
      if (deduped.has(key)) return;
      deduped.set(key, { ...location, locationName: normalizedName });
    });

    return Array.from(deduped.values());
  }, [locations, customLocation]);

  const handleValueChange = (key: keyof ItemFormModalValues, value: string) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleTag = (tagId: string) => {
    if (isEditLocked) return;

    setValues((prev) => {
      const nextTagIds = new Set(prev.tagIds);
      if (nextTagIds.has(tagId)) {
        nextTagIds.delete(tagId);
      } else {
        nextTagIds.add(tagId);
      }

      return {
        ...prev,
        tagIds: nextTagIds,
        tags: tags.filter((tag) => nextTagIds.has(tag.id)),
      };
    });
  };

  const handleSelectExistingItem = (item: ItemOut) => {
    setSelectedExistingItemId(item.id);
    setValues(ItemOut2FormValues(item));
    setExistingItemDialogVisible(false);
  };

  const toggleLocation = (locationName: string) => {
    if (isEditLocked) return;

    setValues((prev) => ({
      ...prev,
      location: prev.location === locationName ? '' : locationName,
    }));
  };

  const closeLocationCreateDialog = () => {
    setDraftLocationName('');
    setLocationCreateDialogVisible(false);
  };

  const handleOpenLocationCreateDialog = () => {
    if (isEditLocked) return;
    setLocationCreateDialogVisible(true);
  };

  const handleCreateLocation = () => {
    const normalizedName = draftLocationName.trim();
    if (!normalizedName) return;

    const existingLocation = mergedLocations.find(
      (location) => location.locationName.toLowerCase() === normalizedName.toLowerCase()
    );

    if (!existingLocation) {
      setCustomLocation({ locationName: normalizedName, itemCount: 0 });
      handleValueChange('location', normalizedName);
    } else {
      handleValueChange('location', existingLocation.locationName);
    }

    closeLocationCreateDialog();
  };

  const toggleLocationExpanded = () => {
    if (isEditLocked) return;
    setLocationExpanded((prev) => !prev);
  };

  const toggleTagsExpanded = () => {
    if (isEditLocked) return;
    setTagsExpanded((prev) => !prev);
  };

  const handleModeSwitch = (value: string) => {
    const nextMode = value as 'create' | 'edit';
    if (nextMode === activeMode) return;

    setActiveMode(nextMode);
    setTagsExpanded(false);
    setLocationExpanded(false);
    setExistingItemDialogVisible(false);
    closeLocationCreateDialog();

    if (nextMode === 'create') {
      setSelectedExistingItemId(null);
      if (mode === 'create') {
        setValues(toFormValues(initial));
      } else {
        setValues(toFormValues(null));
      }
      return;
    }

    setSelectedExistingItemId(null);
    setValues(toFormValues(null));
  };

  const handleConfirm = () => {
    if (activeMode === 'edit' && !selectedExistingItem) {
      return;
    }

    onSubmit(values, activeMode, activeMode === 'edit' ? (selectedExistingItem?.id ?? null) : null);
  };

  return (
    <>
      <CustomModal
        visible={visible}
        onDismiss={onCancel}
        title={activeMode === 'create' ? 'Create Item' : 'Edit Item'}
        handleConfirm={handleConfirm}
        handleCancel={onCancel}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        containerStyle={{ ...ViewComponents.modalContainer, maxHeight: '92%' }}
      >
        <View style={[Layout.column, { gap: Spacing.small, flex: 1, minHeight: 0 }]}> 
          <SegmentedButtons
            value={activeMode}
            onValueChange={handleModeSwitch}
            buttons={[
              { value: 'create', label: 'Create Item' },
              { value: 'edit', label: 'Edit Item' },
            ]}
          />

          <ScrollView
            style={{ flex: 1, minHeight: 0 }}
            contentContainerStyle={{ gap: Spacing.small, paddingBottom: Spacing.small }}
          >
            <View style={[Layout.column, { gap: Spacing.small }]}> 
              {activeMode === 'edit' ? (
                <View style={[Layout.column, { gap: Spacing.xsmall }]}> 
                  <Text variant="titleMedium">Existing Item</Text>
                  <Pressable
                    onPress={() => setExistingItemDialogVisible(true)}
                    style={ViewComponents.itemModalSectionContainer}
                  >
                    <View style={[ViewComponents.itemModalSectionTitle]}>
                      <Icon source={selectedExistingItem ? 'check' : 'magnify'} size={20} />
                      <Text variant="bodyLarge">
                        {selectedExistingItemInfo}  
                      </Text>
                    </View>
                  </Pressable>
                </View>
              ) : null}

              {activeMode === 'create' && values.rawInput ? (
                <Text variant="bodySmall">Existing Item: {values.rawInput}</Text>
              ) : null}

              <TextInput
                mode="outlined"
                label="Item Name"
                value={values.name}
                onChangeText={(text) => handleValueChange('name', text)}
                placeholder="Enter item name"
                disabled={isEditLocked}
              />

              <TextInput
                mode="outlined"
                label="Unit"
                value={values.unit}
                onChangeText={(text) => handleValueChange('unit', text)}
                placeholder="Enter unit"
                disabled={isEditLocked}
              />

              {activeMode === 'create' ? (
                <TextInput
                  mode="outlined"
                  label="Quantity"
                  value={values.quantity}
                  onChangeText={(text) => handleValueChange('quantity', text)}
                  placeholder="Enter quantity"
                  keyboardType="decimal-pad"
                  disabled={isEditLocked}
                />
              ) : null}

              <ExpendedCardDrawer
                expanded={locationExpanded}
                onToggleExpanded={toggleLocationExpanded}
                disabled={isEditLocked}
                title={t('items:form.locationSectionTitle')}
              >
                <LocationSelector
                  locations={mergedLocations}
                  selectedLocationName={values.location || null}
                  toggleLocation={toggleLocation}
                  onCreateLocation={handleOpenLocationCreateDialog}
                />
              </ExpendedCardDrawer>

              <ExpendedCardDrawer
                expanded={tagsExpanded}
                onToggleExpanded={toggleTagsExpanded}
                disabled={isEditLocked}
                title={t('items:form.tagsSectionTitle')}
              >
                <TagSelector
                  tags={tags}
                  selectedTagIds={values.tagIds}
                  toggleTagIds={toggleTag}
                  onCreateTag={null}
                />
              </ExpendedCardDrawer>

              <TextInput
                mode="outlined"
                label="Notes (optional)"
                value={values.notes}
                onChangeText={(text) => handleValueChange('notes', text)}
                placeholder="Add notes"
                multiline
                disabled={isEditLocked}
              />
            </View>
          </ScrollView>
        </View>
      </CustomModal>

      <ExistingItemSelectDialog
        visible={existingItemDialogVisible}
        items={existingItems}
        selectedItemId={selectedExistingItem?.id ?? null}
        onCancel={() => setExistingItemDialogVisible(false)}
        onSelect={handleSelectExistingItem}
      />

      <LocationCreateDialog
        visible={locationCreateDialogVisible}
        title="Create Location"
        locationLabel="Location"
        locationName={draftLocationName}
        onChangeLocationName={setDraftLocationName}
        onCancel={closeLocationCreateDialog}
        onConfirm={handleCreateLocation}
        confirmLabel="Create"
        cancelLabel="Cancel"
      />
    </>
  );
}


interface ExpendedCardDrawerProps {
  expanded?: boolean;
  onToggleExpanded: () => void;
  disabled: boolean;
  title: string;
  children: React.ReactNode;
}


function ExpendedCardDrawer({ 
  expanded, 
  onToggleExpanded, 
  disabled = false,
  title, 
  children 
}: ExpendedCardDrawerProps) {
  const showContent = expanded && !disabled;

  return (
    <View style={[
      ViewComponents.itemModalSectionContainer,
      {
        borderWidth: showContent ? 2 : 1,
      }
    ]}>
      <Pressable
        onPress={onToggleExpanded}
        disabled={disabled}
        style={({ pressed }) => [
          ViewComponents.itemModalSectionTitle,
          {
            opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          },
        ]}
      >
        <Icon 
          source={showContent ? 'chevron-up' : 'chevron-down'} 
          size={20}
        />
        <Text variant="titleMedium">{title}</Text>
      </Pressable>
      
      {showContent && (
        <View style={ViewComponents.itemModalSectionContent}>
          {children}
        </View>
      )}
    </View>
  );
}

interface ExistingItemSelectDialogProps {
  visible: boolean;
  items: ItemOut[];
  selectedItemId: string | null;
  onCancel: () => void;
  onSelect: (item: ItemOut) => void;
}

function ExistingItemSelectDialog({
  visible,
  items,
  selectedItemId,
  onCancel,
  onSelect,
}: ExistingItemSelectDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!visible) {
      setSearchQuery('');
    }
  }, [visible]);

  const matchedItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return items.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(normalizedQuery);
      const locationMatch = item.location.toLowerCase().includes(normalizedQuery);
      const unitMatch = item.unit.toLowerCase().includes(normalizedQuery);
      return nameMatch || locationMatch || unitMatch;
    });
  }, [items, searchQuery]);

  const displayedItems = useMemo(() => matchedItems.slice(0, 5), [matchedItems]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>Select Existing Item</Dialog.Title>
        <Dialog.Content>
          <Searchbar
            placeholder="Search by name, location, or unit"
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon="magnify"
            clearIcon="close-circle-outline"
          />
          <Text variant="bodySmall" style={{ marginTop: Spacing.small }}>
            {`${matchedItems.length} item(s) match. Showing the first 5.`}
          </Text>

          {searchQuery.trim().length === 0 ? (
            <Text variant="bodyMedium" style={{ marginTop: Spacing.small }}>
              Type to search for existing items.
            </Text>
          ) : displayedItems.length === 0 ? (
            <Text variant="bodyMedium" style={{ marginTop: Spacing.small }}>
              No matching items.
            </Text>
          ) : (
            <ScrollView style={{ maxHeight: 320 }}>
              <View style={[Layout.column, { gap: Spacing.xsmall, marginTop: Spacing.small }]}> 
                {displayedItems.map((item) => {
                  const isSelected = selectedItemId === item.id;
                  return (
                    <Pressable
                      key={`existing-item-dialog-${item.id}`}
                      onPress={() => onSelect(item)}
                      style={({ pressed }) => [
                        ViewComponents.subCard,
                        {
                          marginVertical: 0,
                          borderWidth: isSelected ? 2 : 1,
                          opacity: pressed ? 0.85 : 1,
                        },
                      ]}
                    >
                      <View style={[Layout.row, { justifyContent: 'space-between', alignItems: 'center' }]}> 
                        <Text variant="bodyLarge">{item.name}</Text>
                        {isSelected ? <Text variant="bodySmall">Selected</Text> : null}
                      </View>
                      <Text variant="bodySmall">{`${item.location} (${item.quantity} ${item.unit})`}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

interface LocationCreateDialogProps {
  visible: boolean;
  title: string;
  locationLabel: string;
  locationName: string;
  onChangeLocationName: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  cancelLabel: string;
}

function LocationCreateDialog({
  visible,
  title,
  locationLabel,
  locationName,
  onChangeLocationName,
  onCancel,
  onConfirm,
  confirmLabel,
  cancelLabel,
}: LocationCreateDialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label={locationLabel}
            value={locationName}
            onChangeText={onChangeLocationName}
            mode="outlined"
            autoFocus
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>{cancelLabel}</Button>
          <Button onPress={onConfirm}>{confirmLabel}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
