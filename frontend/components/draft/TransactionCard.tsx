import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { TransactionCreate } from "@/services/types";
import { useItems } from "@/hooks/items/useItems";
import { Colors, Typography, Spacing, ViewComponents, Layout, TextComponents } from "@/styles";
import { TextWithView } from "../common/TextWithView";


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

  const getBackgroundColor = () => {
    if (transaction.quantity > 0) {
      return Colors.success;
    } else {
      return Colors.failed;
    }
  }

  return (
    <View style={[
      ViewComponents.subCard,
      { backgroundColor: getBackgroundColor() }
    ]}>
      <View style={Layout.row}>
        <View style={ViewComponents.touchableIcon}>
          <Feather name={transaction.quantity > 0 ? "plus" : "minus"} size={16}/>
        </View>

        <View style={[Layout.row, { flex: 1, marginLeft: Spacing.small }]}>
          <TextWithView textStyle={TextComponents.plainText}>
            {name} {Math.abs(transaction.quantity)} {unit} - {item?.location}
          </TextWithView>

          <TouchableOpacity onPress={() => onRemove(transaction.itemId)}>
            <Feather name='trash' size={16}/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
