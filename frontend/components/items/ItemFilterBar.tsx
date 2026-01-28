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
import { Searchbar, Badge, IconButton } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

import { LocationSelector } from "@/components/common/LocationSelector";
import { LocationOut, TagOut } from "@/services/types"
import { Colors, Components, ViewComponents, TextComponents, Layout, Spacing } from "@/styles";
import { TagSelector } from "@/components/tags/TagSelector";
import { InputField } from "../common/InputField";
import { useEffect, useState } from "react";


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
  const [filteredNumber, setFilteredNumber] = useState<number>(0);
  useEffect(() => {
    setFilteredNumber(selectedTagIds.size + (selectedLocationName ? 1 : 0));
  }, [selectedLocationName, selectedTagIds]);

  return (
    <View style={[ViewComponents.itemFilterBarContainer, style]}>
      <View style={[ViewComponents.rowButtons, { alignItems: 'center' }]}>
        {/* Search Bar */}
        <View style={{ flex: 1 }}>
          <Searchbar
            placeholder={t('items:itemFilterBar')}
            onChangeText={onSearchChange}
            mode="bar"
            value={searchQuery}
            icon="magnify"
            clearIcon="close-circle-outline"
          />
        </View>

        <View style={{ position: 'relative' }}>
          <IconButton
            icon="filter-outline"
            onPress={() => {}}
          />
          <Badge style={{ position: 'absolute', top: 0, right: 0 }} visible={filteredNumber > 0}>
            {filteredNumber}
          </Badge>
        </View>
      </View>
      

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
      {/* <LocationSelector 
        locations={locations}
        selectedLocationName={selectedLocationName}
        toggleLocation={onToggleLocation}
      /> */}

      {/* Tag Selector */}
      {/* <TagSelector 
        tags={tags} 
        selectedTagIds={selectedTagIds} 
        toggleTagIds={onToggleTagIds}
        onCreateTag={tagEdit}
      /> */}
    </View>
  );
}
