import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ViewStyle, TextComponent } from "react-native";
import { LocationOut } from "@/services/types";
import { Colors, Layout, ViewComponents, TextComponents } from "@/styles";

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

  const getBackgroundColor = (locName: string) => {
    return selectedLocationName == locName ? Colors.primary : Colors.borderSoft;
  }

  return (
    <View style={[Layout.row, style]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {locations.map((loc) => (
            <TouchableOpacity
              key={loc.locationName}
              onPress={() => toggleLocation(loc.locationName)}
              style={[
                ViewComponents.location,
                { backgroundColor: getBackgroundColor(loc.locationName) },
              ]}
            >
              <Text style={TextComponents.tagText}>{loc.locationName} ({loc.itemCount})</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
}
