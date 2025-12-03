import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Spacing, Layout, ViewComponents, TextComponents } from '@/styles';
import { diffItemOuts, ItemOut, ItemUpdate } from '@/services/types';
import { TextWithView } from '../common/TextWithView';
import { t } from 'i18next';


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
  const [expandedId, setExpandedIds] = useState<string | null>(null);

  const toggleExpanded = (itemId: string) => {
    setExpandedIds((prev) => (prev === itemId ? null : itemId));
  }

  if (Object.keys(updatedItems).length === 0) return null;

  return (
    <View style={ViewComponents.card}>
      {/* Header */}
      <TouchableOpacity style={[Layout.row, { marginBottom: Spacing.small }]} onPress={onToggle}>
        <View>
          <Text style={TextComponents.subtitleText}>
            {t('draft:updatedItemsTitle')}
          </Text>
          <Text style={TextComponents.smallText}>
            {lastUpdated?.toLocaleString() || t('common:defaultText.emptyDate')}
          </Text>
        </View>
        <View style={ViewComponents.touchableIcon}>
          <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={20} />
        </View>
      </TouchableOpacity>

      {/* Updated Items List */}
      {expanded && 
        <FlatList
          data={Object.values(updatedItems)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UpdatedItemCard
              key={item.id}
              baseItem={baseItems.find(it => item.id === it.id) ?? null}
              updatedItem={item}
              expanded={expandedId === item.id}
              onToggle={() => toggleExpanded(item.id)}
              onModify={onModify}
              onRemove={onRemove}
            />
          )}
        />
      }
    </View>
  );
}

interface UpdatedItemCardProps {
  expanded: boolean;
  baseItem: ItemOut | null;
  updatedItem: ItemOut;
  onToggle: () => void;
  onModify: (itemId: string) => void;
  onRemove: (itemId: string) => void;
}


export function UpdatedItemCard({
  expanded,
  baseItem,
  updatedItem,
  onToggle,
  onModify,
  onRemove
}: UpdatedItemCardProps) {

  if (baseItem === null) return null;
  const updatedInfo = diffItemOuts(updatedItem, baseItem);
  const diffKeys = (Object.keys(updatedInfo) as Array<keyof ItemUpdate>)
    .filter(k => k !=='id' && k !== 'familyId' && k !== 'ownerId')
    .filter(k => updatedInfo[k] !== undefined)

  console.log("UpdatedItemCard diffKeys:", diffKeys);

  return (
    <View style={ViewComponents.subCard}>
      <View style={Layout.column}>
        {/* <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={16}/> */}
        {/* <Feather name={'file-text'} size={16}/> */}
        <TouchableOpacity onPress={onToggle}>
          {updatedItem.rawInput && (
            <TextWithView textStyle={TextComponents.rawInputText} viewStyle={{ marginHorizontal: Spacing.small }}>
              "{updatedItem.rawInput}"
            </TextWithView>
          )}
          <View style={[Layout.row, { marginHorizontal: Spacing.small }]}>
            <TextWithView textStyle={TextComponents.plainText} viewStyle={{ flex: 1 }}>
              {updatedItem.name} - {updatedItem.unit} - {updatedItem.location}
            </TextWithView>
            <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={16}/>
          </View>
        </TouchableOpacity>

        {expanded && (
          <View style={[Layout.row, { marginHorizontal: Spacing.small }]}>
            <View style={{ flex: 1 }}>
              <FlatList 
                data={diffKeys}
                keyExtractor={(key) => `${updatedItem.id}-${key}`}
                renderItem={({ item: key }) => {
                  if (key === 'tagIds') {
                    return (
                      <Text style={TextComponents.smallText}>
                        {t('TODO: handle tagIds diff')}
                      </Text>
                    );
                  } else {
                    return (
                      <Text style={TextComponents.smallText}>
                        {baseItem[key]} {'->'} {updatedItem[key]}
                      </Text>
                    );
                  }  
                }}
              />
            </View>
            <View>
              <TouchableOpacity onPress={() => onModify(updatedItem.id)}>
                <Feather name={'edit'} size={16}/>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => onRemove(updatedItem.id)}>
                <Feather name={'trash'} size={16}/>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
      </View>
    </View>
  );
}