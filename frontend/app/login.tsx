import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { sharedStyles } from '@/styles/shared';
import api from '@/utils/api';

// const API_BASE = 'http://192.168.1.112:8000'; // TODO: Env.

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('请输入用户名和密码');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(`/users/login`, {
        email,
        password,
      });

      const token = response.data.access_token;
      const username = email.split('@')[0];

      login({ username, token });
      router.replace('/select-family');
    } catch (error: any) {
      console.error(error);
      Alert.alert('登录失败', error?.response?.data?.detail || '请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[sharedStyles.container, { justifyContent: 'center' }]}>
      <Text style={sharedStyles.title}>家庭库存管理登录</Text>

      <TextInput
        style={sharedStyles.input}
        placeholder="邮箱"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={sharedStyles.input}
        placeholder="密码"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title={loading ? '登录中...' : '登录'} onPress={handleLogin} disabled={loading} />
    </View>
  );
}
