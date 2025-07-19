// components/me/FamilyCard.tsx
import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useUser, useFamily } from "@/hooks";
import { Colors, Layout, ViewComponents, TextComponents } from '@/styles';
import { FamilyOut, UserOut } from "@/services/types";
import { useTranslation } from "react-i18next";


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
          <FamilyCreateCard key={'create'} onToggle={onCreateFamily} />
        );
      } else {
        return null;
      }
    } 

    if (!expanded && currentFamily?.id !== family.id) {
      return null;
    } else {
      return (
        <FamilyCard
          key={"family" + family.id.toString()}
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

      <View style={{ flex: 1 }}>
        {familiesSet.map((itm) => renderCard(itm))}
      </View>

    </View>
  );
}


interface FamilyCardProps {
  family: FamilyOut;
  members?: UserOut[];
  selected: boolean;
  onToggle: (family: FamilyOut) => void;
  onEdit: (family: FamilyOut) => void;
  onDelete: (family: FamilyOut) => void;
}

function FamilyCard({ 
  family,
  members,
  selected,
  onToggle,
  onEdit,
  onDelete,
}: FamilyCardProps) {

  const getStatusColor = () => {
    if (selected) {
      return Colors.success;
    } else {
      return Colors.failed;
    }
  };

  return (
    <View style={[ViewComponents.subCard, Layout.row, { backgroundColor: getStatusColor() }]}>
      <TouchableOpacity onPress={() => onToggle(family)} style={[Layout.row, { flex: 1 }]}>
        <Feather name={selected ? 'check-circle' : 'circle'} size={20} style={{ marginRight: 10 }}/>
        <View style={[Layout.column, { flex: 1 }]}>
          <Text style={TextComponents.subtitleText}>{family.name}</Text>
          {selected && (<>
            <Text style={TextComponents.plainText}>{family.notes}</Text>
            <Text style={TextComponents.smallText}>
              {members?.map(member => member.username).join(', ')}
            </Text>
          </>)}
        </View>
      </TouchableOpacity>

      {selected && (<>

      <TouchableOpacity onPress={() => onEdit(family)} style={{ marginRight: 10 }}>
        <Feather name={'edit'} size={20}/>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onDelete(family)} style={{ marginRight: 10 }}>
        <Feather name={'trash'} size={20}/>
      </TouchableOpacity>
      
      </>)}
    </View>
  )
}


interface FamilyCreateCardProps {
  onToggle: () => void;
}


function FamilyCreateCard({ onToggle }: FamilyCreateCardProps) {
  const { t } = useTranslation(['me']);

  return (
    <View style={[ViewComponents.subCard, Layout.row, { backgroundColor: Colors.deleted }]}>
      <TouchableOpacity onPress={onToggle} style={[Layout.row, { flex: 1 }]}>
        <Feather name={'plus'} size={20} style={{ marginRight: 10 }}/>
        <Text style={[TextComponents.subtitleText, { flex: 1 }]}>
          {t('me:family.button.createFamily')}
        </Text>
      </TouchableOpacity>
    </View>
  )
}