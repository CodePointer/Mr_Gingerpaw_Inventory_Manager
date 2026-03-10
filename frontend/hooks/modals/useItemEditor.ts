// useItemEditor.ts
import { useState } from 'react';
import { ItemFormModalValues, ItemOut, ItemOut2FormValues, LocationOut, TagOut } from '@/services/types';


export interface UseItemEditorProps {
  baseItems: ItemOut[];
  newItems: Record<string, ItemOut>;
  updatedItems: Record<string, ItemOut>;
  locations: LocationOut[];
  tags: TagOut[];
  findItemByInfo: (values: ItemFormModalValues) => string | null;
  findNewItemByInfo: (values: ItemFormModalValues) => string | null;
  findUpdatedItemByInfo: (values: ItemFormModalValues) => string | null;
  onProcess: (itemId: string, values: ItemFormModalValues) => void;
}


export interface UseItemEditorReturn {
  modalVisible: boolean;
  modalMode: 'create' | 'edit';
  editingItemId: string | null;
  initialFormValue: ItemFormModalValues | null;
  openEditor: (itemId: string | null) => void;
  closeEditor: () => void;
  handleSubmit: (
    values: ItemFormModalValues,
    mode?: 'create' | 'edit',
    selectedItemId?: string | null
  ) => void;
  locations: LocationOut[];
  tags: TagOut[];
}


export function useItemEditor({
  baseItems,
  newItems,
  updatedItems,
  locations,
  tags,
  findItemByInfo,
  findNewItemByInfo,
  findUpdatedItemByInfo,
  onProcess
}: UseItemEditorProps) : UseItemEditorReturn {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [initialFormValue, setInitialFormValue] = useState<ItemFormModalValues | null>(null);

  const openEditor = (itemId: string | null) => {
    const mode = (itemId === null || itemId.startsWith('tmpId')) ? 'create' : 'edit';
    setModalMode(mode);
    setEditingItemId(itemId ?? `tmpId-${Date.now()}`);
    if (itemId === null) {
      setInitialFormValue(null);
    } else if (itemId.startsWith('tmpId')) {
      const initialItem = ItemOut2FormValues(newItems[itemId]);
      setInitialFormValue(initialItem);
    } else {
      const item = updatedItems[itemId] ?? baseItems.find(it => it.id === itemId)
      setInitialFormValue(item ? ItemOut2FormValues(item) : null);
    }
    setModalVisible(true);
  };

  const closeEditor = () => {
    setEditingItemId(null);
    setInitialFormValue(null);
    setModalVisible(false);
  }

  const handleSubmit = (
    values: ItemFormModalValues,
    mode: 'create' | 'edit' = 'create',
    selectedItemId: string | null = null
  ) => {
    // Check if valid.
    // const existsInUpdated = findUpdatedItemByInfo(values) !== null;
    // const existsInBase = findItemByInfo(values) !== null;
    // if (existsInUpdated || (!existsInUpdated && existsInBase)) {
    //   return;
    // }
    if (!editingItemId) {
      closeEditor();
      return;
    }

    let targetItemId = editingItemId;
    if (mode === 'create') {
      if (!targetItemId.startsWith('tmpId')) {
        targetItemId = `tmpId-${Date.now()}`;
      }
    } else {
      targetItemId = selectedItemId ?? targetItemId;
    }

    onProcess(targetItemId, values);
    closeEditor();
  }

  return {
    modalVisible,
    modalMode,
    editingItemId,
    initialFormValue,
    openEditor,
    closeEditor,
    handleSubmit,
    locations,
    tags
  };
}
