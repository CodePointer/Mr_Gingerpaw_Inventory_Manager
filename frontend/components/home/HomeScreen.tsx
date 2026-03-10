// components/home/HomeScreen.tsx
import { ScrollView, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useDrafts, useFamily, useUser } from '@/hooks';
import { LoadingScreen, NoFamilyScreen } from '@/components/common/DefaultScreen';
import { ViewComponents, Layout, Spacing } from '@/styles';
import { useAppbar } from '@/hooks';
import { AIDraftFormModalValues } from '@/services/types/aidraftTypes';
import { useEffect } from 'react';
import { SectionInfoCard } from '@/components/me/SectionInfoCard';
import { ButtonGroup } from '@/components/common/ButtonGroup';
import { useModal } from '@/hooks/modal/useModal';


export function HomeScreen() {
  const { currentFamily } = useFamily();
  const { user } = useUser();
  const { isGenerating, generateAiDraft } = useDrafts();
  const { t } = useTranslation(['home', 'common']);
  const { registerPageActions, unregisterPageActions } = useAppbar();
  const { open } = useModal();

  useEffect(() => {
    registerPageActions('home', []);
    return () => {
      unregisterPageActions('home');
    };
  }, [registerPageActions, unregisterPageActions]);

  const openAIDraftModal = (queryType: string, label: string) => {
    open('AIDraftForm', {
      queryType,
      queryId: `ai-${queryType}-${Date.now()}`,
      label,
      onSubmit: (draft: AIDraftFormModalValues) => {
        generateAiDraft({
          queryId: draft.queryId,
          queryType: draft.queryType,
          queries: draft.queries,
          familyId: currentFamily?.id ?? -1
        }).catch((error) => {
          console.error('Error generating AI draft:', error);
        });
      }
    });
  };

  const boughtLabel = t('home:aimanager.bought', { defaultValue: 'I bought something...' });
  const consumedLabel = t('home:aimanager.consumed', { defaultValue: "I've consumed something..." });
  const historyLabel = t('home:aimanager.history', { defaultValue: 'Conversation History' });

  if (!currentFamily) return <NoFamilyScreen />;
  if (isGenerating) return <LoadingScreen />;

  return (
    <ScrollView style={ViewComponents.background}>
      <View style={ViewComponents.screen}>
        {/* Greeting Header */}
        <Text variant="headlineLarge" style={{ marginBottom: Spacing.medium }}>
          {t('home:greeting', { name: user?.username || 'User', defaultValue: `Hello, ${user?.username || 'User'}!` })}
        </Text>

        {/* Notifications Section */}
        <SectionInfoCard title={t('home:notifications.title', { defaultValue: 'Notifications' })}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: Spacing.medium }}>
            <View style={[Layout.row, { gap: Spacing.small, paddingHorizontal: Spacing.medium }]}>
              <NotificationCard
                title={t('home:notifications.welcome.title', { defaultValue: 'Welcome!' })}
                text={t('home:notifications.welcome.text', { defaultValue: 'Start managing your items with AI assistance.' })}
                onPress={() => {}}
              />
              <NotificationCard
                title={t('home:notifications.tip.title', { defaultValue: 'Tip' })}
                text={t('home:notifications.tip.text', { defaultValue: 'Use the AI Manager to quickly add or consume items.' })}
              />
              <NotificationCard
                title={t('home:notifications.reminder.title', { defaultValue: 'Reminder' })}
                text={t('home:notifications.reminder.text', { defaultValue: 'Check your items regularly to keep track of inventory.' })}
              />
            </View>
          </ScrollView>
        </SectionInfoCard>

        {/* AI Manager Section */}
        <SectionInfoCard title={t('home:aimanager.title', { defaultValue: 'AI Manager' })}>
          <ButtonGroup
            buttons={[
              {
                label: boughtLabel,
                mode: 'outlined',
                icon: 'cart-plus',
                onPress: () => openAIDraftModal('bought', boughtLabel),
              },
              {
                label: consumedLabel,
                mode: 'outlined',
                icon: 'cart-remove',
                onPress: () => openAIDraftModal('consumed', consumedLabel),
              },
              {
                label: historyLabel,
                mode: 'outlined',
                icon: 'history',
                onPress: () => {
                  console.log('Open conversation history');
                },
              },
            ]}
            style={[Layout.column, { gap: Spacing.small }]}
          />
        </SectionInfoCard>
      </View>
    </ScrollView>
  );
}

interface NotificationCardProps {
  title: string;
  text: string;
  onPress?: () => void;
}

function NotificationCard({ title, text, onPress }: NotificationCardProps) {
  return (
    <Card
      mode="elevated"
      style={{
        minWidth: 200,
        maxWidth: 300,
        minHeight: 200,
        padding: Spacing.small
      }}
      contentStyle={{ justifyContent: 'space-between', flex: 1 }}
    >
      <Card.Title title={title} />
      <Card.Content style={{ flex: 1 }}>
        <Text variant="bodyMedium">{text}</Text>
      </Card.Content>
      <Card.Actions>
        {onPress ? <Button onPress={onPress}>Learn more</Button> : null}
      </Card.Actions>
    </Card>
  );
}
