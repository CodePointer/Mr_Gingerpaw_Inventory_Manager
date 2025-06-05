// components/me/FamilyCard.tsx
import React, { useState, useEffect } from "react";
import {
  View, FlatList, TouchableOpacity
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useUser, useFamily } from "@/hooks";
import { Layout } from '@/styles';
import { FamilyOut } from "@/services/types";
import { FamilyCard } from './FamilyCard';
import { FamilyCreateCard } from "./FamilyCreateCard";


interface FamilyCardListProps {
  onCreateFamily: () => void;
  onEditFamily: () => void;
  onDeleteFamily: () => void;
}


export function FamilyCardList({ 
  onCreateFamily, 
  onEditFamily,
  onDeleteFamily,
}: FamilyCardListProps) {

  const { families } = useUser();
  const { currentFamily, members, selectFamily } = useFamily();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [familiesSet, setFamiliesSet] = useState<(FamilyOut | null)[]>([]);

  useEffect(() => {
    setFamiliesSet([...families, null]);
  }, [families]);

  const toggleFamily = (family: FamilyOut) => {
    if (currentFamily?.id !== family.id) {
      selectFamily(family);
    }
  };

  const onToggle = () => {
    setExpanded(!expanded);
  };

  const renderCard = (family: FamilyOut | null) => {
    if (family === null) {
      if (expanded || familiesSet.length === 1) {
        return (
          <FamilyCreateCard onToggle={onCreateFamily} />
        );
      } else {
        return (<></>);
      }
    } 

    if (!expanded && currentFamily?.id !== family.id) {
      return (<></>);
    } else {
      return (
        <FamilyCard
          family={family}
          members={members}
          selected={currentFamily?.id === family.id}
          onToggle={toggleFamily}
          onEdit={onEditFamily}
          onDelete={onDeleteFamily}
        />
      )
    }
  };

  return (
    <View style={[Layout.row]}>
      <TouchableOpacity
        onPress={() => onToggle()}
        style={{ marginRight: 10 }}
      >
        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          onPress={() => onToggle()}
          size={20}
        />
      </TouchableOpacity>

      <FlatList
        data={familiesSet}
        keyExtractor={(item) => item?.id.toString() ?? 'new'}
        renderItem={({ item }) => renderCard(item)}
      />
    </View>
  );
}