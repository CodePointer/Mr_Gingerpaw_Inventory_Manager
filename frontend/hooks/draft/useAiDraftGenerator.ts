// frontend/hooks/draft/useAiDraftGenerator.ts
import { useState } from 'react';
import { aiDraftGenerateItems } from '@/services/api/items';
import { AIDraftGenerateRequest, AIDraftGenerateResponse } from '@/services/types/aidraftTypes';
import { ItemOut, TransactionCreate } from '@/services/types';


export interface UseAiDraftGeneratorProps {
  familyId: number;
  addNewItem: (item: ItemOut) => void;
  addTransaction: (transaction: TransactionCreate) => void;
}


export interface UseAiDraftGeneratorReturn {
  isGenerating: boolean;
  generateAiDraft: (request: AIDraftGenerateRequest) => Promise<void>;
}


export function useAiDraftGenerator({ familyId, addNewItem, addTransaction }: UseAiDraftGeneratorProps): UseAiDraftGeneratorReturn {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAiDraft = async (request: AIDraftGenerateRequest): Promise<void> => {
    if (isGenerating) {
      console.warn("AI draft generation already in progress, ignoring new request.");
      return Promise.reject(new Error("AI draft generation already in progress"));
    }
    
    setIsGenerating(true);
    try {
      const response = await aiDraftGenerateItems(familyId, request);
      
      if (response) {
        response.itemCreate.forEach(addNewItem);
        response.itemTransaction.forEach(addTransaction);
        console.log('AI draft generation completed successfully:', response);
      } else {
        console.warn("No response received from AI draft generation.");
      }

    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, generateAiDraft };
}