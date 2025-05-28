import React, { useState } from "react";
import { FlatList, View, StyleSheet, Text } from "react-native";
import { useDrafts } from "@/hooks";
import { useTranslation } from "react-i18next";
import { DraftCard } from "./DraftCard";
import { Layout, Colors, Typography } from "@/styles";


export function DraftScreen() {
  const { t } = useTranslation();
  const { drafts, removeDraft, submitDraft, removeTransactionInDraft } = useDrafts();
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  
  const toggleExpanded = (draftId: number) => {
    const next = new Set(expandedIds);
    next.has(draftId) ? next.delete(draftId) : next.add(draftId);
    setExpandedIds(next);
  }

  if (drafts.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={Typography.body}>{t('draft.empty')}</Text>
      </View>
    );
  }

  return (
    <View style={Layout.container}>
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
    </View>
    
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
  },
});
