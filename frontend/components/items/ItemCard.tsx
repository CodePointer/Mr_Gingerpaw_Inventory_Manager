import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { ItemOut } from '@/services/types';
import { Feather } from '@expo/vector-icons';
import { ViewComponents, Layout, Colors, TextComponents, Spacing } from '@/styles';
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
      ViewComponents.subCard,
      { backgroundColor: getStatusColor() }
    ]}>
      <View style={Layout.row}>
        <TouchableOpacity 
          onPress={() => onToggle()}
          style={ViewComponents.touchableIcon}
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
          style={{ flex: 1 }}
        />
      </View>

      {expanded && <View style={{ 
        flexDirection: 'row', alignItems: 'center', marginTop: 8 
      }}>
        <TouchableOpacity 
          onPress={() => onEdit(item)}
          style={ViewComponents.touchableIcon}
        >
          <Feather 
            name={'edit'}
            onPress={() => onEdit(item)}
            size={20}
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
  style?: ViewStyle | ViewStyle[];
}

function ItemCardStaticInfo({ 
  item, 
  draftDelta,
  style = {}
}: ItemCardStaticInfoProps) {
  let draftDeltaForVisualization = ''
  if (draftDelta > 0) {
    draftDeltaForVisualization = `(+${draftDelta})`;
  } else if (draftDelta < 0) {
    draftDeltaForVisualization = `(${draftDelta})`;
  }
  return (
    <View style={[Layout.row, style]}>
      <View style={Layout.column}>
        <Text style={TextComponents.boldText}>
          {item.name} - {item.unit} - {item.location}
        </Text>
        <Text style={TextComponents.smallText}>
          {item.tags?.map((tag) => tag.name).join(', ')}
        </Text>
      </View>

      <View style={Layout.column}>
        <Text style={[TextComponents.boldText, { marginRight: Spacing.medium }]}>
          {item.quantity}{draftDeltaForVisualization}
        </Text>
      </View>
    </View>
  );
}
