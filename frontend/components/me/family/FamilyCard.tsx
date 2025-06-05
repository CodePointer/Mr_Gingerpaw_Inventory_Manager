// components/me/FamilyCard.tsx
import {
  View, Text, TouchableOpacity
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/styles";
import { Layout, ViewComponents, TextComponents } from '@/styles';
import { FamilyOut, UserOut } from "@/services/types";


interface FamilyCardProps {
  family: FamilyOut;
  members?: UserOut[];
  selected: boolean;
  onToggle: (family: FamilyOut) => void;
  onEdit: (family: FamilyOut) => void;
  onDelete: (family: FamilyOut) => void;
}


export function FamilyCard({ 
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
