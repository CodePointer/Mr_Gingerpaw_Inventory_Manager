// components/items/ItemsScreen.tsx
import { useEffect, useState } from 'react';
import {
  View,
} from 'react-native';
import { useTags, useItems, useUser, useFamily, useDrafts, useAlertModal, useAppbar } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { NoFamilyScreen, LoadingScreen } from '@/components/common/DefaultScreen';
import { ActionMenu } from '@/components/common/ActionMenu';
import { ItemCard } from '@/components/items/ItemCard';
import { ItemFilterBar } from '@/components/items/ItemFilterBar';
import { PaginationBar } from '@/components/items/PaginationBar';
import { useItemChangeEffect } from '@/hooks/items/useItemChangeEffect';
import { ViewComponents, Layout } from '@/styles';
import { ItemOut2FormValues, TagOut } from '@/services/types';
import { ItemsSection } from './ItemsSection';
import { useModal } from '@/hooks/modal/useModal';


export function ItemsScreen() {
  const { t } = useTranslation(['items']);
  const { items, fetchItems, findItemByInfo } = useItems();
  const { registerPageActions, unregisterPageActions } = useAppbar();
  const { open } = useModal();
  const [menuVisible, setMenuVisible] = useState(false);
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

  const openItemEditor = (itemId: string | null) => {
    const mode = (itemId === null || itemId.startsWith('tmpId')) ? 'create' : 'edit';
    const editingItemId = itemId ?? `tmpId-${Date.now()}`;

    let initialFormValue = null;
    if (itemId === null) {
      initialFormValue = null;
    } else if (itemId.startsWith('tmpId')) {
      initialFormValue = ItemOut2FormValues(newItemsState.newItems[itemId]);
    } else {
      const item = updatedItemsState.updatedItems[itemId] ?? items.find(it => it.id === itemId);
      initialFormValue = item ? ItemOut2FormValues(item) : null;
    }

    open('ItemForm', {
      mode,
      initial: initialFormValue,
      locations: aggregatedLocations,
      tags,
      onSubmit: async (values) => {
        itemChanger.itemOnCreate(editingItemId, values);
      }
    });
  };

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

  const openTagEditor = () => {
    open('TagEdit', {
      baseTags: tags,
      allItems: aggregatedItems,
      onSubmit: handleSubmitTagEditor
    });
  };

  // Define menu items
  const menuItems = [
    {
      title: t('items:menu.newItem'),
      icon: 'file-plus',
      onPress: () => openItemEditor(null)
    },
    {
      title: t('items:menu.editTag'),
      icon: 'tag-multiple-outline',
      onPress: openTagEditor
    }
  ];

  // Register appbar actions once on mount
  useEffect(() => {
    registerPageActions('items', [
      () => setMenuVisible(true)
    ]);
    return () => {
      unregisterPageActions('items');
    };
  }, [registerPageActions, unregisterPageActions]);

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
      <ActionMenu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        items={menuItems}
      />

      <ItemsSection
        allItems={aggregatedItems}
        allTransactions={transactionsState.transactions}
        allTags={tags}
        allLocations={aggregatedLocations}
        itemStatus={getItemStatus}
        itemOnCreate={() => openItemEditor(null)}
        itemOnModify={(itemId) => openItemEditor(itemId)}
        itemOnRemove={itemChanger.itemOnRemove}
        itemOnChangeQuantity={itemChanger.itemOnChangeQuantity}
        tagOnEdit={openTagEditor}
      />
    </View>
  );
}
