// useTagEditor.ts
import { useState } from 'react';
import { TagOut } from '@/services/types';

export interface useTagEditorProps {
  onSave: (deletedTagsId: string[], updatedTags: TagOut[], newTags: TagOut[]) => void;
}

export function useTagEditor({
  onSave
}: useTagEditorProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const openEditor = () => {
    setModalVisible(true);
  }

  const closeEditor = () => {
    setModalVisible(false);
  }

  const handleSubmit = (deletedTagsId: string[], updatedTags: TagOut[], newTags: TagOut[]) => {
    onSave(deletedTagsId, updatedTags, newTags);
    closeEditor();
  }

  return {
    modalVisible,
    openEditor,
    closeEditor,
    handleSubmit
  };
}