import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useEffect
} from "react";
import {
  DraftOut,
  DraftCreate,
  DraftUpdate,
  TransactionCreate,
} from "@/services/types";
import { submitTransactions } from "@/services/api/transaction";
import { useFamily } from "@/hooks/family/useFamily";
import { useItems } from "@/hooks/items/useItems";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { v4 as uuidv4 } from "uuid";


const STORAGE_KEY = "family_drafts";


interface DraftContextType {
  drafts: DraftOut[];
  aggregatedMap: Map<number, number>; // Map<itemId, quantity>
  ensureManualDraft: () => number;
  createDraft: (draftInfo: DraftCreate) => number;
  updateDraftInfo: (draftId: number, draftUpdate: DraftUpdate) => void;
  removeDraft: (draftId: number) => void;
  submitDraft: (draftId: number) => Promise<boolean>;
  // submitAllDrafts: () => Promise<boolean>;
  // resetDrafts: () => void;
  // getAggregatedTransactions: (draftId: number) => Record<number, number>;
  addTransactionToDraft: (draftId: number, transaction: TransactionCreate) => void;
  removeTransactionInDraft: (draftId: number, itemId: number) => void;
}


export const DraftContext = createContext<DraftContextType | undefined>(undefined);


export const DraftProvider = ({ children }: { children: ReactNode }) => {
  const { currentFamily } = useFamily();
  const { fetchItems } = useItems();
  const [drafts, setDrafts] = useState<DraftOut[]>([]);
  const [ready, setReady] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data) as DraftOut[];
          setDrafts(parsed);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(drafts)).catch((e) => {
      console.error("Saving json failed", e);  
    });
  }, [drafts, ready]);

  const createDraft = useCallback((draftInfo: DraftCreate): number => {
    const id = Date.now();
    const newDraft: DraftOut = {
      id: id,
      title: draftInfo.title,
      type: draftInfo.type,
      createdAt: new Date(),
      updatedAt: new Date(),
      rawInput: draftInfo.rawInput,
      transactions: [],
      status: "pending"
    };
    setDrafts((prev) => [...prev, newDraft]);
    // console.log("Draft created:", id);
    return id;
  }, []);

  const ensureManualDraft = useCallback((): number => {
    const manual = drafts.find((draft) => draft.type === "manual");
    if (manual) return manual.id;
    return createDraft({ title: t('draft.manualEntry'), type: "manual", rawInput: null });
  }, [drafts, createDraft]);

  const aggregatedMap = useMemo(() => {
    const map = new Map<number, number>();
    for (const d of drafts) {
      for (const txn of d.transactions) {
        const prev = map.get(txn.itemId) || 0;
        const next = prev + txn.quantity;
        if (next === 0) {
          map.delete(txn.itemId);
        } else {
          map.set(txn.itemId, next);
        }
      }
    }
    return map;
  }, [drafts]);

  const addTransactionToDraft = useCallback((draftId: number, transaction: TransactionCreate) => {
    setDrafts((prev) =>
      prev.map((draft) => {
        if (draft.id !== draftId) return draft;
        const idx = draft.transactions.findIndex((txn) => txn.itemId === transaction.itemId);
        let newTxns: TransactionCreate[];
        if (idx >= 0) {
          const newQuantity = draft.transactions[idx].quantity + transaction.quantity;
          if (newQuantity === 0) {
            newTxns = draft.transactions.filter((txn) => txn.itemId !== transaction.itemId);
          } else {
            newTxns = draft.transactions.map((txn, i) =>
              i === idx ? {
                ...txn,
                quantity: newQuantity,
              } : txn
            );
          }
        } else { 
          newTxns = [...draft.transactions, transaction];
        }
        return {
          ...draft,
          transactions: newTxns,
          updatedAt: new Date(),
        }
      })
    );
  }, []);

  const removeTransactionInDraft = useCallback((draftId: number, itemId: number) => {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.id === draftId ? {
          ...draft,
          transactions: draft.transactions.filter(
            (txn) => txn.itemId !== itemId
          ),
          updatedAt: new Date(),
        } : draft
      )
    );
  }, []);

  const updateDraftInfo = useCallback((draftId: number, draftUpdate: DraftUpdate) => {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.id === draftId ? {
          ...draft,
          ...draftUpdate,
          updatedAt: new Date()
        } : draft
      )
    );
  }, []);

  const removeDraft = useCallback((draftId: number) => {
    setDrafts((prev) => prev.filter((draft) => draft.id !== draftId));
  }, []);

  const submitDraft = useCallback(async (draftId: number) => {
    if (!currentFamily) return false;
    const draft = drafts.find((draft) => draft.id === draftId);
    if (!draft) return false;
    const newTransactions: TransactionCreate[] = draft.transactions.map((txn) => ({
      ...txn,
      changeType: txn.quantity > 0 ? "ADD" : "REMOVE",
      quantity: Math.abs(txn.quantity),
    }))
    try {
      await submitTransactions(currentFamily.id, newTransactions);
      // updateDraftInfo(draftId, { status: "reviewing" });
      // console.log("✅ 草稿提交成功:", draftTimestamp);
    } catch (error) {
      console.error("🚫 草稿提交失败:", error);
      return false;
    }
    removeDraft(draftId);
    fetchItems();
    return true;
  }, [currentFamily, drafts, removeDraft, updateDraftInfo]);

  if (!ready) return null;

  return (
    <DraftContext.Provider
      value={{
        drafts,
        aggregatedMap,
        ensureManualDraft,
        createDraft,
        updateDraftInfo,
        removeDraft,
        submitDraft,
        addTransactionToDraft,
        removeTransactionInDraft,
      }}
    >
      {children}
    </DraftContext.Provider>
  );
};


