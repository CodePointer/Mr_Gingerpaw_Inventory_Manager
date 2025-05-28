import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { ItemOut, TagOut } from '@/services/types';
import { Feather, AntDesign } from '@expo/vector-icons';
import { Components, Layout, Typography, Colors } from '@/styles';
import { TransactionModifier } from '@/components/items/TransactionModifier'


interface ItemCardProps {
  item: ItemOut;
  draftDelta: number;
  expanded: boolean;
  onToggle: () => void | null;
  onEdit: (item: ItemOut) => void | null;
  // onQuantityChange?: (newQuantity: number) => void;
}

export function ItemCard({
  item,
  draftDelta,
  expanded = false,
  onToggle,
  onEdit,
  // onQuantityChange,
}: ItemCardProps) {

  const getStatusColor = () => {
    if (draftDelta > 0) {
      return Colors.success;
    } else if (draftDelta < 0) {
      return Colors.failed;
    } else {
      return Colors.backgroundCard;
    }
  };

  return (
    <View style={[
      Layout.itemCard, 
      { backgroundColor: getStatusColor() }
    ]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity 
          onPress={() => onToggle()}
          style={{ marginRight: 10 }}
        >
          <Feather 
            name={expanded ? 'chevron-up' : 'chevron-down'}
            onPress={() => onToggle()}
            size={20}
          />
        </TouchableOpacity>
        
        <ItemCardStaticInfo 
          item={item}
          draftDelta={draftDelta}
        />
      </View>

      {expanded && <View style={{ 
        flexDirection: 'row', alignItems: 'center', marginTop: 8 
      }}>
        <TouchableOpacity 
          onPress={() => onToggle()}
          style={{ marginRight: 10 }}
        >
          <Feather 
            name={'edit'}
            onPress={() => onEdit(item)}
            size={20}
            color={Colors.primaryDeep}
          />
        </TouchableOpacity>
        <TransactionModifier 
          itemId={item.id}
          quantity={item.quantity}
        />
      </View>}

    </View>
  );
}


interface ItemCardStaticInfoProps {
  item: ItemOut;
  draftDelta: number;
}

function ItemCardStaticInfo({ 
  item, 
  draftDelta 
}: ItemCardStaticInfoProps) {
  let draftDeltaForVisualization = ''
  if (draftDelta > 0) {
    draftDeltaForVisualization = `(+${draftDelta})`;
  } else if (draftDelta < 0) {
    draftDeltaForVisualization = `(${draftDelta})`;
  }
  return (
    <>
      <View style={{ flex: 1 }}>
        <Text style={[Typography.bodyBold]}>
          {item.name} - {item.unit} - {item.location}
        </Text>
        <Text style={Typography.bodySmall}>
          {item.tags?.map((tag) => tag.name).join(', ')}
        </Text>
      </View>

      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <Text style={[Typography.bodyBold, { marginRight: 5 }]}>
          {item.quantity}{draftDeltaForVisualization}
        </Text>
      </View>
    </>
  );
}
