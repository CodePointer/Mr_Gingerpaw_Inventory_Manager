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
import { Colors, Typography, Spacing, Layout, ViewComponents, TextComponents } from "@/styles";
import Button from '@/components/common/Button';


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
    <View style={ViewComponents.card}>
      {/* Header */}
      <TouchableOpacity style={{ marginBottom: Spacing.small }} onPress={onToggle}>
        <Text style={TextComponents.subtitleText}>{draft.title}</Text>
        <Text style={TextComponents.smallText}>
          {draft.updatedAt.toLocaleString()} - {draft.id}
        </Text>
      </TouchableOpacity>

      {/* Transactions */}
      {expanded &&
        <>
          {/* Raw input (AI) */}
          {draft.type === "ai" && draft.rawInput ? (
            <Text style={TextComponents.plainText}>“{draft.rawInput}”</Text>
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
      {expanded && <View style={Layout.buttonRow}>
        <Button onPress={onSubmit} style={ViewComponents.buttonInRow}>
          {t('draft.buttonSubmit')}
        </Button>
        <Button onPress={onCancel} style={ViewComponents.buttonInRow}>
          {t('draft.buttonCancel')}
        </Button>
      </View>}

    </View>
  );
}
