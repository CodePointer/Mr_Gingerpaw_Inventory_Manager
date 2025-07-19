import { ItemOut } from '@/services/types';


export type NewItemsAction =
  | { type: 'INIT'; payload: NewItemsState | null }
  | { type: 'ADD'; payload: { item: ItemOut } }
  | { type: 'MODIFY'; payload: { itemId: string; item: ItemOut } }
  | { type: 'REMOVE'; payload: { itemId: string } }
  | { type: 'CLEAR'; payload: {} };

export interface NewItemsState {
  lastUpdated: Date | null;
  newItems: Record<string, ItemOut>;
}

export const initialNewItemsState: NewItemsState = {
  lastUpdated: null,
  newItems: {}
};

export function newItemsReducer(
  state: NewItemsState,
  action: NewItemsAction
): NewItemsState {
  switch (action.type) {
    case 'INIT':
      return action.payload ?? initialNewItemsState;
    case 'ADD':
      return {
        ...state,
        newItems: {
          ...state.newItems,
          [action.payload.item.id]: action.payload.item
        },
        lastUpdated: new Date()
      };

    case 'MODIFY':
      return {
        ...state,
        newItems: {
          ...state.newItems,
          [action.payload.itemId]: action.payload.item
        },
        lastUpdated: new Date()
      };

    case 'REMOVE':
      const newItems = { ...state.newItems };
      delete newItems[action.payload.itemId];
      return {
        ...state,
        newItems,
        lastUpdated: new Date() 
      };

    case 'CLEAR':
      return initialNewItemsState;

    default:
      return state;
  }
}