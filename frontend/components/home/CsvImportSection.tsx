import { useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAlertModal, useDrafts, useFamily, useTags, useUser } from '@/hooks';
import { ButtonGroup } from '@/components/common/ButtonGroup';
import { SectionInfoCard } from '@/components/me/SectionInfoCard';
import { Layout, Spacing } from '@/styles';
import { TagOut } from '@/services/types';
import {
  CsvImportError,
  findMissingTagNames,
  parseItemImportCsv,
  resolveTagIds,
} from '@/services/utils/csvImport';
import {
  downloadItemImportTemplate,
  pickItemImportCsv,
} from '@/services/utils/csvFiles';

export function CsvImportSection() {
  const { t } = useTranslation(['home', 'common']);
  const { currentFamily } = useFamily();
  const { user } = useUser();
  const { tags, fetchTags, submitNewTags, isSubmittingTags } = useTags();
  const { aggregatedItems, addNewItem } = useDrafts();
  const { showModal } = useAlertModal();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatErrors = (errors: CsvImportError[]) => errors
    .slice(0, 8)
    .map((error) => {
      const prefix = error.rowNumber
        ? t('home:csvImport.errors.row', { row: error.rowNumber })
        : '';
      const message = t(`home:csvImport.errors.${error.code}`, {
        field: error.field,
        value: error.value,
      });
      return `• ${prefix}${message}`;
    })
    .concat(errors.length > 8
      ? [t('home:csvImport.errors.more', { count: errors.length - 8 })]
      : [])
    .join('\n');

  const handleDownload = async () => {
    try {
      await downloadItemImportTemplate();
    } catch (error) {
      console.error('Unable to download CSV template:', error);
      await showModal(t('home:csvImport.errors.download'));
    }
  };

  const handleUpload = async () => {
    if (isProcessing || isSubmittingTags || !currentFamily || !user) return;
    setIsProcessing(true);

    try {
      const csv = await pickItemImportCsv();
      if (csv === null) return;

      const parsed = parseItemImportCsv(csv, aggregatedItems);
      if (parsed.errors.length > 0) {
        await showModal(`${t('home:csvImport.errors.title')}\n\n${formatErrors(parsed.errors)}`);
        return;
      }

      const missingTagNames = findMissingTagNames(parsed.items, tags);
      const tagList = missingTagNames.length > 0
        ? missingTagNames.map((name) => `• ${name}`).join('\n')
        : t('home:csvImport.confirm.none');
      const confirmed = await showModal(t('home:csvImport.confirm.message', {
        count: parsed.items.length,
        tags: tagList,
      }), false);
      if (!confirmed) return;

      const tempTags: TagOut[] = missingTagNames.map((name, index) => ({
        id: `tmpId-csv-tag-${Date.now()}-${index}`,
        name,
        familyId: currentFamily.id,
      }));

      let resolvedTags = [...tags];
      if (tempTags.length > 0) {
        const response = await submitNewTags(tempTags);
        const createdByTempId = new Map(
          response.success.map((status) => [status.tagId, status.createdTagId])
        );
        const createdTags = tempTags.flatMap((tag) => {
          const createdId = createdByTempId.get(tag.id);
          return createdId ? [{ ...tag, id: createdId }] : [];
        });

        if (response.failed.length > 0 || createdTags.length !== tempTags.length) {
          await fetchTags();
          await showModal(t('home:csvImport.errors.tags'));
          return;
        }
        resolvedTags = [...resolvedTags, ...createdTags];
        await fetchTags();
      }

      const importId = Date.now();
      parsed.items.forEach((item, index) => {
        const tagIds = resolveTagIds(item.tagNames, resolvedTags);
        const itemTags = resolvedTags.filter((tag) => tagIds.includes(tag.id));
        addNewItem({
          id: `tmpId-csv-item-${importId}-${index}`,
          name: item.name,
          unit: item.unit,
          quantity: item.quantity,
          location: item.location,
          familyId: currentFamily.id,
          ownerId: user.id,
          tagIds,
          tags: itemTags,
          notes: item.notes,
        });
      });

      await showModal(t('home:csvImport.success', { count: parsed.items.length }));
    } catch (error) {
      console.error('Unable to import CSV:', error);
      await showModal(t('home:csvImport.errors.read'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SectionInfoCard title={t('home:csvImport.title')}>
      <View style={[Layout.column, { gap: Spacing.small, paddingHorizontal: Spacing.medium }]}>
        <Text variant="bodyMedium">{t('home:csvImport.description')}</Text>
        <ButtonGroup
          buttons={[
            {
              label: t('home:csvImport.actions.download'),
              mode: 'outlined',
              icon: 'download',
              onPress: handleDownload,
              disabled: isProcessing || isSubmittingTags,
            },
            {
              label: t('home:csvImport.actions.upload'),
              mode: 'contained',
              icon: 'upload',
              onPress: handleUpload,
              loading: isProcessing,
              disabled: isProcessing || isSubmittingTags,
            },
          ]}
          style={[Layout.column, { gap: Spacing.small }]}
        />
      </View>
    </SectionInfoCard>
  );
}
