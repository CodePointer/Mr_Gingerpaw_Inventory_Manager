import { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, Modal, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button';
import { InputField } from '@/components/common/InputField';
import { Layout, ViewComponents, Spacing, TextComponents } from '@/styles';
import { ItemOut, TagOut } from '@/services/types';
import { TagEditCard } from './TagEditCard';
import { TagCreateCard } from './TagCreateCard';


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
  // const { items } = useItems();

  const [filteredTags, setFilteredTags] = useState<TagOut[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);

  const [adding, setAdding] = useState(false);

  const [newTags, setNewTags] = useState<TagOut[]>([]);
  const [updatedTags, setUpdatedTags] = useState<TagOut[]>([]);
  const [deletedTagsId, setDeletedTagsId] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const notUpdatedTags = baseTags.filter(t => !updatedTags.some(ut => ut.id === t.id));
    return [
      ...notUpdatedTags,
      ...newTags,
      ...updatedTags
    ];
  }, [baseTags, newTags, updatedTags]);

  const aggregatedMap = useMemo(() => {
    const map = new Map<string, number>();
    allItems.forEach(item => {
      item.tags?.forEach(tag => {
        map.set(tag.id.toString(), map.get(tag.id.toString()) ?? 0 + 1);
      });
    });
    return map;
  }, [allItems, allTags]);

  useEffect(() => {
    setFilteredTags(allTags.filter((tg) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (tg.name.toLowerCase().includes(query)) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }));
  }, [allTags, searchQuery]);

  const handleCreateTag = (tagName: string) => {
    const newTag: TagOut = { id: `tmpId-${Date.now()}`, name: tagName };
    setNewTags([...newTags, newTag]);
  }

  const handleUpdateTag = (tagId: string, tagName: string) => {
    const newTag: TagOut = { id: tagId, name: tagName };
    if (tagId.startsWith('tmpId-')) {
      setNewTags(newTags.map(t => t.id === tagId ? { ...t, name: tagName } : t));
    } else {
      const baseTag = baseTags.find(t => t.id === tagId);
      if (baseTag?.name === tagName.trim()) {
        setUpdatedTags(updatedTags.filter(t => t.id !== tagId));
        return;
      }
      if (updatedTags.find(t => t.id === tagId)) {
        setUpdatedTags(updatedTags.map(t => t.id === tagId ? newTag : t));
      } else {
        setUpdatedTags([...updatedTags, newTag]);
      }
    }
  }

  const handleDeleteTag = (tagId: string) => {
    if (tagId.startsWith('tmpId-')) {
      // console.log('Deleting temporary tag:', tagId);
      setNewTags(newTags.filter(t => t.id !== tagId));
    } else if (deletedTagsId.includes(tagId)) {
      setDeletedTagsId(deletedTagsId.filter(id => id !== tagId));
    } else {
      if (updatedTags.find(t => t.id === tagId)) {
        setUpdatedTags(updatedTags.filter(t => t.id !== tagId));
      }
      setDeletedTagsId([...deletedTagsId, tagId]);
    }
  }

  const handleCancel = () => {
    setEditingTagId(null);
    setAdding(false);
    setNewTags([]);
    setUpdatedTags([]);
    setDeletedTagsId([]);
    onCancel();
  }

  const handleSubmit = () => {
    onSubmit(deletedTagsId, updatedTags, newTags);
    handleCancel();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleCancel}>
      <View style={[Layout.center, ViewComponents.modalOverlay, { flex: 1 }]}>
        <View style={ViewComponents.modalContainer}>
          <ScrollView
            style={{ height: Dimensions.get('window').height * 0.8, padding: Spacing.medium }}
          >
            {/* Search */}
            <InputField
              label=""
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('items:tags.placeholder.searchBar')}
            />

            {/* Show */}
            <View style={[Layout.rowWrap, { flex: 1 }]}>
              {filteredTags.map(tag => (
                <TagEditCard
                  key={tag.id}
                  tag={tag}
                  count={aggregatedMap.get(tag.id) ?? 0}
                  editing={editingTagId === tag.id}
                  status={
                    newTags.some(nt => nt.id === tag.id) ? 'new' :
                    deletedTagsId.includes(tag.id) ? 'deleted' :
                    updatedTags.some(ut => ut.id === tag.id) ? 'modified' :
                    'base'
                  }
                  onEditing={setEditingTagId}
                  onUpdate={handleUpdateTag}
                  onDelete={handleDeleteTag}
                />
              ))}

              <TagCreateCard
                key="create"
                isAdding={adding}
                onToggle={() => setAdding(!adding)}
                onCreate={handleCreateTag}
              />
            </View>

            {/* Create */}

            {/* Close */}
            <View style={[Layout.buttonRow, Layout.modalPadding]}>
              <Button style={ViewComponents.buttonInRow} onPress={handleSubmit}>
                {t('common:button.confirm')}
              </Button>
              <Button style={ViewComponents.buttonInRow} onPress={handleCancel}>
                {t('common:button.cancel')}
              </Button>
            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
