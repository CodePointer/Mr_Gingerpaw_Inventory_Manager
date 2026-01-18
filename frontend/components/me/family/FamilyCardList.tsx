// components/me/FamilyCardList.tsx
import React from 'react';
import { View } from 'react-native';
import { List, IconButton } from 'react-native-paper';
import { useUser, useFamily } from '@/hooks';
import { FamilyOut, UserOut } from '@/services/types';
import { useTranslation } from 'react-i18next';
import { selectedTheme } from '@/styles';


interface FamilyCardListProps {
  families?: FamilyOut[];
  currentFamilyId?: number;
  members?: UserOut[];
  onSelectFamily?: (familyId: number) => void;
  onCreateFamily: () => void;
  onEditFamily: (familyId: number) => void;
  onDeleteFamily: (familyId: number) => void;
}


export function FamilyCardList({
  families,
  currentFamilyId,
  members,
  onSelectFamily,
  onCreateFamily,
  onEditFamily,
  onDeleteFamily,
}: FamilyCardListProps) {

  const toggleFamily = (family: FamilyOut) => {
    if (currentFamilyId !== family.id) {
      onSelectFamily?.(family.id);
    }
  };
  const membersList = members?.map(member => member.username).join(', ') || '';

  return (
    <List.Section>
      {families?.map((family) => (
        <FamilyItem
          key={family.id}
          family={family}
          description={membersList}
          selected={currentFamilyId === family.id}
          onSelect={() => toggleFamily(family)}
          onEdit={() => onEditFamily(family.id)}
          onDelete={() => onDeleteFamily(family.id)}
        />
      ))}
      <FamilyCreateCard onCreateFamily={onCreateFamily} />
    </List.Section>
  );
}


interface FamilyItemProps {
  family: FamilyOut;
  description: string;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function FamilyItem({
  family,
  description,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: FamilyItemProps) {
  const backgroundColor = selected ? selectedTheme.colors.secondaryContainer : undefined;
  return (
    <List.Item
      title={family.name}
      description={description}
      left={(props) => (
        <IconButton
          {...props}
          icon="pencil"
          onPress={onEdit}
        />
      )}
      right={(props) => (
        <IconButton
          {...props}
          icon="trash-can"
          onPress={onDelete}
        />
      )}
      onPress={onSelect}
      style={{ backgroundColor }}
    />
  );
}


interface FamilyCreateCardProps {
  onCreateFamily: () => void;
}

function FamilyCreateCard({ onCreateFamily }: FamilyCreateCardProps) {
  const { t } = useTranslation(['me']);
  return (
    <List.Item
      title={t('me:family.button.createFamily')}
      left={(props) => <IconButton {...props} icon="plus" />}
      onPress={onCreateFamily}
    />
  );
}