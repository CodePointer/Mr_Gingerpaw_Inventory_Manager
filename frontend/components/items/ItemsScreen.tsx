// components/items/ItemsScreen.tsx
import { useEffect, useState } from 'react';
import {
  View,
  ScrollView
} from 'react-native';
import { useTags, useItems, useUser, useFamily, useDrafts, useAlertModal } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { NoFamilyScreen, LoadingScreen } from '@/components/common/DefaultScreen';
import { ItemCard } from '@/components/items/ItemCard';
import { ItemFilterBar } from '@/components/items/ItemFilterBar';
import { ItemFormModal } from '@/components/items/ItemFormModal';
import { PaginationBar } from '@/components/items/PaginationBar';
import { useItemEditor } from '@/hooks/modals/useItemEditor';
import { useItemChangeEffect } from '@/hooks/items/useItemChangeEffect';
import { useTagEditor } from '@/hooks/modals/useTagEditor';
import { ViewComponents, Layout } from '@/styles';
import { ItemFormModalValues, ItemFormValues2Out, ItemOut, ItemOut2FormValues, LocationOut, TagOut } from '@/services/types';
import { ItemsSection } from './ItemsSection';
import { TagEditModal } from '../tags/TagEditModal';


export function ItemsScreen() {
  const { t } = useTranslation(['items']);
  const { items, fetchItems, findItemByInfo } = useItems();
  const { 
    tags, fetchTags, 
    submitNewTags, submitUpdatedTags, submitDeletedTags 
  } = useTags();
  const { showModal } = useAlertModal();
  const { currentFamily, locations } = useFamily();
  const { user } = useUser();
  const { 
    newItemsState, addNewItem, removeNewItem, findNewItemByInfo,
    updatedItemsState, addUpdatedItem, removeUpdatedItem, findUpdatedItemByInfo,
    deletedItemsState, addDeletedItem, removeDeletedItem,
    transactionsState, addTransaction, removeTransaction,
    aggregatedItems, aggregatedLocations
  } = useDrafts();

  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    if (!currentFamily) return;
    setLoading(true);
    Promise.all([
      fetchItems(),
      fetchTags()
    ]);
    setLoading(false);
  }, [currentFamily]);

  const itemChanger = useItemChangeEffect({
    newItems: newItemsState.newItems,
    updatedItems: updatedItemsState.updatedItems,
    deletedItems: deletedItemsState.deletedItems,
    transactions: transactionsState.transactions,
    aggregatedItems: aggregatedItems,
    familyId: currentFamily?.id ?? -1,
    ownerId: user?.id ?? -1,
    addNewItem,
    removeNewItem,
    addUpdatedItem,
    removeUpdatedItem,
    addDeletedItem,
    removeDeletedItem,
    addTransaction,
    removeTransaction
  });

  const itemEditor = useItemEditor({
    baseItems: items,
    newItems: newItemsState.newItems,
    updatedItems: updatedItemsState.updatedItems,
    locations: aggregatedLocations,
    tags: tags,
    findItemByInfo: findItemByInfo,
    findNewItemByInfo: findNewItemByInfo,
    findUpdatedItemByInfo: findUpdatedItemByInfo,
    onProcess: itemChanger.itemOnCreate
  })

  const handleSubmitTagEditor = async (deletedTagsId: string[], updatedTags: TagOut[], newTags: TagOut[]) => {
    if (!currentFamily || !user) {
      console.error('No current family or user found');
      return;
    }
    const resultNewTags = await submitNewTags(newTags);
    const resultUpdatedTags = await submitUpdatedTags(updatedTags);
    const resultDeletedTags = await submitDeletedTags(deletedTagsId);

    if (resultNewTags.failed.length > 0 || resultUpdatedTags.failed.length > 0 || resultDeletedTags.failed.length > 0) {
      showModal(`${t('items:tags.alert.submitFailed')}`, true);
    }
    fetchTags(); // Refresh tags after submission
  }

  const tagEditor = useTagEditor({ onSave: handleSubmitTagEditor });

  const getItemStatus = (itemId: string) => {
    if (Object.keys(deletedItemsState.deletedItems).includes(itemId)) {
      return 'deleted';
    } else if (Object.keys(newItemsState.newItems).includes(itemId)) {
      return 'new'
    } else if (Object.keys(updatedItemsState.updatedItems).includes(itemId)) {
      return 'modified'
    } else {
      return 'normal'
    }
  }

  if (!currentFamily || !user) return (<NoFamilyScreen />);

  if (loading) return (<LoadingScreen />);

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
      <TagEditModal
        visible={tagEditor.modalVisible}
        baseTags={tags}
        allItems={aggregatedItems}
        onCancel={tagEditor.closeEditor}
        onSubmit={tagEditor.handleSubmit}
      />

      <ItemsSection
        allItems={aggregatedItems}
        allTransactions={transactionsState.transactions}
        allTags={tags}
        allLocations={aggregatedLocations}
        itemStatus={getItemStatus}
        itemOnCreate={() => itemEditor.openEditor(null)}
        itemOnModify={(itemId) => itemEditor.openEditor(itemId)}
        itemOnRemove={itemChanger.itemOnRemove}
        itemOnChangeQuantity={itemChanger.itemOnChangeQuantity}
        tagOnEdit={tagEditor.openEditor}
      />
    </View>
  );
}
