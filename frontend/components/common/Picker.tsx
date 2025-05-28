// components/common/RolePicker.tsx
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Picker, PickerProps } from "@react-native-picker/picker";
import { Colors } from "@/styles";

interface RolePickerProps extends Omit<PickerProps, "style"> {
  label?: string;
  style?: any;
}

export default function MyPicker({ label, style, ...pickerProps }: RolePickerProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Picker
        style={[styles.picker, style]}
        {...pickerProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
    color: Colors.textDark,
    fontWeight: "500",
  },
  picker: {
    backgroundColor: Colors.backgroundLight,
    borderColor: Colors.borderSoft,
    borderWidth: 1,
    borderRadius: 6,
  },
});
