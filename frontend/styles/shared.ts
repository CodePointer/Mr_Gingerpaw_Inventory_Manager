// styles/shared.ts

import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.backgroundLight,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 16,
  },
  input: {
    height: 44,
    borderColor: Colors.borderSoft,
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: Colors.white,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: Colors.textMuted,
  },
});



// <Tabs
//   initialRouteName="items"
//   screenOptions={{
//     tabBarStyle: {
//       backgroundColor: '#fff3e6', // 🧡 橘猫色
//       borderTopColor: '#ffcc99', // 淡橘分割线
//     },
//     tabBarActiveTintColor: '#e67e00', // 激活图标颜色
//     tabBarInactiveTintColor: '#aaa',
//     headerShown: false, // 若你希望隐藏顶部标题栏
//   }}
// >

