import React, { useState } from "react";
import { FlatList, View, StyleSheet, Text, ScrollView } from "react-native";
import { useDrafts } from "@/hooks";
import { useTranslation } from "react-i18next";
import { ViewComponents, Colors, Typography } from "@/styles";
import { EmptyScreen } from "@/components/common/DefaultScreen";
import { DraftCard } from "./DraftCard";


export function DraftScreen() {
  const { t } = useTranslation();
  const { drafts, removeDraft, submitDraft, removeTransactionInDraft } = useDrafts();
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  
  const toggleExpanded = (draftId: number) => {
    const next = new Set(expandedIds);
    next.has(draftId) ? next.delete(draftId) : next.add(draftId);
    setExpandedIds(next);
  }

  if (drafts.length === 0) return (<EmptyScreen />);

  return (
    <ScrollView style={ViewComponents.screen}>
      <FlatList
        data={drafts}
        keyExtractor={(draft) => String(draft.id)}
        renderItem={({ item: draft }) => (
          <DraftCard
            draft={draft}
            expanded={expandedIds.has(draft.id)}
            onToggle={() => toggleExpanded(draft.id)}
            onSubmit={() => submitDraft(draft.id)}
            onCancel={() => removeDraft(draft.id)}
            onRemoveTxn={(itemId) =>
              removeTransactionInDraft(draft.id, itemId)
            }
          />
        )}
      />
    </ScrollView>
    
  );
}
