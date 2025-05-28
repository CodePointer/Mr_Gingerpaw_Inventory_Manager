import { View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import {
  AuthProvider,
  useAuth,
  FamilyProvider,
  MembershipProvider,
  UserProvider,
  TagsProvider,
  ItemsProvider,
  DraftProvider
} from '@/hooks';
import { Colors, Layout } from '@/styles';
import '@/i18n'; // Ensure i18n is initialized
import i18n from 'i18n';
import { I18nextProvider } from 'react-i18next';


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
    }

    if (token && !isInAuthGroup) {
      // console.log("🏠 Redirecting to /me");
      router.replace('/(tabs)/me');
      setHasRedirect(true);
    }
  }, [token, loading, segments]);

  if (loading) {
    console.log("🕑 Loadding InnerLayout...");
    return (
      <View style={Layout.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <>
      <I18nextProvider i18n={i18n}>
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
      </I18nextProvider>
    </>

  );
}