import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer
} from 'react';
import {
  ItemFormModalValues,
  ItemOut, ItemUpdate,
  TransactionCreate,
  LocationOut,
  BulkResponseOut,
  ItemResponseStatus,
  ItemDelete
} from '@/services/types';
import { useTranslation } from 'react-i18next';
import { useItems } from '@/hooks/items/useItems';
import { computeAggregates } from './aggregator';
import { useDraftEffects } from './useDraftEffects';
// import { draftReducer, initialDraftState } from './draft.reducer';
import { newItemsReducer, initialNewItemsState, NewItemsState } from './newItems.reducer';
import { updatedItemsReducer, initialUpdatedItemsState, UpdatedItemsState } from './updatedItems.reducer';
import { deletedItemsReducer, initialDeletedItemsState, DeletedItemsState } from './deletedItems.reducer';
import { transactionsReducer, initialTransactionsState, TransactionsState } from './transactions.reducer';
import { useSubmitDraft } from './useSubmitDraft';
import { loadState, saveState } from '@/services/utils/asyncStorage';
import { useFamily } from '../family/useFamily';
import { useUser } from '../user/useUser';
import { AIDraftGenerateRequest, AIDraftGenerateResponse } from '@/services/types/aidraftTypes';
import { useAiDraftGenerator } from './useAiDraftGenerator';
import { useTags } from '../tags/useTags';
// import { v4 as uuidv4 } from 'uuid';


interface DraftContextType {
  newItemsState: NewItemsState;
  addNewItem: (item: ItemOut) => void;
  modifyNewItem: (itemId: string, item: ItemOut) => void;
  removeNewItem: (itemId: string) => void;
  findNewItemByInfo: (itemInfo: ItemOut | ItemFormModalValues) => string | null;
  clearNewItems: () => void;

  updatedItemsState: UpdatedItemsState;
  addUpdatedItem: (itemId: string, item: ItemOut) => void;
  removeUpdatedItem: (itemId: string) => void;
  findUpdatedItemByInfo: (itemInfo: ItemOut | ItemFormModalValues) => string | null;
  clearUpdatedItems: () => void;

  deletedItemsState: DeletedItemsState;
  addDeletedItem: (item: ItemDelete) => void;
  removeDeletedItem: (itemId: string) => void;
  clearDeletedItems: () => void;

  transactionsState: TransactionsState;
  addTransaction: (transaction: TransactionCreate) => void;
  removeTransaction: (itemId: string) => void;
  clearTransactions: () => void;

  aggregatedItems: ItemOut[];
  aggregatedUpdatedParts: Record<string, ItemUpdate>;  // itemId -> updated parts
  aggregatedLocations: LocationOut[];  // location -> total quantity
  hasDrafts: boolean;
  clearAll: () => void;

  isSubmitting: boolean;
  submitNewItems: (removeSuccess: boolean) => Promise<BulkResponseOut<ItemResponseStatus>>;
  submitUpdatedItems: (removeSuccess: boolean) => Promise<BulkResponseOut<ItemResponseStatus>>;
  submitDeletedItems: (removeSuccess: boolean) => Promise<BulkResponseOut<ItemResponseStatus>>;
  submitTransactions: (removeSuccess: boolean) => Promise<BulkResponseOut<ItemResponseStatus>>;

  isGenerating: boolean;
  generateAiDraft: (request: AIDraftGenerateRequest) => Promise<void>;
}


interface DraftState {
  newItems: NewItemsState;
  updatedItems: UpdatedItemsState;
  deletedItems: DeletedItemsState;
  transactions: TransactionsState;
}


export const DraftContext = createContext<DraftContextType | undefined>(undefined);
const KEY_DRAFT = '@app:DRAFT'

export const DraftProvider = ({ children }: { children: ReactNode }) => {
  const { currentFamily } = useFamily();
  const { user } = useUser();
  const [newItemsState, newItemsDispatch] = useReducer(newItemsReducer, initialNewItemsState);
  const [updatedItemsState, updatedItemsDispatch] = useReducer(updatedItemsReducer, initialUpdatedItemsState);
  const [deletedItemsState, deletedItemsDispatch] = useReducer(deletedItemsReducer, initialDeletedItemsState);
  const [transactionsState, transactionsDispatch] = useReducer(transactionsReducer, initialTransactionsState);
  const { t } = useTranslation();
  const { items } = useItems();
  const { getNamesByIds } = useTags();

  // Save & Load
  useEffect(() => {
    async function hydrate() {
      const saved = await loadState<Partial<DraftState>>(KEY_DRAFT);
      if (!saved) return;
      if (saved.newItems)
        newItemsDispatch({ type: 'INIT', payload: saved.newItems });
      if (saved.updatedItems)
        updatedItemsDispatch({ type: 'INIT', payload: saved.updatedItems });
      if (saved.deletedItems)
        deletedItemsDispatch({ type: 'INIT', payload: saved.deletedItems });
      if (saved.transactions)
        transactionsDispatch({ type: 'INIT', payload: saved.transactions });
    }
    hydrate();
  }, [])
  useEffect(() => {
    const draftState: DraftState = {
      newItems: newItemsState,
      updatedItems: updatedItemsState,
      deletedItems: deletedItemsState,
      transactions: transactionsState
    };
    saveState(KEY_DRAFT, draftState);
  }, [newItemsState, updatedItemsState, deletedItemsState, transactionsState]);
  
  const { 
    aggregatedItems,
    aggregatedUpdatedParts,
    aggregatedLocations 
  } = useMemo(() => computeAggregates(
    items, newItemsState.newItems, updatedItemsState.updatedItems
  ), [items, newItemsState.newItems, updatedItemsState.updatedItems]);

  const hasDrafts = Object.keys(newItemsState.newItems).length > 0 ||
                    Object.keys(updatedItemsState.updatedItems).length > 0 ||
                    Object.keys(deletedItemsState.deletedItems).length > 0 ||
                    Object.keys(transactionsState.transactions).length > 0;

  const addNewItem = useCallback((item: ItemOut) => {
    newItemsDispatch({ type: 'ADD', payload: { item } });
  }, []);
  const modifyNewItem = useCallback((itemId: string, item: ItemOut) => {
    newItemsDispatch({ type: 'MODIFY', payload: { itemId, item } });
  }, []);
  const removeNewItem = useCallback((itemId: string) => {
    newItemsDispatch({ type: 'REMOVE', payload: { itemId } });
  }, []);
  const findNewItemByInfo = useCallback((itemInfo: ItemOut | ItemFormModalValues): string | null => {
    const foundItem = Object.values(newItemsState.newItems).find(item =>
      item.name === itemInfo.name &&
      item.unit === itemInfo.unit &&
      item.location === itemInfo.location
    );
    return foundItem?.id ?? null;
  }, [newItemsState.newItems]);
  const clearNewItems = useCallback(() => {
    newItemsDispatch({ type: 'CLEAR', payload: {} });
  }, []);

  const addUpdatedItem = useCallback((itemId: string, item: ItemOut) => {
    updatedItemsDispatch({ type: 'ADD', payload: { itemId, item } });
  }, []);
  const removeUpdatedItem = useCallback((itemId: string) => {
    updatedItemsDispatch({ type: 'REMOVE', payload: { itemId } });
  }, []);
  const findUpdatedItemByInfo = useCallback((itemInfo: ItemOut | ItemFormModalValues): string | null => {
    const foundItem = Object.values(updatedItemsState.updatedItems).find(item =>
      item.name === itemInfo.name &&
      item.unit === itemInfo.unit &&
      item.location === itemInfo.location
    );
    return foundItem?.id ?? null;
  }, [updatedItemsState.updatedItems]);
  const clearUpdatedItems = useCallback(() => {
    updatedItemsDispatch({ type: 'CLEAR', payload: {} });
  }, []);

  const addDeletedItem = useCallback((item: ItemDelete) => {
    deletedItemsDispatch({ type: 'ADD', payload: { item } });
  }, []);
  const removeDeletedItem = useCallback((itemId: string) => {
    deletedItemsDispatch({ type: 'REMOVE', payload: { itemId } });
  }, []);
  const clearDeletedItems = useCallback(() => {
    deletedItemsDispatch({ type: 'CLEAR', payload: {} });
  }, []);

  const addTransaction = useCallback((transaction: TransactionCreate) => {
    transactionsDispatch({ type: 'ADD', payload: { transaction } });
  }, []);
  const removeTransaction = useCallback((itemId: string) => {
    transactionsDispatch({ type: 'REMOVE', payload: { itemId } });
  }, []);
  const clearTransactions = useCallback(() => {
    transactionsDispatch({ type: 'CLEAR', payload: {} });
  }, []);

  const clearAll = useCallback(() => {
    clearNewItems();
    clearUpdatedItems();
    clearDeletedItems();
    clearTransactions();
  }, [])

  const {
    isSubmitting,
    submitNewItems,
    submitUpdatedItems,
    submitDeletedItems,
    submitTransactions
  } = useSubmitDraft({
    familyId: currentFamily?.id ?? -1,
    userId: user?.id ?? -1,
    newItems: newItemsState.newItems,
    updatedItems: updatedItemsState.updatedItems,
    updatedParts: aggregatedUpdatedParts,
    deletedItems: deletedItemsState.deletedItems,
    transactions: transactionsState.transactions,
    removeNewItem,
    removeUpdatedItem,
    removeDeletedItem,
    removeTransaction
  });

  const {
    isGenerating,
    generateAiDraft
  } = useAiDraftGenerator({
    familyId: currentFamily?.id ?? -1,
    addNewItem,
    addTransaction
  });

  // if (isSubmitting) return null;

  return (
    <DraftContext.Provider
      value={{
        newItemsState,
        addNewItem,
        modifyNewItem,
        removeNewItem,
        findNewItemByInfo,
        clearNewItems,

        updatedItemsState,
        addUpdatedItem,
        removeUpdatedItem,
        findUpdatedItemByInfo,
        clearUpdatedItems,

        deletedItemsState,
        addDeletedItem,
        removeDeletedItem,
        clearDeletedItems,

        transactionsState,
        addTransaction,
        removeTransaction,
        clearTransactions,

        aggregatedItems,
        aggregatedUpdatedParts,
        aggregatedLocations,
        hasDrafts,
        clearAll,
        
        isSubmitting,
        submitNewItems,
        submitUpdatedItems,
        submitDeletedItems,
        submitTransactions,

        isGenerating,
        generateAiDraft
      }}
    >
      {children}
    </DraftContext.Provider>
  );
};


