// useAIDraftEditor.ts

import { useState } from 'react';
import { AIDraftFormModalValues } from '@/services/types/aidraftTypes';

export interface UseAIDraftEditorProps {
  onProcess: (values: AIDraftFormModalValues) => void;
}


export interface UseAIDraftEditorReturn {
  modalVisible: boolean;
  queryType: string;
  queryId: string;
  openEditor: () => void;
  closeEditor: () => void;
  handleSubmit: (values: AIDraftFormModalValues) => void;
}


export function useAIDraftEditor({
  onProcess
}: UseAIDraftEditorProps): UseAIDraftEditorReturn {
  const [modalVisible, setModalVisible] = useState(false);
  const [queryType, setQueryType] = useState<string>('new');
  const [queryId, setQueryId] = useState<string>('');

  const openEditor = () => {
    setQueryType('new');
    setQueryId(`ainew-${Date.now()}`);
    setModalVisible(true);
  };

  const closeEditor = () => {
    setModalVisible(false);
    setQueryType('new');
    setQueryId('');
  };

  const handleSubmit = (values: AIDraftFormModalValues) => {
    onProcess(values);
    closeEditor();
  };

  return {
    modalVisible,
    queryType,
    queryId,
    openEditor,
    closeEditor,
    handleSubmit
  };
}