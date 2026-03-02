import React from 'react';
import { View, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spacing, Layout, ViewComponents } from '@/styles';
import { ItemDelete, ItemOut } from '@/services/types';
import { Text, IconButton, useTheme } from 'react-native-paper';

interface DeletedItemSectionProps {
  lastUpdated: Date | null;
  expanded: boolean;
  deletedItems: Record<string, ItemDelete>;
  allItems: ItemOut[];
  onToggle: () => void;
  onRemove: (itemId: string) => void;
}

export function DeletedItemSection({
  lastUpdated,
  expanded,
  deletedItems,
  allItems,
  onToggle,
  onRemove
}: DeletedItemSectionProps) {
  const { t } = useTranslation(['draft', 'common']);

  if (Object.keys(deletedItems).length === 0) return null;

  return (
    <View style={ViewComponents.draftCardSet}>
      <View style={Layout.rowCenter}>
        <View>
          <Text variant="titleMedium">{t('draft:deletedItemsTitle')}</Text>
          <Text variant="bodySmall">{lastUpdated?.toLocaleString() || t('common:defaultText.emptyDate')}</Text>
        </View>
        <IconButton icon={expanded ? 'chevron-up' : 'chevron-down'} onPress={onToggle} />
      </View>

      {expanded && (
        <FlatList
          data={Object.values(deletedItems)}
          keyExtractor={(item) => `del-${item.id}`}
          contentContainerStyle={{ gap: Spacing.small }}
          renderItem={({ item }) => (
            <DeletedItemCard
              key={`deletedItem-${item.id}`}
              deletedItem={allItems.find((it) => it.id === item.id) ?? null}
              onRemove={onRemove}
            />
          )}
        />
      )}
    </View>
  );
}

interface DeletedItemCardProps {
  deletedItem: ItemOut | null;
  onRemove: (itemId: string) => void;
}

function DeletedItemCard({
  deletedItem,
  onRemove
}: DeletedItemCardProps) {
  if (deletedItem === null) return null;

  const theme = useTheme();
  const getStatusColor = () => {
    return theme.colors.primaryContainer;
  };

  const tagSummary = (deletedItem.tags ?? []).map((tag) => tag.name).join(', ');

  return (
    <View style={[ViewComponents.itemCard, { backgroundColor: getStatusColor() }]}>
      <View style={Layout.row}>
        <View style={[Layout.column, { flex: 1, justifyContent: 'center', paddingLeft: Spacing.medium }]}>
          <Text variant="titleMedium">{deletedItem.name} - {deletedItem.location}</Text>
          <Text variant="bodyMedium">{tagSummary}</Text>
        </View>

        <View style={[Layout.column, { justifyContent: 'center', marginRight: Spacing.small }]}>
          <Text variant="bodyMedium">Deleted</Text>
        </View>
        <IconButton icon="delete-outline" onPress={() => onRemove(deletedItem.id)} />
      </View>
    </View>
  );
}
