import { View, ScrollView, ViewStyle } from "react-native";
import { Chip } from 'react-native-paper';
import { LocationOut } from "@/services/types";
import { Colors, Layout, ViewComponents, TextComponents, Spacing } from "@/styles";

interface LocationSelectorProps {
  locations: LocationOut[];
  selectedLocationName: string | null;
  toggleLocation: (locationName: string) => void;
  style?: ViewStyle | ViewStyle[];
}

export function LocationSelector({ 
  locations, 
  selectedLocationName, 
  toggleLocation,
  style,
}: LocationSelectorProps) {

  // const getBackgroundColor = (locName: string) => {
  //   return selectedLocationName == locName ? Colors.primary : Colors.borderSoft;
  // }

  return (
    <View style={[ViewComponents.tagsContainer, style]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: Spacing.small }}
      >
        {locations.map((loc) => (
          <Chip
            key={loc.locationName}
            onPress={() => toggleLocation(loc.locationName)}
            selected={selectedLocationName === loc.locationName}
            showSelectedCheck={false}
            showSelectedOverlay={true}
          >
            {loc.locationName}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
}
