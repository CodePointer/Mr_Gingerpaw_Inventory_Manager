import React, { Component, useEffect, useMemo, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { useUser, useDrafts } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { TransactionCreate } from '@/services/types';
import { Layout, ViewComponents, TextComponents, Components, Colors, Spacing } from '@/styles';
import { Feather } from '@expo/vector-icons'
import Button from '@/components/common/Button';


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

  const [changeToValue, setChangeToValue] = useState<string>('0');

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
      changeType: 'ADD',
      quantity: change,
      rawInput: '[Manual Input]'
    }
    addTransactionToDraft(draftId, txn);
    setChangeToValue(String(baseValue));
  };

  const increment = () => setChangeToValue(String(parseFloat(changeToValue) + 1.0));
  const decrement = () => setChangeToValue(String(parseFloat(changeToValue) - 1.0));

  return (
    <View style={[Layout.row, { flex: 1, paddingHorizontal: Spacing.medium }]}>
      <Text style={[TextComponents.inputLabel]}>
        {t('draft.manualChange')}
      </Text>

      <View style={Layout.row}>
        <TouchableOpacity onPress={decrement}>
          <Feather name='minus-circle' color={Colors.primaryDeep} size={20}/>
        </TouchableOpacity>
        <TextInput
          style={[TextComponents.inputBox, { width: 48 }]}
          keyboardType='numeric'
          value={changeToValue}
          onChangeText={setChangeToValue}
          onSubmitEditing={submitTxn}
          returnKeyType='done'
        />
        <TouchableOpacity onPress={increment}>
          <Feather name='plus-circle' color={Colors.primaryDeep} size={20}/>
        </TouchableOpacity>
      </View>
      
      <Button onPress={submitTxn}>{t('draft.manualSubmit')}</Button>
    </View>
  );
}
