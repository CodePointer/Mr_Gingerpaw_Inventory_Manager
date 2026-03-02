import React from 'react';
import { View, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spacing, Layout, ViewComponents } from '@/styles';
import { diffItemOuts, ItemOut, ItemUpdate } from '@/services/types';
import { Text, IconButton, useTheme } from 'react-native-paper';

interface UpdatedItemSectionProps {
  lastUpdated: Date | null;
  expanded: boolean;
  updatedItems: Record<string, ItemOut>;
  baseItems: ItemOut[];
  onToggle: () => void;
  onModify: (itemId: string) => void;
  onRemove: (itemId: string) => void;
}

export function UpdatedItemSection({
  lastUpdated,
  expanded,
  updatedItems,
  baseItems,
  onToggle,
  onModify,
  onRemove
}: UpdatedItemSectionProps) {
  const { t } = useTranslation(['draft', 'common']);
  if (Object.keys(updatedItems).length === 0) return null;

  return (
    <View style={ViewComponents.draftCardSet}>
      <View style={[Layout.rowCenter]}>
        <View>
          <Text variant="titleMedium">{t('draft:updatedItemsTitle')}</Text>
          <Text variant="bodySmall">{lastUpdated?.toLocaleString() || t('common:defaultText.emptyDate')}</Text>
        </View>
        <IconButton icon={expanded ? 'chevron-up' : 'chevron-down'} onPress={onToggle} />
      </View>

      {expanded && (
        <FlatList
          data={Object.values(updatedItems)}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: Spacing.small }}
          renderItem={({ item }) => (
            <UpdatedItemCard
              key={item.id}
              baseItem={baseItems.find((it) => item.id === it.id) ?? null}
              updatedItem={item}
              onRemove={onRemove}
              onModify={onModify}
            />
          )}
        />
      )}
    </View>
  );
}

interface UpdatedItemCardProps {
  baseItem: ItemOut | null;
  updatedItem: ItemOut;
  onRemove: (itemId: string) => void;
  onModify: (itemId: string) => void;
}

export function UpdatedItemCard({
  baseItem,
  updatedItem,
  onModify,
  onRemove
}: UpdatedItemCardProps) {
  if (baseItem === null) return null;

  const theme = useTheme();
  const getStatusColor = () => {
    return theme.colors.primaryContainer;
  };

  const updatedInfo = diffItemOuts(updatedItem, baseItem);
  const diffKeys = (Object.keys(updatedInfo) as Array<keyof ItemUpdate>)
    .filter((k) => k !== 'id' && k !== 'familyId' && k !== 'ownerId')
    .filter((k) => updatedInfo[k] !== undefined);
  const tagSummary = (updatedItem.tags ?? []).map((tag) => tag.name).join(', ');

  return (
    <View style={[ViewComponents.itemCard, { backgroundColor: getStatusColor() }]}>
      <View style={Layout.row}>
        <IconButton icon="pencil-outline" onPress={() => onModify(updatedItem.id)} />

        <View style={[Layout.column, { flex: 1, justifyContent: 'center'}]}> 
          <Text variant="titleMedium">{updatedItem.name} - {updatedItem.location}</Text>
          <Text variant="bodyMedium">{tagSummary}</Text>
        </View>

        <View style={[Layout.column, { justifyContent: 'center', marginRight: Spacing.small }]}>
          <Text variant="bodyMedium">{diffKeys.length} terms changed</Text>
        </View>
        <IconButton icon="delete-outline" onPress={() => onRemove(updatedItem.id)} />
      </View>
    </View>
  );
}
