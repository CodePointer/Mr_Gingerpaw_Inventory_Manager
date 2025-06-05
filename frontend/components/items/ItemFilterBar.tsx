// components/items/ItemFilterBar.tsx
import {
  View,
  StyleSheet,
  TextInput,
  TextStyle,
  ViewStyle
} from "react-native";
import { useTranslation } from "react-i18next";
import { LocationSelector } from "@/components/common/LocationSelector";
import { LocationOut, TagOut } from "@/services/types"
import { Colors, Components, ViewComponents, TextComponents, Layout, Spacing } from "@/styles";
import { TagSelector } from "@/components/tags/TagSelector";
import { InputField } from "../common/InputField";


interface ItemFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  locations: LocationOut[];
  selectedLocationName: string | null;
  onToggleLocation: (loc: string) => void;
  tags: TagOut[];
  selectedTagIds: Set<number>;
  onToggleTagIds: (tagId: number) => void;
  style?: ViewStyle | ViewStyle[];
}


export function ItemFilterBar({
  searchQuery,
  onSearchChange,
  locations,
  selectedLocationName,
  onToggleLocation,
  tags,
  selectedTagIds,
  onToggleTagIds,
  style = {}
}: ItemFilterBarProps) {
  const { t } = useTranslation();
  return (
    <View style={[Layout.column, style]}>
      {/* Search Bar */}
      <InputField 
        label=""
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholder={t('items.itemFilterBar.placeholderSearch')}
      />

      {/* Location Selector */}
      <LocationSelector 
        locations={locations}
        selectedLocationName={selectedLocationName}
        toggleLocation={onToggleLocation}
        // style={{ marginVertical: Spacing.small }}
      />

      {/* Tag Selector */}
      <TagSelector 
        tags={tags} 
        selectedTagIds={selectedTagIds} 
        toggleTagIds={onToggleTagIds}
        onCreateTag={null}
        // style={{ marginVertical: Spacing.small }}
      />
    </View>
  );
}
