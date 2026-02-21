import { View, ViewStyle } from "react-native";
import { LocationOut } from "@/services/types";
import { ViewComponents } from "@/styles";
import { SelectableChip } from './SelectableChip';

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
      {locations.map((loc) => (
        <SelectableChip
          key={loc.locationName}
          onPress={() => toggleLocation(loc.locationName)}
          selected={selectedLocationName === loc.locationName}
        >
          {loc.locationName}
        </SelectableChip>
      ))}
    </View>
  );
}
