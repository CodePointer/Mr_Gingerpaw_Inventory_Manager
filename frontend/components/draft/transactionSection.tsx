import React from 'react';
import { View, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spacing, Layout, ViewComponents } from '@/styles';
import { ItemOut, TransactionCreate } from '@/services/types';
import { Text, IconButton, useTheme } from 'react-native-paper';

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
    <View style={ViewComponents.draftCardSet}>
      <View style={Layout.rowCenter}>
        <View>
          <Text variant="titleMedium">{t('draft:transactionsTitle')}</Text>
          <Text variant="bodySmall">{lastUpdated?.toLocaleString() || t('common:defaultText.emptyDate')}</Text>
        </View>
        <IconButton icon={expanded ? 'chevron-up' : 'chevron-down'} onPress={onToggle} />
      </View>

      {expanded && (
        <FlatList
          data={Object.keys(transactions)}
          keyExtractor={(item) => item}
          contentContainerStyle={{ gap: Spacing.small }}
          renderItem={({ item: key }) => (
            <TransactionCard
              key={`transaction-${key}`}
              transaction={transactions[key]}
              baseItem={allItems.find((it) => key === it.id) ?? null}
              onRemove={onRemove}
            />
          )}
        />
      )}
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

  const theme = useTheme();
  const getStatusColor = () => {
    return theme.colors.primaryContainer;
  };

  const tagSummary = (baseItem.tags ?? []).map((tag) => tag.name).join(', ');
  const changeValue = transaction.quantity >= 0 ? `+${transaction.quantity}` : `${transaction.quantity}`;

  return (
    <View style={[ViewComponents.itemCard, { backgroundColor: getStatusColor() }]}>
      <View style={Layout.row}>
        <View style={[Layout.column, { flex: 1, justifyContent: 'center', paddingLeft: Spacing.medium }]}>
          <Text variant="titleMedium">{baseItem.name} - {baseItem.location}</Text>
          <Text variant="bodyMedium">{tagSummary}</Text>
        </View>

        <View style={[Layout.column, { justifyContent: 'center', marginRight: Spacing.small }]}>
          <Text variant="bodyMedium">{changeValue} {baseItem.unit}</Text>
        </View>

        <IconButton icon="delete-outline" onPress={() => onRemove(baseItem.id)} />
      </View>
    </View>
  );
}
