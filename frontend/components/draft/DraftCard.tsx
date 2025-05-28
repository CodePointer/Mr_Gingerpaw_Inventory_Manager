import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useTranslation } from "react-i18next";
import { DraftOut } from "@/services/types";
import { TransactionCard } from "./TransactionCard";
import { Colors, Typography, Spacing } from "@/styles";


interface DraftCardProps {
  draft: DraftOut;
  expanded: boolean;
  onToggle: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  onRemoveTxn: (itemId: number) => void;
}


export function DraftCard({
  draft,
  expanded,
  onToggle,
  onSubmit,
  onCancel,
  onRemoveTxn
}: DraftCardProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity style={styles.header} onPress={onToggle}>
        <Text style={styles.title}>{draft.title}</Text>
        <Text style={styles.meta}>
          {draft.updatedAt.toLocaleString()} - {draft.id}
        </Text>
      </TouchableOpacity>

      {/* Transactions */}
      {expanded &&
        <>
          {/* Raw input (AI) */}
          {draft.type === "ai" && draft.rawInput ? (
            <Text style={styles.rawInput}>“{draft.rawInput}”</Text>
          ) : null}

          <FlatList
            data={draft.transactions}
            keyExtractor={(txn) => String(txn.itemId)}
            renderItem={({ item: txn }) => (
              <TransactionCard
                transaction={txn}
                onRemove={() => onRemoveTxn(txn.itemId)}
              />
            )}
          />
        </>
      }

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onCancel} style={styles.button}>
          <Text style={styles.btnText}>{t('draft.buttonCancel')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSubmit} style={styles.button}>
          <Text style={styles.btnText}>{t('draft.buttonSubmit')}</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: Spacing.medium,
    padding: Spacing.medium,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 8,
  },
  header: { marginBottom: Spacing.small },
  title: {
    ...Typography.title,
    fontSize: 16,
    fontWeight: "600",
  },
  meta: {
    ...Typography.body,
    color: Colors.textDark,
  },
  rawInput: {
    ...Typography.body,
    fontStyle: "italic",
    marginVertical: Spacing.small,
  },
  txnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  txnText: {
    ...Typography.body,
  },
  increase: { color: Colors.primaryDeep },
  decrease: { color: Colors.primary },
  remove: {
    color: Colors.textMuted,
    paddingHorizontal: Spacing.small,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Spacing.medium,
  },
  button: {
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.small,
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },
  btnText: {
    color: Colors.primaryDeep,
    fontWeight: "500",
  },
});