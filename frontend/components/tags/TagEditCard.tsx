import { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Modal, ViewStyle, TextStyle, Touchable, TouchableOpacity, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useItems, useTags } from '@/hooks';
import Button from '@/components/common/Button';
import { InputField } from '@/components/common/InputField';
import { Layout, Colors, ViewComponents, Spacing, TextComponents } from '@/styles';
import { TagOut } from '@/services/types';
import { Feather } from '@expo/vector-icons';


interface TagEditCardProps {
  tag: TagOut;
  count: number | null;
  editing: boolean;
  onEditing: (tagId: number | null) => void;
  onUpdate: (tagId: number, tagName: string) => void;
  onDelete: (tagId: number) => void;
}


export function TagEditCard({
  tag,
  count,
  editing,
  onEditing,
  onUpdate,
  onDelete,
}: TagEditCardProps) {
  const { t } = useTranslation();
  const [newTagName, setNewTagName] = useState(tag.name);

  const handleSubmit = () => {
    if (!editing) {
      onEditing(tag.id);
    } else {
      onEditing(null);
      if (newTagName.trim() === '') return;
      if (newTagName.trim() === tag.name) return;
      onUpdate(tag.id, newTagName);
    }
  };

  const handleCancel = () => {
    if (!editing) {
      onDelete(tag.id);
    } else {
      onEditing(null);
      setNewTagName(tag.name);
    }
  };

  const renderTagName = () => {
    if (editing) {
      return (
        <InputField
          label=""
          value={newTagName}
          onChangeText={setNewTagName}
          placeholder={t('home.tagEditModal.placeholderNewTagName')}
        />
      );
    } else {
      return (
        <Text style={TextComponents.tagText}>
          {tag.name} {count !== null && `(${count})`}
        </Text>
      )
    };
  };

  return (
    <View style={[ViewComponents.tag]}>
      <View style={Layout.row}>
        <TouchableOpacity 
          onPress={handleSubmit} 
          style={ViewComponents.touchableIcon}
        >
          <Feather name={editing ? 'check' : 'edit'} size={16} color={Colors.white} />
        </TouchableOpacity>

        {renderTagName()}

        <TouchableOpacity 
          onPress={handleCancel} 
          style={ViewComponents.touchableIcon}
        >
          <Feather name={editing ? 'x' : 'trash'} size={16} color={Colors.white} />
        </TouchableOpacity>
        
      </View>
    </View>
  );
}