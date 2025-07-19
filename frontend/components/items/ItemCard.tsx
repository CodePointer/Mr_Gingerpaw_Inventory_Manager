import { View, TextInput, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { ItemOut } from '@/services/types';
import { Feather } from '@expo/vector-icons';
import { ViewComponents, Layout, Colors, TextComponents, Spacing } from '@/styles';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';


interface ItemCardProps {
  item: ItemOut;
  tags?: string[];
  draftDelta: number;
  expanded: boolean;
  status: 'normal' | 'new' | 'modified' | 'deleted';
  onToggle: () => void;
  onModify: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onChangeQuantity: (itemId: string, changeTo: number) => void;
}

export function ItemCard({
  item,
  tags = [],
  draftDelta = 0,
  expanded = false,
  status = 'normal',
  onToggle,
  onModify,
  onRemove,
  onChangeQuantity
}: ItemCardProps) {

  const getStatusColor = () => {
    if (status === 'deleted') {
      return Colors.removedLight;
    } else if (status === 'modified') {
      return Colors.modifiedLight;
    } else if (status === 'new') {
      return Colors.newLight;
    }
    if (draftDelta > 0) {
      return Colors.changedLight;
    } else if (draftDelta < 0) {
      return Colors.changedLight;
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
          tags={tags}
          draftDelta={draftDelta}
          style={{ flex: 1 }}
        />
      </View>

      {expanded && <View style={{ 
        flexDirection: 'row', alignItems: 'center', marginTop: 8 
      }}>
        {(status !== 'deleted') && 
        <TouchableOpacity 
          onPress={() => onModify(item.id)}
          style={ViewComponents.touchableIcon}
        >
          <Feather name={'edit'} size={20}/>
        </TouchableOpacity>}
        <TouchableOpacity 
          onPress={() => onRemove(item.id)}
          style={ViewComponents.touchableIcon}
        >
          <Feather 
            name={(status === 'deleted' || status === 'modified') ? 'rotate-ccw' : 'trash'}
            size={20}
          />
        </TouchableOpacity>

        {(status === 'normal' || status === 'modified') &&
        <TransactionModifier
          baseQuantity={item.quantity + draftDelta}
          onChange={(changeTo) => onChangeQuantity(item.id, changeTo)}
        />}
      </View>}

    </View>
  );
}


interface ItemCardStaticInfoProps {
  item: ItemOut;
  tags?: string[];
  draftDelta: number;
  style?: ViewStyle | ViewStyle[];
}

function ItemCardStaticInfo({ 
  item, 
  tags = [],
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
          {item.name} - {item.location}
        </Text>
        <Text style={TextComponents.smallText}>
          {tags.join(', ')}
        </Text>
      </View>

      <View style={Layout.column}>
        <Text style={[TextComponents.boldText, { marginRight: Spacing.medium }]}>
          {item.quantity}{draftDeltaForVisualization} {item.unit}
        </Text>
      </View>
    </View>
  );
}


interface TransactionModifierProps {
  baseQuantity: number;
  onChange: (changeTo: number) => void;
}


function TransactionModifier({
  baseQuantity,
  onChange
}: TransactionModifierProps) {
  const { t } = useTranslation(['items']);
  const [changeToValue, setChangeToValue] = useState<string>(baseQuantity.toString());
  const increment = () => setChangeToValue((parseFloat(changeToValue) + 1.0).toString());
  const decrement = () => setChangeToValue((parseFloat(changeToValue) - 1.0).toString());

  return (
    <View style={[Layout.row, { flex: 1, paddingHorizontal: Spacing.medium }]}>
      <Text style={[TextComponents.inputLabel]}>
        {t('items:itemCard.manualChangeTo')}
      </Text>

      <View style={[Layout.row, { flex: 1, maxWidth: '40%' }]}>
        <TouchableOpacity onPress={decrement}>
          <Feather name='minus-circle' color={Colors.primaryDeep} size={20}/>
        </TouchableOpacity>
        <TextInput 
          style={[TextComponents.inputBox, { flexGrow: 1, minWidth: 0, textAlign: 'center'}]}
          value={changeToValue.toString()}
          onChangeText={setChangeToValue}
          keyboardType='decimal-pad'
          onSubmitEditing={() => onChange(parseFloat(changeToValue))}
        />
        <TouchableOpacity onPress={increment}>
          <Feather name='plus-circle' color={Colors.primaryDeep} size={20}/>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => onChange(parseFloat(changeToValue))} style={ViewComponents.touchableIcon}>
        <Feather name='check' size={20}/>
      </TouchableOpacity>
    </View>
  );
}

