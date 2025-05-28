import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Layout, Colors, Components, Typography } from "@/styles";

interface InputSelectorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
  presets?: string[]; // e.g. ['7', '15', '30']
}

export default function InputSelector({
  value,
  onChange,
  label,
  placeholder = "Input here",
  presets = ["3", "7", "15", "30"],
}: InputSelectorProps) {
  const [editing, setEditing] = useState(false);

  return (
    <View style={Layout.column}>
      <View style={[Layout.row, { paddingVertical: 8, alignItems: "center"}]}>
        {label && <Text style={[
          Components.inputLabel as TextStyle,
          { width: 80 }
        ]}>{label}</Text>}
        <TextInput
          style={Components.inputBox as TextStyle}
          keyboardType="numeric"
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          onFocus={() => setEditing(true)}
        />
      </View>
      {editing && (
        <View style={Layout.wrap}>
          {presets.map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => { onChange(p); setEditing(false); }}
              style={[Components.tag as ViewStyle]}
            >
              <Text style={[Components.tagText as TextStyle]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
