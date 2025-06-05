import { ReactNode } from 'react';
import { View, Text, TextStyle, ViewStyle } from 'react-native';

interface TextWithViewProps {
  children: ReactNode;
  textStyle?: TextStyle | TextStyle[];
  viewStyle?: ViewStyle | ViewStyle[];
}

export function TextWithView({ children, textStyle = {}, viewStyle = {} }: TextWithViewProps) {
  return (
    <View style={viewStyle}>
      <Text style={textStyle}>{children}</Text>
    </View>
  );
}