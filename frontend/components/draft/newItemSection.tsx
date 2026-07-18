import React from 'react';
import { View, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spacing, Layout, ViewComponents } from '@/styles';
import { ItemOut } from '@/services/types';
import { Text, IconButton, useTheme } from 'react-native-paper';

interface NewItemSectionProps {
  lastUpdated: Date | null;
  expanded: boolean;
  newItems: Record<string, ItemOut>;
  onToggle: () => void;
  onRemove: (itemId: string) => void;
}

export function NewItemSection({
  lastUpdated,
  expanded,
  newItems,
  onToggle,
  onRemove
}: NewItemSectionProps) {
  const { t } = useTranslation(['draft', 'common']);

  if (Object.keys(newItems).length === 0) return null;

  return (
    <View style={ViewComponents.draftCardSet}>
      <View style={Layout.rowCenter}>
        <View>
          <Text variant="titleMedium">{t('draft:sections.newItems.title')}</Text>
          <Text variant="bodySmall">{lastUpdated?.toLocaleString() || t('common:emptyState.notSet')}</Text>
        </View>
        <IconButton icon={expanded ? 'chevron-up' : 'chevron-down'} onPress={onToggle} />
      </View>

      {expanded && (
        <FlatList
          data={Object.values(newItems)}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: Spacing.small }}
          renderItem={({ item }) => (
            <NewItemCard
              key={`newItem-${item.id}`}
              newItem={item}
              onRemove={onRemove}
            />
          )}
        />
      )}
    </View>
  );
}

interface NewItemCardProps {
  newItem: ItemOut;
  onRemove: (itemId: string) => void;
}

function NewItemCard({
  newItem,
  onRemove
}: NewItemCardProps) {
  const theme = useTheme();
  const getStatusColor = () => {
    return theme.colors.primaryContainer;
  };

  const tagSummary = (newItem.tags ?? []).map((tag) => tag.name).join(', ');
  const changedTerms = [
    newItem.name,
    newItem.location,
    newItem.unit,
    newItem.quantity,
    newItem.notes,
    ...(newItem.tagIds ?? [])
  ].filter((value) => value !== undefined && value !== null && `${value}` !== '').length;

  return (
    <View style={[ViewComponents.itemCard, { backgroundColor: getStatusColor() }]}>
      <View style={Layout.row}>
        <View style={[Layout.column, { flex: 1, justifyContent: 'center', paddingLeft: Spacing.medium }]}>
          <Text variant="titleMedium">{newItem.name} - {newItem.location}</Text>
          <Text variant="bodyMedium">{tagSummary}</Text>
        </View>

        <View style={[Layout.column, { justifyContent: 'center', marginRight: Spacing.small }]}>
          <Text variant="bodyMedium">{changedTerms} terms added</Text>
        </View>

        <IconButton icon="delete-outline" onPress={() => onRemove(newItem.id)} />
      </View>
    </View>
  );
}
