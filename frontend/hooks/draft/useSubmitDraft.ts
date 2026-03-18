import { createItems, updateItems, deleteItems } from '@/services/api/items';
import { submitTrans } from '@/services/api/transaction';
import { BulkResponseOut, ItemDelete, ItemOut, ItemResponseStatus, ItemUpdate, TransactionCreate } from '@/services/types';
import { Item } from '@/services/utils/types';
import { useState } from 'react';


export interface UseSubmitDraftProps {
  familyId: number;
  userId: number;
  newItems: Record<string, ItemOut>;
  updatedItems: Record<string, ItemOut>;
  updatedParts: Record<string, ItemUpdate>; // itemId -> updated parts
  deletedItems: Record<string, ItemDelete>;
  transactions: Record<string, TransactionCreate>;

  removeNewItem: (itemId: string) => void;
  removeUpdatedItem: (itemId: string) => void;
  removeDeletedItem: (itemId: string) => void;
  removeTransaction: (itemId: string) => void;
}

export interface UseSubmitDraftReturn {
  isSubmitting: boolean;
  submitNewItems: (removeSuccess: boolean) => Promise<BulkResponseOut<ItemResponseStatus>>;
  submitUpdatedItems: (removeSuccess: boolean) => Promise<BulkResponseOut<ItemResponseStatus>>;
  submitDeletedItems: (removeSuccess: boolean) => Promise<BulkResponseOut<ItemResponseStatus>>;
  submitTransactions: (removeSuccess: boolean) => Promise<BulkResponseOut<ItemResponseStatus>>;
}

export function useSubmitDraft({
  familyId,
  userId,
  newItems,
  updatedItems,
  updatedParts,
  deletedItems,
  transactions,
  removeNewItem,
  removeUpdatedItem,
  removeDeletedItem,
  removeTransaction
}: UseSubmitDraftProps): UseSubmitDraftReturn {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadThings = async (
    removeSuccess: boolean, 
    dataArray: any[], 
    uploadFunc: (familyId: number, data: any[]) => Promise<BulkResponseOut<ItemResponseStatus>>,
    removeFunc: (id: string) => void
  ): Promise<BulkResponseOut<ItemResponseStatus>> => {
    if (isSubmitting) {
      console.warn('Submission already in progress, ignoring new request.');
      return { success: [], failed: [] } as BulkResponseOut<ItemResponseStatus>;
    }
    setIsSubmitting(true);
    if (dataArray.length === 0) {
      setIsSubmitting(false);
      return { success: [], failed: [] } as BulkResponseOut<ItemResponseStatus>;
    }
    const response = await uploadFunc(familyId, dataArray);
    if (removeSuccess) {
      response.success.forEach(status => removeFunc(status.itemId));
    }
    setIsSubmitting(false);
    return response;
  }

  const submitNewItems = async (removeSuccess: boolean): Promise<BulkResponseOut<ItemResponseStatus>> => {
    return uploadThings(removeSuccess, Object.values(newItems), createItems, removeNewItem);
  };

  const submitUpdatedItems = async (removeSuccess: boolean): Promise<BulkResponseOut<ItemResponseStatus>> => {
    return uploadThings(removeSuccess, Object.values(updatedParts), updateItems, removeUpdatedItem);
  };

  const submitDeletedItems = async (removeSuccess: boolean): Promise<BulkResponseOut<ItemResponseStatus>> => {
    return uploadThings(removeSuccess, Object.values(deletedItems), deleteItems, removeDeletedItem);
  }

  const submitTransWithProcessing = async (
    familyId: number, 
    transactions: TransactionCreate[]
  ): Promise<BulkResponseOut<ItemResponseStatus>> => {
    const newTransactions: TransactionCreate[] = transactions.map(tran => ({
      ...tran,
      userId,
      changeType: tran.quantity > 0 ? 'ADD' : 'REMOVE',
      quantity: Math.abs(tran.quantity)
    }));
    console.log('Submitting transactions:', newTransactions);
    return submitTrans(familyId, newTransactions);
  }

  const submitTransactions = async (removeSuccess: boolean): Promise<BulkResponseOut<ItemResponseStatus>> => {
    return uploadThings(removeSuccess, Object.values(transactions), submitTransWithProcessing, removeTransaction);
  };

  return {
    isSubmitting,
    submitNewItems,
    submitUpdatedItems,
    submitDeletedItems,
    submitTransactions
  };
}
