import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { TransactionCreate } from "@/services/types";
import { useItems } from "@/hooks/items/useItems";
import { Colors, Typography, Spacing } from "@/styles";


interface TransactionCardProps {
  transaction: TransactionCreate;
  onRemove: (itemId: number) => void;
}


export function TransactionCard({
  transaction,
  onRemove,
}: TransactionCardProps) {
  const { items } = useItems();
  const item = items.find((i) => i.id === transaction.itemId);
  const name = item?.name || "Item not found";
  const unit = item?.unit || "Unit not found";

  return (
    <View style={[
      styles.row,
      transaction.quantity > 0 ? styles.plus : styles.minus,
    ]}>
      <Text 
        style={[
          Typography.body,
        ]}
      >
        {transaction.quantity > 0 ? "+\t" : "-\t"} 
        {name} {Math.abs(transaction.quantity)} {unit} - {item?.location}
      </Text>
      <TouchableOpacity onPress={() => onRemove(transaction.itemId)}>
        <Text style={styles.remove}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingVertical: Spacing.xsmall,
  },
  plus: {
    backgroundColor: Colors.success,
  },
  minus: {
    backgroundColor: Colors.failed,
  },
  remove: {
    backgroundColor: Colors.deleted
  },
});