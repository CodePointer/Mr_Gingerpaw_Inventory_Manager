import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Spacing, Layout, ViewComponents, TextComponents } from '@/styles';
import { ItemDelete, ItemOut } from '@/services/types';
import { TextWithView } from '@/components/common/TextWithView';


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
    <View style={ViewComponents.card}>
      {/* Header */}
      <TouchableOpacity style={[Layout.row, { marginBottom: Spacing.small }]} onPress={onToggle}>
        <View>
          <Text style={TextComponents.subtitleText}>
            {t('draft:deletedItemsTitle')}
          </Text>
          <Text style={TextComponents.smallText}>
            {lastUpdated?.toLocaleString() || t('common:defaultText.emptyDate')}
          </Text>
        </View>
        <View style={ViewComponents.touchableIcon}>
          <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={20} />
        </View>
      </TouchableOpacity>

      {/* New Items List */}
      {expanded &&
        <FlatList
          data={Object.values(deletedItems)}
          keyExtractor={(item) => `del-${item.id}`}
          renderItem={({ item }) => (
            <DeletedItemCard
              key={`deletedItem-${item.id}`}
              deletedItem={allItems.find(it => it.id === item.id) ?? null}
              onRemove={onRemove}
            />
          )}
        />
      }
    </View>
  )
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
  return (
    <View style={[ViewComponents.subCard]}>
      <View style={Layout.row}>
        <View style={ViewComponents.touchableIcon}>
          <Feather name={'file-minus'} size={16} />
        </View>

        <View style={[Layout.row, { flex: 1, marginLeft: Spacing.small }]}>
          <TextWithView textStyle={TextComponents.plainText}>
            {deletedItem.name} - {deletedItem.quantity} {deletedItem.unit} - {deletedItem.location}
          </TextWithView>
        </View>

        <TouchableOpacity onPress={() => onRemove(deletedItem.id)}>
          <Feather name={'trash'} size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );
}