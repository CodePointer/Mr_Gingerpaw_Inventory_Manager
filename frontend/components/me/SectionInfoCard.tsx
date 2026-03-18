// components/common/BasicSectionCard.tsx
import { ViewComponents, Spacing } from '@/styles';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

interface SectionInfoCardProps {
  title: string;
  children: React.ReactNode;
}

export function SectionInfoCard({ title, children }: SectionInfoCardProps) {
  return (
    <View style={ViewComponents.sectionInfoCard}>
      <View>
        <Text variant="titleLarge">{title}</Text>
      </View>
      <View style={{ paddingHorizontal: Spacing.medium }}>
        {children}
      </View>
    </View>
  );
}