// draft.reducer.ts
import { 
  DraftOut, 
  DraftUpdate, 
  ItemOut, 
  TransactionCreate 
} from "@/services/types";

export type DraftAction = 
  | { type: 'ADD_DRAFT'; payload: DraftOut }
  | { type: 'RESUME_DRAFT'; payload: DraftOut[] }
  | { type: 'REMOVE_DRAFT'; payload: { draftId: number } }
  | { type: 'REMOVE_DRAFT_ALL' }
  | { type: 'UPDATE_DRAFT_INFO'; payload: { draftId: number, draftUpdate: DraftUpdate } }
  | { type: 'ADD_ITEM'; payload: { itemKey: string, item: ItemOut } }  // TODO 思考好创建item之后的操作。
  | { type: 'REMOVE_ITEM'; payload: { itemKey: string } }
  | { type: 'ADD_TRANSACTION'; payload: { draftId: number; transaction: TransactionCreate } }
  | { type: 'REMOVE_TRANSACTION'; payload: { draftId: number; itemId: number } };


export interface DraftState {
  drafts: DraftOut[];
};


export const initialDraftState: DraftState = {
  drafts: []
};

export function draftReducer(state: DraftState, action: DraftAction): DraftState {
  switch (action.type) {
    case 'ADD_DRAFT':
      return {
        ...state,
        drafts: [...state.drafts, action.payload]
      };
    
    case 'RESUME_DRAFT':
      return {
        ...state,
        drafts: action.payload
      };

    case 'REMOVE_DRAFT':
      return {
        ...state,
        drafts: state.drafts.filter(draft => draft.id !== action.payload.draftId)
      };

    case 'REMOVE_DRAFT_ALL':
      return {
        ...state,
        drafts: []
      };

    case 'UPDATE_DRAFT_INFO':
      return {
        ...state,
        drafts: state.drafts.map(draft =>
          draft.id === action.payload.draftId ? { ...draft, ...action.payload.draftUpdate } : draft
        )
      };

    case 'ADD_TRANSACTION':
      const newTransaction = action.payload.transaction;
      return {
        ...state,
        drafts: state.drafts.map(draft =>
          draft.id === action.payload.draftId
            ? { 
              ...draft, 
              transactions: { ...draft.transactions, [newTransaction.itemId]: newTransaction } 
            }
            : draft
        )
      };

    case 'REMOVE_TRANSACTION':
      return {
        ...state,
        drafts: state.drafts.map(draft => {
          if (draft.id == action.payload.draftId) {
            const { [action.payload.itemId]: removed, ...remainingTransactions } = draft.transactions;
            return { ...draft, transactions: remainingTransactions };
          } else {
            return draft;
          }
        })
      };

    default:
      return state;
  }
}