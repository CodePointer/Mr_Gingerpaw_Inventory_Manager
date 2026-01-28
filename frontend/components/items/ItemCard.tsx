import { View } from 'react-native';
import { ItemOut } from '@/services/types';
import { ViewComponents, Layout, Spacing } from '@/styles';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, IconButton, TextInput } from 'react-native-paper';
import { useTheme } from 'react-native-paper';


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
  const { t } = useTranslation(['items']);

  const theme = useTheme();
  const getStatusColor = () => {
    if (status === 'deleted') {
      return theme.colors.tertiaryContainer;
    } else if (status === 'modified') {
      return theme.colors.tertiaryContainer;
    } else if (status === 'new') {
      return theme.colors.tertiaryContainer;
    }
    if (draftDelta > 0) {
      return theme.colors.secondaryContainer;
    } else if (draftDelta < 0) {
      return theme.colors.secondaryContainer;
    } else {
      return theme.colors.primaryContainer;
    }
  };

  return (
    <View style={[
      ViewComponents.itemCard,
      { backgroundColor: getStatusColor() }
    ]}>
      <View style={[ViewComponents.itemStatusBadge]}>
        <IconButton
          icon={expanded ? 'chevron-up' : 'chevron-down'}
          onPress={() => onToggle()}
        />
        <ItemCardStaticInfo 
          item={item}
          tags={tags}
          status={status}
          draftDelta={draftDelta}
        />
      </View>

      {expanded && <View style={[ViewComponents.itemStatusBadge]}>
        <ItemControlPanel
          status={status}
          onModifyTrigger={() => onModify(item.id)}
          onRemoveTrigger={() => onRemove(item.id)}
        />

        <TransactionModifier
          disabled={status === 'deleted'}
          baseQuantity={item.quantity + draftDelta}
          onChange={(changeTo) => onChangeQuantity(item.id, changeTo)}
        />
      </View>}
    </View>
  );
}


interface ItemCardStaticInfoProps {
  item: ItemOut;
  tags?: string[];
  draftDelta: number;
  status: 'normal' | 'new' | 'modified' | 'deleted';
}

function ItemCardStaticInfo({ 
  item, 
  tags = [],
  draftDelta,
  status
}: ItemCardStaticInfoProps) {
  let draftDeltaForVisualization = ''
  if (draftDelta > 0) {
    draftDeltaForVisualization = `(+${draftDelta})`;
  } else if (draftDelta < 0) {
    draftDeltaForVisualization = `(${draftDelta})`;
  }

  const statusText = (status: 'normal' | 'new' | 'modified' | 'deleted') => {
    switch (status) {
      case 'normal':
        return '';
      case 'new':
        return ' ( New )';
      case 'modified':
        return ' ( Modified )';
      case 'deleted':
        return ' ( Deleted )';
    }
  };

  return (
    <>
      <View style={[Layout.column, { flex: 1 }]}>
        <Text variant="titleLarge">
          {item.name}{statusText(status)}
        </Text>
        <Text variant="bodyMedium">
          {item.location}{tags.length > 0 ? ` | ${tags.join(', ')}` : ''}
        </Text>
      </View>

      <View style={[Layout.column, { marginRight: Spacing.small }]}>
        <Text variant="bodyLarge">
          {item.quantity}{draftDeltaForVisualization} {item.unit}
        </Text>
      </View>
    </>
  );
}


interface TransactionModifierProps {
  disabled: boolean;
  baseQuantity: number;
  onChange: (changeTo: number) => void;
}

function TransactionModifier({
  disabled = false,
  baseQuantity,
  onChange
}: TransactionModifierProps) {
  const [changeToValue, setChangeToValue] = useState<string>(baseQuantity.toString());
  const increment = () => setChangeToValue((parseFloat(changeToValue) + 1.0).toString());
  const decrement = () => setChangeToValue((parseFloat(changeToValue) - 1.0).toString());

  return (
    <View style={[Layout.row]}>
      <View style={[Layout.row]}>
        <IconButton icon='minus-circle-outline' onPress={decrement} disabled={disabled} />
        <TextInput 
          style={{ width: 60, textAlign: 'center' }}
          value={changeToValue.toString()}
          mode='outlined'
          onChangeText={setChangeToValue}
          keyboardType='decimal-pad'
          onSubmitEditing={() => onChange(parseFloat(changeToValue))}
          editable={!disabled}
        />
        <IconButton icon='plus-circle-outline' onPress={increment} disabled={disabled} />
      </View>
      <IconButton icon='check' onPress={() => onChange(parseFloat(changeToValue))} disabled={disabled} />
    </View>
  );
}


interface ItemControlPanelProps {
  status: 'normal' | 'new' | 'modified' | 'deleted';
  onModifyTrigger: () => void;
  onRemoveTrigger: () => void;
}

function ItemControlPanel({
  status,
  onModifyTrigger,
  onRemoveTrigger
}: ItemControlPanelProps) {

  const controlIconSet = () => {
    if (status === 'normal') {
      return (
        <>
          <IconButton icon='square-edit-outline' onPress={onModifyTrigger} />
          <IconButton icon='delete-outline' onPress={onRemoveTrigger} />
        </>
      )
    } else if (status === 'modified') {
      return (
        <>
          <IconButton icon='square-edit-outline' onPress={onModifyTrigger} />
          <IconButton icon='restore' onPress={onRemoveTrigger} />
        </>
      )
    } else if (status === 'new') {
      return (
        <>
          <IconButton icon='square-edit-outline' onPress={onModifyTrigger} />
          <IconButton icon='delete-outline' onPress={onRemoveTrigger} />
        </>
      )
    } else if (status === 'deleted') {
      return (
        <>
          <IconButton icon='square-edit-outline' onPress={onModifyTrigger} disabled/>
          <IconButton icon='restore' onPress={onRemoveTrigger} />
        </>
      )
    } else {
      console.log('Unknown status in ItemControlPanel:', status);
      return null;
    }
  }

  return (
    <View style={[Layout.row]}>
      {controlIconSet()}
    </View>
  );
}