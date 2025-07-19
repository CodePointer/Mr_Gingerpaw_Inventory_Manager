import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Spacing, Layout, ViewComponents, TextComponents, Colors } from '@/styles';
import { ItemOut, TransactionCreate } from '@/services/types';
import { TextWithView } from '@/components/common/TextWithView';


interface TransactionSectionProps {
  lastUpdated: Date | null;
  expanded: boolean;
  transactions: Record<string, TransactionCreate>;
  allItems: ItemOut[];
  onToggle: () => void;
  onRemove: (itemId: string) => void;
}


export function TransactionSection({
  lastUpdated,
  expanded,
  transactions,
  allItems,
  onToggle,
  onRemove
}: TransactionSectionProps) {
  const { t } = useTranslation(['draft', 'common']);

  if (Object.keys(transactions).length === 0) return null;

  return (
    <View style={ViewComponents.card}>
      {/* Header */}
      <TouchableOpacity style={[Layout.row, { marginBottom: Spacing.small }]} onPress={onToggle}>
        <View>
          <Text style={TextComponents.subtitleText}>
            {t('draft:transactionsTitle')}
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
          data={Object.keys(transactions)}
          keyExtractor={(item) => item}
          renderItem={({ item: key }) => (
            <TransactionCard
              key={`transaction-${key}`}
              transaction={transactions[key]}
              baseItem={allItems.find(it => key === it.id) ?? null}
              onRemove={onRemove}
            />
          )}
        />
      }
    </View>
  );
}


interface TransactionCardProps {
  transaction: TransactionCreate;
  baseItem: ItemOut | null;
  onRemove: (itemId: string) => void;
}

function TransactionCard({
  transaction,
  baseItem,
  onRemove
}: TransactionCardProps) {
  if (baseItem === null) return null;

  const getBackgroundColor = () => {
    if (transaction.quantity > 0) {
      return Colors.newLight;
    } else {
      return Colors.removedLight;
    }
  }

  return (
    <View style={[
      ViewComponents.subCard,
      { backgroundColor: getBackgroundColor() }
    ]}>
      <View style={Layout.row}>
        <View style={ViewComponents.touchableIcon}>
          <Feather name={transaction.quantity > 0 ? "plus" : "minus"} size={16}/>
        </View>

        <View style={[Layout.row, { flex: 1, marginLeft: Spacing.small }]}>
          <TextWithView textStyle={TextComponents.plainText}>
            {Math.abs(transaction.quantity)} {baseItem.unit} - {baseItem.name} - {baseItem.location}
          </TextWithView>
        </View>

        <TouchableOpacity onPress={() => onRemove(baseItem.id)}>
          <Feather name={'trash'} size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );
}