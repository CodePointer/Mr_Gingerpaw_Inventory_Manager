import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Spacing, Layout, ViewComponents, TextComponents } from '@/styles';
import { ItemOut } from '@/services/types';
import { TextWithView } from '@/components/common/TextWithView';


interface NewItemSectionProps {
  lastUpdated: Date | null;
  expanded: boolean;
  newItems: Record<string, ItemOut>;
  onToggle: () => void;
  onModify: (itemId: string) => void;
  onRemove: (itemId: string) => void;
}


export function NewItemSection({
  lastUpdated,
  expanded,
  newItems,
  onToggle,
  onModify,
  onRemove
}: NewItemSectionProps) {
  const { t } = useTranslation(['draft', 'common']);
  // const [expandedId, setExpandedIds] = useState<string | null>(null);
  // const toggleExpanded = (itemId: string) => {
  //   setExpandedIds((prev) => (prev === itemId ? null : itemId));
  // }

  if (Object.keys(newItems).length === 0) return null;

  return (
    <View style={ViewComponents.card}>
      {/* Header */}
      <TouchableOpacity style={[Layout.row, { marginBottom: Spacing.small }]} onPress={onToggle}>
        <View>
          <Text style={TextComponents.subtitleText}>
          {t('draft:newItemsTitle')}
          </Text>
          <Text style={TextComponents.smallText}>
            {lastUpdated?.toLocaleString() || t('common:defaultText.emptyDate')}
          </Text>
        </View>
        <View style={ViewComponents.touchableIcon}>
          <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={20}/>
        </View>
      </TouchableOpacity>

      {/* New Items List */}
      {expanded && 
        <FlatList
          data={Object.values(newItems)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NewItemCard
              key={`newItem-${item.id}`}
              newItem={item}
              onModify={onModify}
              onRemove={onRemove}
            />
          )}
        />
      }
    </View>
  );
}


interface NewItemCardProps {
  newItem: ItemOut;
  onModify: (itemId: string) => void;
  onRemove: (itemId: string) => void;
}

function NewItemCard({
  newItem,
  onModify,
  onRemove
}: NewItemCardProps) {
  return (
    <View style={[ViewComponents.subCard]}>
      <View style={Layout.row}>
        <View style={ViewComponents.touchableIcon}>
          <Feather name={'file-plus'} size={16}/>
        </View>

        <View style={[Layout.row, { flex: 1, marginLeft: Spacing.small }]}>
          <TextWithView textStyle={TextComponents.plainText}>
            {newItem.name} - {newItem.quantity} {newItem.unit} - {newItem.location}
          </TextWithView>
        </View>

        <TouchableOpacity onPress={() => onModify(newItem.id)}>
          <Feather name={'edit'} size={16}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onRemove(newItem.id)}>
          <Feather name={'trash'} size={16}/>
        </TouchableOpacity>
      </View>
    </View>
  )
}