// app/(auth)/_layout.tsx
import { View } from 'react-native';
import { Slot } from 'expo-router';

export default function AuthLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Slot />
    </View>
  );
}