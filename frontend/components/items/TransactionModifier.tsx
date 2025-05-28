import React, { Component, useEffect, useMemo, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import { useUser, useDrafts } from "@/hooks";
import { useTranslation } from "react-i18next";
import { TransactionCreate } from "@/services/types";
import { Layout, Components, Colors, Spacing } from "@/styles";
import { Feather } from '@expo/vector-icons'


interface TransactionModifierProps {
  itemId: number;
  quantity?: number;
}


export function TransactionModifier({ 
  itemId, 
  quantity = 0 
}: TransactionModifierProps) {

  const { aggregatedMap, ensureManualDraft, addTransactionToDraft } = useDrafts();
  const { user } = useUser();
  const { t } = useTranslation();

  const [changeToValue, setChangeToValue] = useState<string>("0");

  const baseValue = useMemo(() => {
    return (aggregatedMap.get(itemId) ?? 0) + quantity;
  }, [aggregatedMap, itemId, quantity]);

  useEffect(() => {
    setChangeToValue(String(baseValue));
  }, [baseValue]);

  const submitTxn = () => {
    if (!user) return;
    const changeTo = parseFloat(changeToValue);
    const change = changeTo - baseValue;
    if (isNaN(change) || change === 0) {
      setChangeToValue(String(baseValue));
      return;
    }
    const draftId = ensureManualDraft();
    const txn: TransactionCreate = {
      itemId: itemId,
      userId: user.id,
      changeType: "ADD",
      quantity: change,
      rawInput: "[Manual Input]"
    }
    addTransactionToDraft(draftId, txn);
    setChangeToValue(String(baseValue));
  };

  const increment = () => setChangeToValue(String(parseFloat(changeToValue) + 1.0));
  const decrement = () => setChangeToValue(String(parseFloat(changeToValue) - 1.0));

  return (
    <View style={[Layout.row, { flex: 1 }]}>
      <Text style={[Components.inputLabel as TextStyle]}>
        {t('draft.manualChange')}
      </Text>

      <View style={[styles.container]}>
        <TouchableOpacity onPress={decrement}>
          <Feather name="minus-circle" color={Colors.primaryDeep} size={20}/>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={changeToValue}
          onChangeText={setChangeToValue}
          onSubmitEditing={submitTxn}
          returnKeyType="done"
        />
        <TouchableOpacity onPress={increment}>
          <Feather name="plus-circle" color={Colors.primaryDeep} size={20}/>
        </TouchableOpacity>
      </View>
      

      <TouchableOpacity onPress={submitTxn} style={Components.button as ViewStyle}>
        <Text style={Components.buttonText as TextStyle}>
          {t('draft.manualSubmit')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    // marginTop: Spacing.small,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: Colors.borderSoft,
    justifyContent: "center",
    alignItems: "center",
  },
  stepText: {
    fontSize: 20,
    color: Colors.textDark,
  },
  input: {
    width: 48,
    height: 32,
    marginHorizontal: Spacing.small,
    textAlign: "center",
    backgroundColor: Colors.white,
    borderColor: Colors.borderSoft,
    borderWidth: 1,
    borderRadius: 4,
    padding: 0,
  },
  submitBtn: {
    marginLeft: Spacing.small,
    paddingHorizontal: Spacing.medium,
    paddingVertical: 6,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  submitText: {
    color: Colors.white,
    fontWeight: "500",
  },
});