// components/items/ItemFilterBar.tsx
import { View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Searchbar, Badge, IconButton } from 'react-native-paper';
import { ViewComponents } from '@/styles';
import { useEffect, useState } from 'react';


interface ItemFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  // itemCreate: () => void;
  // tagEdit: () => void;
  // locations: LocationOut[];
  selectedLocationName: string | null;
  // onToggleLocation: (loc: string) => void;
  // tags: TagOut[];
  selectedTagIds: Set<string>;
  // onToggleTagIds: (tagId: string) => void;
  onFilterPress: () => void;
  style?: ViewStyle | ViewStyle[];
}


export function ItemFilterBar({
  searchQuery,
  onSearchChange,
  selectedLocationName,
  selectedTagIds,
  onFilterPress,
  style = {}
}: ItemFilterBarProps) {
  const { t } = useTranslation(['items']);
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
            onPress={onFilterPress}
          />
          <Badge style={{ position: 'absolute', top: 0, right: 0 }} visible={filteredNumber > 0}>
            {filteredNumber}
          </Badge>
        </View>
      </View>
    </View>
  );
}
