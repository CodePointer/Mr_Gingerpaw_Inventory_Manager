import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { submitTrans } from '@/services/api/transaction';
import { DraftAction, DraftState } from './draft.reducer';
import { useUser } from '@/hooks/user/useUser';
import { useFamily } from '@/hooks/family/useFamily';
import { useItems } from '@/hooks/items/useItems';
import { DraftOut, TransactionCreate } from '@/services/types';


const STORAGE_KEY_BASE = 'family_drafts';


export function useDraftEffects(state: DraftState, dispatch: React.Dispatch<DraftAction>) {
  const { user } = useUser();
  const { currentFamily } = useFamily();
  const { fetchItems } = useItems();
  const [ready, setReady] = useState(false);

  const storageKey = useMemo(
    () => (user ? `${STORAGE_KEY_BASE}_${user.id}` : STORAGE_KEY_BASE),
    [user]
  );

  useEffect(() => {
    if (!currentFamily) {
      dispatch({ type: 'REMOVE_DRAFT_ALL' });
      AsyncStorage.removeItem(storageKey).catch((e) => {
        console.error('Removing json failed', e);
      })
    }
  }, [currentFamily]);

  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem(storageKey);
        if (data) {
          const parsed = JSON.parse(data) as DraftOut[];
          dispatch({ type: 'RESUME_DRAFT', payload: parsed });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setReady(true);
      }
    })();
  }, [user]);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(storageKey, JSON.stringify(state.drafts)).catch((e) => {
      console.error('Saving json failed', e);  
    });
  }, [state.drafts, ready]);

  const submitDraft = useCallback(async (draftId: number) => {
    if (!currentFamily) return false;
    const draft = state.drafts.find((draft) => draft.id === draftId);
    if (!draft) return false;

    const newTransactions: TransactionCreate[] = Object.values(draft.transactions ?? {}).map(txn => ({
      ...txn,
      changeType: txn.quantity > 0 ? 'ADD' : 'REMOVE',
      quantity: Math.abs(txn.quantity),
    }));
    try {
      await submitTrans(currentFamily.id, newTransactions);
    } catch (error) {
      console.error("❌ 提交草稿时发生错误:", error);
      return false;
    }
    dispatch({ type: 'REMOVE_DRAFT', payload: { draftId } });
    fetchItems();
    return true;
  }, [currentFamily, state.drafts, dispatch]);

  return { ready, submitDraft };
}