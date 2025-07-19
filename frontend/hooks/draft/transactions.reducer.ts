import { TransactionCreate } from '@/services/types';

export type TransactionAction = 
  | { type: 'INIT'; payload: TransactionsState | null }
  | { type: 'ADD'; payload: { transaction: TransactionCreate } }
  | { type: 'REMOVE'; payload: { itemId: string } }
  | { type: 'CLEAR'; payload: {} };

export interface TransactionsState {
  lastUpdated: Date | null;
  transactions: Record<string, TransactionCreate>;
}

export const initialTransactionsState: TransactionsState = {
  lastUpdated: null,
  transactions: {}
};

export function transactionsReducer(
  state: TransactionsState,
  action: TransactionAction
): TransactionsState {
  switch (action.type) {
    case 'INIT':
      return action.payload ?? initialTransactionsState;
    case 'ADD':
      return {
        ...state,
        transactions: {
          ...state.transactions,
          [action.payload.transaction.itemId]: action.payload.transaction
        },
        lastUpdated: new Date()
      };

    case 'REMOVE':
      const transactions = { ...state.transactions };
      delete transactions[action.payload.itemId];
      return {
        ...state,
        transactions,
        lastUpdated: new Date()
      };

    case 'CLEAR':
      return initialTransactionsState;

    default:
      return state;
  }
}