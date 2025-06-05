import { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Modal, ViewStyle, TextStyle, Touchable, TouchableOpacity, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useItems, useTags } from '@/hooks';
import Button from '@/components/common/Button';
import { InputField } from '@/components/common/InputField';
import { Layout, Colors, ViewComponents, Spacing, TextComponents } from '@/styles';
import { TagOut } from '@/services/types';
import { Feather } from '@expo/vector-icons';
import { TagEditCard } from './TagEditCard';
import { TagCreateCard } from './TagCreateCard';


interface TagEditModalProps {
  visible: boolean;
  onClose: () => void;
  onDone: () => void;
}

export function TagEditModal({ visible, onClose, onDone }: TagEditModalProps) {
  const { t } = useTranslation();
  const { items } = useItems();
  const { tags, fetchTags, createTag, updateTag, deleteTag } = useTags();

  const [filteredTags, setFilteredTags] = useState<typeof tags>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTagId, setEditingTagId] = useState<number | null>(null);

  const [adding, setAdding] = useState(false);

  const aggregatedMap = useMemo(() => {
    const map = new Map<number, number>();
    items.forEach(item => {
      item.tags?.forEach(tag => {
        map.set(tag.id, map.get(tag.id) ?? 0 + 1);
      }); 
    });
    return map;
  }, [tags, items]);

  const handleCreateTag = async (tagName: string) => {
    await createTag(tagName);
  }

  const handleUpdateTag = async (tagId: number, tagName: string) => {
    await updateTag(tagId, tagName);
  }

  const handleDeleteTag = async (tagId: number) => {
    await deleteTag(tagId);
  }

  useEffect(() => {
    if (visible) {
      fetchTags();
    }
    setEditingTagId(null);
  }, [visible]);

  useEffect(() => {
    setFilteredTags(tags.filter((tg) => {
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
  }, [tags, searchQuery]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[Layout.center, ViewComponents.modalOverlay, { flex: 1 }]}>
        <View style={ViewComponents.modalContainer}>
          <ScrollView 
            style={{ maxHeight: Dimensions.get('window').height * 0.8, padding: Spacing.medium}}
          >
            {/* Search */}
            <InputField
              label=""
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('tags.placeholderSearchBar')}
            />

            {/* Show */}
            <View style={Layout.rowWrap}>
              {filteredTags.map(tag => (
                <TagEditCard
                  key={tag.id}
                  tag={tag}
                  count={aggregatedMap.get(tag.id) ?? 0}
                  editing={editingTagId === tag.id}
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
            <Button onPress={() => onClose()}>{t('common.buttonDone')}</Button>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
