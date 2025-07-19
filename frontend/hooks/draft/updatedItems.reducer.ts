import { ItemOut } from '@/services/types';


export type UpdatedItemsAction =
  | { type: 'INIT'; payload: UpdatedItemsState | null }
  | { type: 'ADD'; payload: { itemId: string, item: ItemOut } }
  | { type: 'REMOVE'; payload: { itemId: string } }
  | { type: 'CLEAR'; payload: {} };

export interface UpdatedItemsState {
  lastUpdated: Date | null;
  updatedItems: Record<string, ItemOut>;
}

export const initialUpdatedItemsState: UpdatedItemsState = {
  lastUpdated: null,
  updatedItems: {}
};

export function updatedItemsReducer(
  state: UpdatedItemsState,
  action: UpdatedItemsAction
): UpdatedItemsState {
  switch (action.type) {
    case 'INIT':
      return action.payload ?? initialUpdatedItemsState;
    case 'ADD':
      return {
        ...state,
        updatedItems: {
          ...state.updatedItems,
          [action.payload.itemId]: action.payload.item
        },
        lastUpdated: new Date()
      };

    case 'REMOVE':
      const updatedItems = { ...state.updatedItems };
      delete updatedItems[action.payload.itemId];
      return {
        ...state,
        updatedItems,
        lastUpdated: new Date()
      };

    case 'CLEAR':
      return initialUpdatedItemsState;

    default:
      return state;
  }
}