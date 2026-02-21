import { useState, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Searchbar, TextInput, Button, Text, useTheme, Portal, Dialog } from 'react-native-paper';
import { CustomModal } from '@/components/common/CustomModal';
import { Layout, ViewComponents, Spacing } from '@/styles';
import { ItemOut, TagOut } from '@/services/types';
import { SelectableChip } from '@/components/common/SelectableChip';


interface TagEditModalProps {
  visible: boolean;
  baseTags: TagOut[];
  allItems: ItemOut[];
  onCancel: () => void;
  onSubmit: (deletedTagsId: string[], updatedTags: TagOut[], newTags: TagOut[]) => void;
}

export function TagEditModal({
  visible,
  baseTags,
  allItems,
  onCancel,
  onSubmit
}: TagEditModalProps) {
  const { t } = useTranslation(['items', 'common']);
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<TagOut | null>(null);
  const [dialogMode, setDialogMode] = useState<'edit' | 'create' | null>(null);
  const [tagName, setTagName] = useState('');
  const [newTags, setNewTags] = useState<TagOut[]>([]);
  const [updatedTags, setUpdatedTags] = useState<TagOut[]>([]);
  const [deletedTagsId, setDeletedTagsId] = useState<string[]>([]);

  const allTags = useMemo(() => 
    [...baseTags.filter(t => !updatedTags.some(ut => ut.id === t.id)), ...newTags, ...updatedTags],
    [baseTags, newTags, updatedTags]
  );

  const tagCounts = useMemo(() => {
    const map = new Map<string, number>();
    allItems.forEach(item => 
      item.tags?.forEach(tag => map.set(tag.id.toString(), (map.get(tag.id.toString()) ?? 0) + 1))
    );
    return map;
  }, [allItems]);

  const filteredTags = useMemo(() => 
    allTags.filter(tag => !searchQuery || tag.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [allTags, searchQuery]
  );

  const getStatus = (tag: TagOut) => 
    newTags.some(nt => nt.id === tag.id) ? 'new' :
    deletedTagsId.includes(tag.id) ? 'deleted' :
    updatedTags.some(ut => ut.id === tag.id) ? 'modified' : 'base';

  const getChipStyle = (status: string) => ({
    backgroundColor: status === 'new' ? theme.colors.secondaryContainer :
                     status === 'modified' ? theme.colors.primaryContainer :
                     status === 'deleted' ? theme.colors.errorContainer : undefined,
    opacity: status === 'deleted' ? 0.5 : 1
  });

  const getChipIcon = (status: string) => {
    if (status === 'deleted') return 'restore';
    if (status === 'modified') return 'update';
    if (status === 'new') return 'tag-plus';
    return undefined;
  };

  const openDialog = (tag: TagOut | null) => {
    setSelectedTag(tag);
    setTagName(tag?.name || '');
    setDialogMode(tag ? 'edit' : 'create');
  };

  const closeDialog = () => {
    setSelectedTag(null);
    setTagName('');
    setDialogMode(null);
  };

  const handleSave = () => {
    if (!tagName.trim()) return;
    
    if (dialogMode === 'create') {
      // Create new tag
      setNewTags([...newTags, { id: `tmpId-${Date.now()}`, name: tagName.trim() }]);
    } else if (selectedTag) {
      // Update existing tag
      const { id } = selectedTag;
      if (id.startsWith('tmpId-')) {
        setNewTags(newTags.map(t => t.id === id ? { ...t, name: tagName.trim() } : t));
      } else {
        const baseTag = baseTags.find(t => t.id === id);
        if (baseTag?.name === tagName.trim()) {
          setUpdatedTags(updatedTags.filter(t => t.id !== id));
        } else {
          const updated = { id, name: tagName.trim() };
          setUpdatedTags(updatedTags.some(t => t.id === id) ? 
            updatedTags.map(t => t.id === id ? updated : t) : 
            [...updatedTags, updated]
          );
        }
      }
    }
    closeDialog();
  };

  const handleDelete = () => {
    if (!selectedTag) return;
    const { id } = selectedTag;
    
    if (id.startsWith('tmpId-')) {
      setNewTags(newTags.filter(t => t.id !== id));
    } else {
      setUpdatedTags(updatedTags.filter(t => t.id !== id));
      setDeletedTagsId([...deletedTagsId, id]);
    }
    closeDialog();
  };

  const handleRestore = (tagId: string) => {
    setDeletedTagsId(deletedTagsId.filter(id => id !== tagId));
  };

  const reset = () => {
    setSearchQuery('');
    setNewTags([]);
    setUpdatedTags([]);
    setDeletedTagsId([]);
    closeDialog();
  };

  return (
    <>
      <CustomModal
        visible={visible}
        onDismiss={() => { reset(); onCancel(); }}
        title={t('items:tags.title')}
        handleConfirm={() => { onSubmit(deletedTagsId, updatedTags, newTags); reset(); onCancel(); }}
        handleCancel={() => { reset(); onCancel(); }}
        containerStyle={ViewComponents.modalContainer}
      >
        <Searchbar
          placeholder={t('items:tags.placeholder.searchBar')}
          onChangeText={setSearchQuery}
          value={searchQuery}
          icon="magnify"
          clearIcon="close-circle-outline"
        />

        <ScrollView style={{ flex: 1 }}>
          <View style={[ViewComponents.tagsContainer, { padding: Spacing.small }]}>
            {filteredTags.map(tag => {
              const status = getStatus(tag);
              const count = tagCounts.get(tag.id) ?? 0;
              return (
                <SelectableChip
                  key={tag.id}
                  selected={status !== 'base'}
                  style={getChipStyle(status)}
                  onPress={() => status === 'deleted' ? handleRestore(tag.id) : openDialog(tag)}
                  onLongPress={() => openDialog(tag)}
                  icon={getChipIcon(status)}
                >
                  {tag.name} {`(${count})`}
                </SelectableChip>
              );
            })}
            
            <SelectableChip icon="plus" onPress={() => openDialog(null)}>
              {t('items:tags.action.new')}
            </SelectableChip>
          </View>
        </ScrollView>
      </CustomModal>

      <TagEditDialog
        visible={dialogMode !== null}
        mode={dialogMode === 'edit' ? 'edit' : 'create'}
        title={dialogMode === 'edit' ? t('items:tags.action.edit') : t('items:tags.action.new')}
        tagName={tagName}
        onChangeTagName={setTagName}
        onCancel={closeDialog}
        onConfirm={handleSave}
        onDelete={selectedTag ? handleDelete : undefined}
        count={selectedTag ? (tagCounts.get(selectedTag.id) ?? 0) : undefined}
        deleteLabel={t('common:button.delete')}
        countLabel={t('items:tags.count')}
        nameLabel={t('items:tags.placeholder.name')}
        confirmLabel={dialogMode === 'edit' ? t('common:button.save') : t('common:button.create')}
        cancelLabel={t('common:button.cancel')}
        errorColor={theme.colors.error}
      />
    </>
  );
}

interface TagEditDialogProps {
  visible: boolean;
  mode: 'edit' | 'create';
  title: string;
  tagName: string;
  onChangeTagName: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  onDelete?: () => void;
  count?: number;
  deleteLabel: string;
  countLabel: string;
  nameLabel: string;
  confirmLabel: string;
  cancelLabel: string;
  errorColor: string;
}

function TagEditDialog({
  visible,
  mode,
  title,
  tagName,
  onChangeTagName,
  onCancel,
  onConfirm,
  onDelete,
  count,
  deleteLabel,
  countLabel,
  nameLabel,
  confirmLabel,
  cancelLabel,
  errorColor
}: TagEditDialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label={nameLabel}
            value={tagName}
            onChangeText={onChangeTagName}
            mode="outlined"
            autoFocus
          />
          {mode === 'edit' && typeof count === 'number' && (
            <Text variant="bodySmall" style={{ marginTop: Spacing.small }}>
              {countLabel}: {count}
            </Text>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          {mode === 'edit' && onDelete && (
            <Button onPress={onDelete} textColor={errorColor}>
              {deleteLabel}
            </Button>
          )}
          <Button onPress={onCancel}>{cancelLabel}</Button>
          <Button onPress={onConfirm}>{confirmLabel}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}