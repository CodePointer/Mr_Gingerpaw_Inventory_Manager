import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Colors, Layout, TextComponents, ViewComponents } from "@/styles";

interface InputSelectorProps {
  value: string;
  onChange: (val: string) => void;
  style?: ViewStyle;
  label?: string;
  placeholder?: string;
  placeholderTextColor?: string;
  presets?: string[]; // e.g. ['7', '15', '30']
}

export default function InputSelector({
  value,
  onChange,
  style,
  label,
  placeholder = "Input here",
  placeholderTextColor = Colors.textMuted,
  presets = ["3", "7", "15", "30"],
}: InputSelectorProps) {
  const [editing, setEditing] = useState(false);

  return (
    <View style={[Layout.column, style]}>
      <View style={Layout.row}>
        {label && <Text style={TextComponents.inputLabel}>{label}</Text>}
        <TextInput
          style={TextComponents.inputBox as TextStyle}
          keyboardType="numeric"
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          onChangeText={onChange}
          onFocus={() => setEditing(true)}
          onBlur={() => setEditing(false)}
        />
      </View>
      {editing && (
        <View style={Layout.rowWrap}>
          {presets.map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => { onChange(p); setEditing(false); }}
              style={[ViewComponents.tag]}
            >
              <Text style={[TextComponents.tagText as TextStyle]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
