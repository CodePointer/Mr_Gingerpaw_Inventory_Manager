import { useEffect } from 'react';
import { useUser, useFamily } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { FamilyCardList } from './FamilyCardList';
import { SectionInfoCard } from '../SectionInfoCard';
import { useModal } from '@/hooks/modal/useModal';


export function FamilyManager() {
  const { t } = useTranslation(['me']);
  const { families } = useUser();
  const { currentFamily, members, selectFamily, createFamily, updateFamily, deleteFamily } = useFamily();
  const { open } = useModal();

  useEffect(() => {
    if (!currentFamily && families.length > 0) {
      selectFamily(families[0]);
    }
  }, [currentFamily, families, selectFamily]);

  const handleSelect = async (familyId: number) => {
    const family = families.find((f) => f.id === familyId);
    if (!family) return;
    await selectFamily(family);
  };

  const openFamilyEditor = (mode: 'create' | 'edit' | 'delete') => {
    const defaultInfo = mode === 'create'
      ? { name: '', notes: '' }
      : {
          name: currentFamily?.name ?? '',
          notes: currentFamily?.notes ?? '',
        };

    open('FamilyInfoEdit', {
      mode,
      defaultInfo,
      onDone: async (newName: string, newNotes: string) => {
        try {
          if (mode === 'create') {
            if (newName === '') return;
            await createFamily({ name: newName, notes: newNotes });
            return;
          }

          if (!currentFamily) return;
          if (mode === 'edit') {
            await updateFamily({ name: newName, notes: newNotes });
          } else {
            await deleteFamily();
          }
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  return (
    <SectionInfoCard title={t('me:family.managerTitle')}>
      <FamilyCardList
        families={families}
        currentFamilyId={currentFamily?.id}
        members={members}
        onSelectFamily={handleSelect}
        onCreateFamily={() => openFamilyEditor('create')}
        onEditFamily={() => openFamilyEditor('edit')}
        onDeleteFamily={() => openFamilyEditor('delete')}
      />
    </SectionInfoCard>
  );
}
