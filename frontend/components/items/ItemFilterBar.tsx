// components/items/ItemFilterBar.tsx
import { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  ScrollView,
  TextStyle
} from "react-native";
import { useTags, useItems, useFamily } from "@/hooks";
import { useTranslation } from "react-i18next";
import { TagSelector } from "@/components/common/TagSelector";
import { LocationSelector } from "@/components/common/LocationSelector";
import { LocationOut, TagOut } from "@/services/types"
import { Colors, Components } from "@/styles";


interface ItemFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  locations: LocationOut[];
  selectedLocationName: string | null;
  onToggleLocation: (loc: string) => void;
  tags: TagOut[];
  selectedTagIds: Set<number>;
  onToggleTagIds: (tagId: number) => void;
}


export function ItemFilterBar({
  searchQuery,
  onSearchChange,
  locations,
  selectedLocationName,
  onToggleLocation,
  tags,
  selectedTagIds,
  onToggleTagIds
}: ItemFilterBarProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={[
          Components.inputBox as TextStyle,
          { marginBottom: 12 }
        ]}
        placeholder={t('items.itemFilterBar.placeholderSearch')}
        value={searchQuery}
        onChangeText={onSearchChange}
      />

      {/* Location Selector */}
      <LocationSelector 
        locations={locations}
        selectedLocationName={selectedLocationName}
        toggleLocation={onToggleLocation}
      />

      {/* Tag Selector */}
      <TagSelector 
        tags={tags} 
        selectedTagIds={selectedTagIds} 
        toggleTagIds={onToggleTagIds} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: Colors.backgroundLight,
    // borderBottomWidth: 1,
    borderColor: Colors.borderSoft,
  },
  searchInput: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
  }
});
