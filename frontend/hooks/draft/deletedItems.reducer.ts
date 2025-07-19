import { ItemDelete } from '@/services/types/itemTypes';

export type DeletedItemsAction =
  | { type: 'INIT'; payload: DeletedItemsState | null }
  | { type: 'ADD'; payload: { item: ItemDelete } }
  | { type: 'REMOVE'; payload: { itemId: string } }
  | { type: 'CLEAR'; payload: {} };

export interface DeletedItemsState {
  lastUpdated: Date | null;
  deletedItems: Record<string, ItemDelete>;
}

export const initialDeletedItemsState: DeletedItemsState = {
  lastUpdated: null,
  deletedItems: {}
};


export function deletedItemsReducer(
  state: DeletedItemsState,
  action: DeletedItemsAction
): DeletedItemsState {
  switch (action.type) {
    case 'INIT':
      return action.payload ?? initialDeletedItemsState;
    case 'ADD':
      return {
        ...state,
        deletedItems: {
          ...state.deletedItems,
          [action.payload.item.id]: action.payload.item
        },
        lastUpdated: new Date()
      };

    case 'REMOVE':
      const newDeletedItems = { ...state.deletedItems };
      delete newDeletedItems[action.payload.itemId];
      return {
        ...state,
        deletedItems: newDeletedItems,
        lastUpdated: new Date()
      };

    case 'CLEAR':
      return initialDeletedItemsState;

    default:
      return state;
  }
}

