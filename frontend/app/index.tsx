import { Redirect } from 'expo-router';
import { LoadingScreen } from '@/components/common/DefaultScreen';
import { useAuth } from '@/hooks';


export default function Index() {
  const { token, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return <Redirect href={token ? '/(tabs)/items' : '/(auth)/login'} />;
}
