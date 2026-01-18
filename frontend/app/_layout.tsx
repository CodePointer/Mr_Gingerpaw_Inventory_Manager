import { View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import {
  AlertModalProvider,
  AuthProvider,
  useAuth,
  FamilyProvider,
  MembershipProvider,
  UserProvider,
  TagsProvider,
  ItemsProvider,
  DraftProvider
} from '@/hooks';
import '@/i18n'; // Ensure i18n is initialized
import i18n from 'i18n';
import { I18nextProvider } from 'react-i18next';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LoadingScreen } from '@/components/common/DefaultScreen';
import { lightTheme, darkTheme } from '@/styles';


function InnerLayout() {
  const { token, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [hasRedirect, setHasRedirect] = useState(false);

  useEffect(() => {
    if (loading || hasRedirect) return;

    const isInAuthGroup = (segments[0] === '(auth)');
    const isInTabGroup = (segments[0] === '(tabs)');

    if (!token && isInTabGroup) {
      // console.log("🚪 Redirecting to /login");
      router.replace('/(auth)/login');
      setHasRedirect(true);
    } else if (token && !isInAuthGroup) {
      // console.log("🏠 Redirecting to /me");
      router.replace('/(tabs)/me');
      // router.replace('/(auth)/login');
      setHasRedirect(true);
    }
  }, [token, loading, segments]);

  if (loading) return (<LoadingScreen />);

  return <Slot />;
}


function setupIcons(props: any) {
  return (
    <MaterialCommunityIcons {...props} />
  )
}


export default function RootLayout() {
  return (
    <>
      <PaperProvider theme={darkTheme} settings={{ icon: setupIcons }}>
        <I18nextProvider i18n={i18n}>
          <AlertModalProvider>
            <AuthProvider>
              <UserProvider>
                <FamilyProvider>
                  <MembershipProvider>
                    <TagsProvider>
                      <ItemsProvider>
                        <DraftProvider>
                          <InnerLayout />
                        </DraftProvider>
                      </ItemsProvider>
                    </TagsProvider>
                  </MembershipProvider>
                </FamilyProvider>
              </UserProvider>
            </AuthProvider>
          </AlertModalProvider>
        </I18nextProvider>
      </PaperProvider>
    </>
  );
}