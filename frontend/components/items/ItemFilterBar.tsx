// components/items/ItemFilterBar.tsx
import {
  View,
  StyleSheet,
  TextInput,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Feather } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";
import { Searchbar, Chip } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

import { LocationSelector } from "@/components/common/LocationSelector";
import { LocationOut, TagOut } from "@/services/types"
import { Colors, Components, ViewComponents, TextComponents, Layout, Spacing } from "@/styles";
import { TagSelector } from "@/components/tags/TagSelector";
import { InputField } from "../common/InputField";


interface ItemFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  itemCreate: () => void;
  tagEdit: () => void;
  locations: LocationOut[];
  selectedLocationName: string | null;
  onToggleLocation: (loc: string) => void;
  tags: TagOut[];
  selectedTagIds: Set<string>;
  onToggleTagIds: (tagId: string) => void;
  style?: ViewStyle | ViewStyle[];
}


export function ItemFilterBar({
  searchQuery,
  onSearchChange,
  itemCreate,
  tagEdit,
  locations,
  selectedLocationName,
  onToggleLocation,
  tags,
  selectedTagIds,
  onToggleTagIds,
  style = {}
}: ItemFilterBarProps) {
  const { t } = useTranslation(['items']);
  const theme = useTheme();
  return (
    <View style={[Layout.column, style]}>
      {/* Search Bar */}
      <Searchbar
        placeholder={t('items:itemFilterBar')}
        onChangeText={onSearchChange}
        value={searchQuery}
        icon="magnify"
      />

      {/* <View style={Layout.row}>
        <InputField 
          label=""
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder={t('items:itemFilterBar')}
          style={{ flex: 1 }}
        />
        <TouchableOpacity style={ViewComponents.touchableIcon} onPress={itemCreate}>
          <Feather name={'plus-square'} onPress={itemCreate} size={20}/>
        </TouchableOpacity>
      </View> */}

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
        onCreateTag={tagEdit}
        // style={{ marginVertical: Spacing.small }}
      />
    </View>
  );
}
