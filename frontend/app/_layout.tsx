import { useEffect } from 'react';
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
  DraftProvider,
  AppbarProvider
} from '@/hooks';
import { ModalProvider } from '@/hooks/modal/ModalContext';
import '@/i18n'; // Ensure i18n is initialized
import i18n from 'i18n';
import { I18nextProvider } from 'react-i18next';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LoadingScreen } from '@/components/common/DefaultScreen';
import { darkTheme } from '@/styles';


function InnerLayout() {
  const { token, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const isInAuthGroup = (segments[0] === '(auth)');
    const isInTabGroup = (segments[0] === '(tabs)');

    if (!token && !isInAuthGroup) {
      router.replace('/(auth)/login');
    } else if (token && !isInTabGroup) {
      router.replace('/(tabs)/me');
    }
  }, [token, loading, segments, router]);

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
            <ModalProvider>
              <AuthProvider>
                <UserProvider>
                  <FamilyProvider>
                    <MembershipProvider>
                      <TagsProvider>
                        <ItemsProvider>
                          <DraftProvider>
                            <AppbarProvider>
                              <InnerLayout />
                            </AppbarProvider>
                          </DraftProvider>
                        </ItemsProvider>
                      </TagsProvider>
                    </MembershipProvider>
                  </FamilyProvider>
                </UserProvider>
              </AuthProvider>
            </ModalProvider>
          </AlertModalProvider>
        </I18nextProvider>
      </PaperProvider>
    </>
  );
}