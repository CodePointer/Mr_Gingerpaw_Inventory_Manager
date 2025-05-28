import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks';
import Button from '@/components/common/Button';
import { Layout, Typography, Spacing } from '@/styles';

const DEFAULT_EMAIL = 'alice@example.com';
const DEFAULT_PASSWORD = 'password123';


export default function LoginScreen() {

  return (
    <View style={[Layout.center, styles.container]}>
      <Text style={Typography.title}>家庭库存管理登录</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
      width: '80%',
  },
  input: {
      width: '100%',
      backgroundColor: '#ffffff',
      borderColor: '#cccccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 15,
      fontSize: 16,
      color: '#333333',
      marginVertical: Spacing.small,
  },
  button: {
      marginTop: Spacing.medium,
      width: '100%',
  },
});
