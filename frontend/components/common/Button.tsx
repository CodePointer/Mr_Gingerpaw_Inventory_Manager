import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { ReactNode } from "react";
import { Colors, Layout, Components, ViewComponents, TextComponents } from "@/styles";

interface ButtonProps {
  onPress: () => void;
  children: ReactNode;
  disabled?: boolean;
  style?: object;
  textStyle?: object;
}

export default function Button({ onPress, children, disabled = false, style = {}, textStyle = {} }: ButtonProps) {

  const getBackgroundColor = () => {
    if (disabled) {
      return Colors.borderSoft;
    } else {
      return Colors.primary;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[Layout.center, ViewComponents.button, { backgroundColor: getBackgroundColor() }, style]}
      disabled={disabled}
    >
      <Text style={[TextComponents.buttonText, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}
