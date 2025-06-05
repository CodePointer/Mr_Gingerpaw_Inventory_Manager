import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions, TextStyle } from "react-native";
import { Layout, Colors, Components, ViewComponents, TextComponents } from "@/styles";

interface InputFieldProps {
  label: string; // 标签
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean; // 是否多行
  placeholder?: string;
  style?: object;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean; // 是否可编辑
  placeholderTextColor?: string;
  secureTextEntry?: boolean;
}

export function InputField({
  label = '',
  value,
  onChangeText,
  multiline = false,
  placeholder = "Input here",
  style = {},
  keyboardType = "default",
  editable = true,
  placeholderTextColor = Colors.textMuted,
  secureTextEntry = false
}: InputFieldProps) {

  return (
    <View style={[Layout.row, style]}>
      {label !== "" && (
        <Text style={TextComponents.inputLabel}>
          {label}
        </Text>
      )}

      <TextInput
        style={[
          TextComponents.inputBox,
          !editable && { backgroundColor: Colors.deleted },
        ]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        editable={editable}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical="top"
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}
