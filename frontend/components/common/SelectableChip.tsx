import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Chip } from 'react-native-paper';


interface SelectableChipProps {
  selected?: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  icon?: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function SelectableChip({
  selected = false,
  onPress,
  onLongPress,
  icon,
  style,
  children,
}: SelectableChipProps) {
  return (
    <Chip
      mode="outlined"
      selected={selected}
      showSelectedCheck={false}
      showSelectedOverlay={true}
      onPress={onPress}
      onLongPress={onLongPress}
      icon={icon}
      style={style}
    >
      {children}
    </Chip>
  );
}
