import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useDrafts, useUser, useFamily, useItems, useTags, useAlertModal } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { ViewComponents, Layout } from '@/styles';
import { EmptyScreen, LoadingScreen } from '@/components/common/DefaultScreen';
import { ItemFormModal } from '@/components/items/ItemFormModal';
import { useItemEditor } from '@/hooks/modals/useItemEditor';
import { ItemFormModalValues, ItemFormValues2Out, ItemOut } from '@/services/types';
import { ButtonGroup } from '@/components/common/ButtonGroup';
import { Text } from 'react-native-paper';
import { NewItemSection } from '@/components/draft/newItemSection';
import { UpdatedItemSection } from '@/components/draft/updatedItemSection';
import { DeletedItemSection } from '@/components/draft/deletedItemSection';
import { TransactionSection } from '@/components/draft/transactionSection';


export function DraftScreen() {
  const { t } = useTranslation(['draft', 'common']);
  const { tags } = useTags();
  const { showModal } = useAlertModal();
  const {
    newItemsState, addNewItem, removeNewItem, findNewItemByInfo,
    updatedItemsState, addUpdatedItem, removeUpdatedItem, findUpdatedItemByInfo,
    deletedItemsState, removeDeletedItem,
    transactionsState, removeTransaction,
    aggregatedItems,
    hasDrafts, clearAll,
    isSubmitting,
    submitNewItems, submitUpdatedItems, submitDeletedItems, submitTransactions
  } = useDrafts();
  const { user } = useUser();
  const { locations, currentFamily } = useFamily();
  const { items, findItemByInfo, fetchItems } = useItems();
  const [newItemsExpanded, setNewItemsExpanded] = useState(true);
  const [updatedItemsExpanded, setUpdatedItemsExpanded] = useState(true);
  const [deletedItemsExpanded, setDeletedItemsExpanded] = useState(true);
  const [transactionsExpanded, setTransactionsExpanded] = useState(true);

  const [baseUpdatedItems, setBaseUpdatedItems] = useState<ItemOut[]>([]);
  useEffect(() => {
    const updatedIds = new Set(Object.keys(updatedItemsState.updatedItems))
    setBaseUpdatedItems(items.filter(item => updatedIds.has(item.id)))
  }, [items, updatedItemsState.lastUpdated])

  const handleSubmit = async (itemId: string, values: ItemFormModalValues) => {
    if (!currentFamily || !user) {
      console.error('No current family or user found');
      return;
    }
    // Check if value has changed
    const newItem = ItemFormValues2Out(
      values, itemId, currentFamily.id, user.id
    );
    if (itemId.startsWith('tmpId')) {
      addNewItem(newItem);
    } else {
      addUpdatedItem(itemId, newItem);
    }
  }

  const itemEditor = useItemEditor({
    baseItems: items,
    newItems: newItemsState.newItems,
    updatedItems: updatedItemsState.updatedItems,
    locations: locations,
    tags: tags,
    findItemByInfo: findItemByInfo,
    findNewItemByInfo: findNewItemByInfo,
    findUpdatedItemByInfo: findUpdatedItemByInfo,
    onProcess: handleSubmit
  })

  const submitAll = async () => {
    if (!currentFamily || !user) {
      console.error('No current family or user found');
      return;
    }
    const resultUpdated = await submitUpdatedItems(true);
    if (resultUpdated.failed.length > 0) {
      showModal(`${t('draft:alert.submitUpdatedFailed')}`, true);
    }
    const resultNew = await submitNewItems(true);
    if (resultNew.failed.length > 0) {
      showModal(`${t('draft:alert.submitNewItemsFailed')}`, true);
    }
    const resultDeleted = await submitDeletedItems(true);
    if (resultDeleted.failed.length > 0) {
      showModal(`${t('draft:alert.submitDeletedFailed')}`, true);
    }
    const resultTransactions = await submitTransactions(true);
    if (resultTransactions.failed.length > 0) {
      showModal(`${t('draft:alert.submitTransactionsFailed')}`, true);
    }
    // console.log('resultTransactions', resultTransactions);
    fetchItems(); // Refresh items after submission
  };

  const cancelAll = () => clearAll();

  if (isSubmitting) return (<LoadingScreen />);
  if (!hasDrafts) return (<EmptyScreen />);

  return (
    <View style={[Layout.column, ViewComponents.screen]}>
      <ItemFormModal
        visible={itemEditor.modalVisible}
        mode={itemEditor.modalMode}
        initial={itemEditor.initialFormValue}
        locations={itemEditor.locations}
        tags={itemEditor.tags}
        onCancel={itemEditor.closeEditor}
        onSubmit={itemEditor.handleSubmit}
      />

      <ButtonGroup
        style={ViewComponents.rowButtons}
        buttons={[
          {
            label: t('draft:button.submitAll'),
            mode: 'contained',
            icon: 'check-all',
            onPress: submitAll,
            disabled: !hasDrafts
          },
          {
            label: t('draft:button.cancelAll'),
            mode: 'outlined',
            icon: 'close-circle-outline',
            onPress: cancelAll,
            disabled: !hasDrafts
          }
        ]}
      />

      <ScrollView contentContainerStyle={[ViewComponents.groupContainer, { gap: 16 }]}>
        <>
          <UpdatedItemSection
            lastUpdated={updatedItemsState.lastUpdated}
            expanded={updatedItemsExpanded}
            updatedItems={updatedItemsState.updatedItems}
            baseItems={baseUpdatedItems}
            onToggle={() => setUpdatedItemsExpanded(!updatedItemsExpanded)}
            onModify={(itemId: string) => itemEditor.openEditor(itemId)}
            onRemove={removeUpdatedItem}
          />

          <DeletedItemSection
            lastUpdated={deletedItemsState.lastUpdated}
            expanded={deletedItemsExpanded}
            deletedItems={deletedItemsState.deletedItems}
            allItems={aggregatedItems}
            onToggle={() => setDeletedItemsExpanded(!deletedItemsExpanded)}
            onRemove={removeDeletedItem}
          />

          <TransactionSection
            lastUpdated={transactionsState.lastUpdated}
            expanded={transactionsExpanded}
            transactions={transactionsState.transactions}
            allItems={aggregatedItems}
            onToggle={() => setTransactionsExpanded(!transactionsExpanded)}
            onRemove={removeTransaction}
          />

          <NewItemSection
            lastUpdated={newItemsState.lastUpdated}
            expanded={newItemsExpanded}
            newItems={newItemsState.newItems}
            onToggle={() => setNewItemsExpanded(!newItemsExpanded)}
            onRemove={removeNewItem}
          />
        </>
      </ScrollView>
    </View>
  );
}
