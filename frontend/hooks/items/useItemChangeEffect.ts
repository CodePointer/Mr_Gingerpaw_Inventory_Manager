// useItemChangeEffect.ts
// import { useMemo } from 'react';
import { ItemOut, ItemFormModalValues, ItemFormValues2Out, TransactionCreate, ItemDelete } from '@/services/types';


export interface useItemChangeEffectProps {
  newItems: Record<string, ItemOut>;
  updatedItems: Record<string, ItemOut>;
  deletedItems: Record<string, ItemDelete>;
  transactions: Record<string, TransactionCreate>;
  aggregatedItems: ItemOut[];
  familyId: number;
  ownerId: number;
  addNewItem: (item: ItemOut) => void;
  removeNewItem: (itemId: string) => void;
  addUpdatedItem: (itemId: string, item: ItemOut) => void;
  removeUpdatedItem: (itemId: string) => void;
  addDeletedItem: (item: ItemDelete) => void;
  removeDeletedItem: (itemId: string) => void;
  addTransaction: (transaction: TransactionCreate) => void;
  removeTransaction: (itemId: string) => void;
};


export interface useItemChangeEffectReturn {
  itemOnCreate: (itemId: string, values: ItemFormModalValues) => void;
  itemOnRemove: (itemId: string) => void;
  itemOnChangeQuantity: (itemId: string, changeTo: number) => void;
};


export function useItemChangeEffect({
  newItems,
  updatedItems,
  deletedItems,
  transactions,
  aggregatedItems,
  familyId,
  ownerId,
  addNewItem,
  removeNewItem,
  addUpdatedItem,
  removeUpdatedItem,
  addDeletedItem,
  removeDeletedItem,
  addTransaction,
  removeTransaction
}: useItemChangeEffectProps): useItemChangeEffectReturn {
  // Implementation of the item change handler

  // const oldItemsId = useMemo(() => {
  //   return baseItems.map(it => !Object.keys(updatedItems).includes(it.id))
  // }, [baseItems, updatedItems]);

  const itemOnCreate = (itemId: string, values: ItemFormModalValues) => {
    const newItem: ItemOut = ItemFormValues2Out(
      values, itemId, familyId, ownerId
    );
    if (itemId.startsWith('tmpId')) {
      if (Object.keys(newItems).includes(itemId)) {
        removeNewItem(itemId);
      }
      addNewItem(newItem);  // This will automatically remove the existing new item
    } else {
      if (Object.keys(updatedItems).includes(itemId)) {
        removeUpdatedItem(itemId);
      }
      addUpdatedItem(itemId, newItem);
    }
  }

  const itemOnRemove = (itemId: string) => {
    if (itemId.startsWith('tmpId')) {
      removeNewItem(itemId);
      return;
    }
    if (Object.keys(deletedItems).includes(itemId)) {
      removeDeletedItem(itemId);
      return;
    }
    if (Object.keys(updatedItems).includes(itemId)) {
      removeUpdatedItem(itemId);
      return;
    }
    addDeletedItem({
      id: itemId,
      deletedBy: ownerId,
      note: 'Manually removed',
    } as ItemDelete);
  }

  const itemOnChangeQuantity = (itemId: string, changeTo: number) => {
    if (Number.isNaN(changeTo) || changeTo < 0) {
      return;
    }
    const itemQuantity = aggregatedItems.find(it => it.id === itemId)?.quantity ?? 0;
    if (changeTo === itemQuantity) {
      removeTransaction(itemId);
      return;
    }
    const existingTransaction = transactions[itemId] ?? {};
    addTransaction({
      ...existingTransaction,
      itemId: itemId,
      changeType: 'ADD',
      quantity: changeTo - itemQuantity
    });
  }

  return {
    itemOnCreate,
    itemOnRemove,
    itemOnChangeQuantity
  };
}