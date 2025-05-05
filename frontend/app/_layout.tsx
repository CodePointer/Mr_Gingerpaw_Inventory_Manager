import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';
import { FamilyProvider } from '@/hooks/useFamily';

function InnerLayout() {
  const { authState } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (segments?.[0] === undefined) return;
  
    setTimeout(() => {
      const inAuthGroup = segments[0] === '(tabs)';
      if (!authState.token && inAuthGroup) {
        router.replace('/login');
      } else if (authState.token && !inAuthGroup) {
        router.replace('/(tabs)/items');
      }
    }, 50);
  }, [authState.token, segments]);
  

  // useEffect(() => {
  //   if (segments?.[0] === undefined || !router.canGoBack()) return;

  //   const inAuthGroup = segments[0] === '(tabs)';
  //   if (!authState.token && inAuthGroup) {
  //     router.replace('/login');
  //   } else if (authState.token && !inAuthGroup) {
  //     // router.replace('/(tabs)/items');
  //     router.replace('/login')
  //   }
  // }, [authState.token, segments]);

  if (authState.loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <FamilyProvider>
        <InnerLayout />
      </FamilyProvider>
    </AuthProvider>
  );
}