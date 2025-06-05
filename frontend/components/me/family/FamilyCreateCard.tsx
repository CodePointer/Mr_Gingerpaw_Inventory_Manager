// components/me/FamilyCard.tsx
import {
  View, Text, TouchableOpacity
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Colors } from "@/styles";
import { Layout, ViewComponents, TextComponents } from '@/styles';


interface FamilyCreateCardProps {
  onToggle: () => void;
}


export function FamilyCreateCard({ onToggle }: FamilyCreateCardProps) {
  const { t } = useTranslation();

  return (
    <View style={[ViewComponents.subCard, Layout.row, { backgroundColor: Colors.deleted }]}>
      <TouchableOpacity onPress={onToggle} style={[Layout.row, { flex: 1 }]}>
        <Feather name={'plus'} size={20} style={{ marginRight: 10 }}/>
        <Text style={[TextComponents.subtitleText, { flex: 1 }]}>
          {t('family.buttonCreateNewFamily')}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
