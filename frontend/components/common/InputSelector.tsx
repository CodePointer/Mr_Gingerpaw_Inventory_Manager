import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Colors, Layout, TextComponents, ViewComponents } from '@/styles';

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
  placeholder = 'Input here',
  placeholderTextColor = Colors.textMuted,
  presets = ['3', '7', '15', '30'],
}: InputSelectorProps) {
  const [editing, setEditing] = useState(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSelection = (selectedText: string) => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    onChange(selectedText);
    setEditing(false);
  }

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setEditing(false);
      blurTimeoutRef.current = null;
    }, 100); // Delay to allow selection to register
  }

  const handleFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setEditing(true);
  }

  return (
    <View style={[Layout.column, style]}>
      <View style={Layout.row}>
        {label && <Text style={TextComponents.inputLabel}>{label}</Text>}
        <TextInput
          style={TextComponents.inputBox as TextStyle}
          keyboardType='numeric'
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          onChangeText={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </View>
      {editing && (
        <View style={Layout.rowWrap}>
          {presets.map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => handleSelection(p)}
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
