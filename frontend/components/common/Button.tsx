import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { ReactNode } from "react";
import { Colors, Components } from "@/styles";

interface ButtonProps {
  onPress: () => void;
  children: ReactNode;
  disabled?: boolean;
  style?: object;
  textStyle?: object;
}

export default function Button({ onPress, children, disabled = false, style = {}, textStyle = {} }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[Components.button, disabled && styles.disabled, style]}
      disabled={disabled}
    >
      <Text style={[Components.buttonText, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  disabled: {
    backgroundColor: Colors.borderSoft,
  }
});
