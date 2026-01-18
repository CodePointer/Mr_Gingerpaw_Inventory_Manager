import { View } from 'react-native';
import { Button } from 'react-native-paper';

interface ButtonGroupProps {
  buttons: { 
    label: string;
    mode: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
    icon?: string;
    onPress: () => void;
  }[];
  style: object;
}

export function ButtonGroup({ buttons, style }: ButtonGroupProps) {
  return (
    <View style={style}>
      {buttons.map((btn, index) => (
        <Button 
          key={index} 
          mode={btn.mode}
          icon={btn.icon}
          onPress={btn.onPress}
          style={{ flex: 1 }}
        >
          {btn.label}
        </Button>
      ))}
    </View>
  );
}