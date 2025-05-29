import { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Modal, ViewStyle, TextStyle, Touchable, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useItems, useTags } from '@/hooks';
import Button from '@/components/common/Button';
import { InputField } from '@/components/common/InputField';
import { Layout, Components, Colors } from '@/styles';
import { TagOut } from '@/services/types';
import { Feather } from '@expo/vector-icons';


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
    <Modal 
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}
    >
      <View style={Layout.modalOverlay}>
        <ScrollView style={Layout.container}>
          {/* Search */}
          <InputField
            label=""
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('home.tagEditModal.placeholderSearchBar')}
          />

          {/* Show */}
          <View style={Layout.wrap}>
            {filteredTags.map(tag => (
              <TagEditItem
                key={tag.id}
                tag={tag}
                count={aggregatedMap.get(tag.id) ?? 0}
                editing={editingTagId === tag.id}
                onToggle={setEditingTagId}
                onUpdate={handleUpdateTag}
                onDelete={handleDeleteTag}
              />
            ))}

            <TagCreateItem
              key="create"
              isAdding={adding}
              onToggle={() => setAdding(!adding)}
              onCreate={handleCreateTag}
            />
          </View>

          {/* Create */}

          {/* Close */}
          <Button onPress={() => onClose()}>{t('home.tagEditModal.buttonClose')}</Button>

        </ScrollView>
      </View>
    </Modal>
  );
}


interface TagEditItemProps {
  tag: TagOut;
  count: number;
  editing: boolean;
  onToggle: (tagId: number | null) => void;
  onUpdate: (tagId: number, tagName: string) => void;
  onDelete: (tagId: number) => void;
}

function TagEditItem({
  tag,
  count,
  editing,
  onToggle,
  onUpdate,
  onDelete,
}: TagEditItemProps) {
  const { t } = useTranslation();
  const [newTagName, setNewTagName] = useState(tag.name);

  const handleSubmit = () => {
    if (!editing) {
      onToggle(tag.id);
    } else {
      onToggle(null);
      if (newTagName.trim() === '') return;
      if (newTagName.trim() === tag.name) return;
      onUpdate(tag.id, newTagName);
    }
  };

  const handleCancel = () => {
    if (!editing) {
      onDelete(tag.id);
    } else {
      onToggle(null);
      setNewTagName(tag.name);
    }
  };

  return (
    <View style={Components.tag as ViewStyle}>
      <View style={Layout.row}>
        <TouchableOpacity 
          onPress={handleSubmit} 
          style={Components.touchableIcon as ViewStyle}
        >
          <Feather name={editing ? 'check' : 'edit'} size={20} color={Colors.white} />
        </TouchableOpacity>

        {editing ? <InputField
          label=""
          value={newTagName}
          onChangeText={setNewTagName}
          placeholder={t('home.tagEditModal.placeholderNewTagName')}
          style={Components.tagInput as TextStyle}
        /> : <Text style={Components.tagText as TextStyle}>
          {tag.name} {`(${count})`}
        </Text>}

        <TouchableOpacity 
          onPress={handleCancel} 
          style={Components.touchableIcon as ViewStyle}
        >
          <Feather name={editing ? 'x' : 'trash'} size={20} color={Colors.white} />
        </TouchableOpacity>
        
      </View>
    </View>
  );
}


interface TagCreateItemProps {
  isAdding: boolean;
  onToggle: () => void;
  onCreate: (tagName: string) => void;
}

function TagCreateItem({
  isAdding,
  onToggle,
  onCreate,
}: TagCreateItemProps) {
  const { t } = useTranslation();
  const [newTagName, setNewTagName] = useState('');

  const handleSubmit = () => {
    if (isAdding && newTagName.trim() !== '') {
      onCreate(newTagName);
    }
    onToggle();
    setNewTagName('');
  }

  const handleCancel = () => onToggle();

  return (
    <View style={Components.tag as ViewStyle}>
      <View style={Layout.row}>
        <TouchableOpacity 
          onPress={handleSubmit} 
          style={Components.touchableIcon as ViewStyle}
        >
          <Feather name={isAdding ? 'check' : 'plus'} size={20} color={Colors.white} />
        </TouchableOpacity>

        {isAdding ? <InputField
          label=""
          value={newTagName}
          onChangeText={setNewTagName}
          placeholder={t('home.tagEditModal.placeholderNewTagName')}
          style={Components.tagInput as TextStyle}
        /> : <Text style={Components.tagText as TextStyle}>
          {t('home.tagEditModal.createNewTag')}
        </Text>}

        {isAdding && <TouchableOpacity 
          onPress={handleCancel} 
          style={Components.touchableIcon as ViewStyle}
        >
          <Feather name={'x'} size={20} color={Colors.white} />
        </TouchableOpacity>}
        
      </View>
    </View>
  );
}
