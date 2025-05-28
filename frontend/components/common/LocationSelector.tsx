import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { LocationOut } from "@/services/types";
import { Colors } from "@/styles";

interface LocationSelectorProps {
  locations: LocationOut[];
  selectedLocationName: string | null;
  toggleLocation: (locationName: string) => void;
}

export function LocationSelector({ locations, selectedLocationName, toggleLocation }: LocationSelectorProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {locations.map((loc) => (
          <TouchableOpacity
            key={loc.locationName}
            onPress={() => toggleLocation(loc.locationName)}
            style={[
              styles.tag,
              selectedLocationName == loc.locationName ? styles.selectedTag : styles.unselectedTag,
            ]}
          >
            <Text style={styles.tagText}>{loc.locationName} ({loc.itemCount})</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // flexWrap: "wrap",
    // marginVertical: 10,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    // borderRadius: 20,
    margin: 1,
  },
  selectedTag: {
    backgroundColor: Colors.primary,
  },
  unselectedTag: {
    backgroundColor: Colors.borderSoft,
  },
  tagText: {
    color: Colors.white,
    fontWeight: "500",
  },
});
