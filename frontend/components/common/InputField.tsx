import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions, TextStyle } from "react-native";
import { Colors, Components } from "@/styles";

interface InputFieldProps {
  label: string; // 标签
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: object;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean; // 是否可编辑
  placeholderTextColor?: string;
}

export function InputField({
  label,
  value,
  onChangeText,
  placeholder = "Input here",
  style = {},
  keyboardType = "default",
  editable = true,
  placeholderTextColor = Colors.textMuted,
}: InputFieldProps) {
  return (
    <View style={styles.container}>
      {label !== "" && (
        <Text style={[Components.inputLabel as TextStyle, styles.label]}>
          {label}
        </Text>
      )}

      <TextInput
        style={[
          Components.inputBox,
          style,
          !editable && styles.inputDisabled,
        ]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        editable={editable}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  label: {
    width: 80
  },
  inputDisabled: {
    backgroundColor: Colors.deleted, // 浅灰色背景
  },
});
