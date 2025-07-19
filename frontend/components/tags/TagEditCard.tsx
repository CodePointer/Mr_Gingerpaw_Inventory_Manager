import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { InputField } from '@/components/common/InputField';
import { Layout, Colors, ViewComponents, TextComponents } from '@/styles';
import { TagOut } from '@/services/types';
import { Feather } from '@expo/vector-icons';


interface TagEditCardProps {
  tag: TagOut;
  count: number | null;
  editing: boolean;
  status: 'base' | 'new' | 'modified' | 'deleted';
  onEditing: (tagId: string | null) => void;
  onUpdate: (tagId: string, tagName: string) => void;
  onDelete: (tagId: string) => void;
}

export function TagEditCard({
  tag,
  count,
  editing,
  status,
  onEditing,
  onUpdate,
  onDelete,
}: TagEditCardProps) {
  const [newTagName, setNewTagName] = useState(tag.name);

  const renderTagCard = () => {
    if (editing) {
      return RenderIsEditing({
        tag,
        newTagName,
        setNewTagName,
        onLeftIcon: () => {
          onEditing(null);
          onUpdate(tag.id, newTagName);
        },
        onRightIcon: () => {
          onEditing(null);
          setNewTagName(tag.name);
        }
      });
    } else {
      return RenderNotEditing({
        tag,
        count,
        status,
        onLeftIcon: () => onEditing(tag.id),
        onRightIcon: () => onDelete(tag.id)
      })
    };
  };

  const getBackgroundColor = () => {
    switch (status) {
      case 'new':
        return Colors.newDark;
      case 'modified':
        return Colors.modifiedDark;
      case 'deleted':
        return Colors.removedDark;
      default:
        return Colors.primaryDeep;
    }
  }

  return (
    <View style={[ViewComponents.tag, { backgroundColor: getBackgroundColor() }]}>
      <View style={Layout.row}>
        {renderTagCard()}
      </View>
    </View>
  );
}


interface RenderNotEditingProps {
  tag: TagOut;
  count: number | null;
  status: 'base' | 'new' | 'modified' | 'deleted';
  onLeftIcon: () => void;
  onRightIcon: () => void;
}

function RenderNotEditing({
  tag,
  count,
  status,
  onLeftIcon,
  onRightIcon
}: RenderNotEditingProps) {
  return (
    <>
      <TouchableOpacity onPress={onLeftIcon} style={ViewComponents.touchableIcon}>
        <Feather name={'edit'} size={16} color={Colors.white} />
      </TouchableOpacity>

      <Text style={TextComponents.tagText}>
        {tag.name} {count !== null && `(${count})`}
      </Text>

      <TouchableOpacity onPress={onRightIcon} style={ViewComponents.touchableIcon}>
        <Feather name={status !== 'deleted' ? 'trash' :'rotate-ccw'} size={16} color={Colors.white} />
      </TouchableOpacity>
    </>
  )
}

interface RenderIsEditingProps {
  tag: TagOut;
  newTagName: string;
  setNewTagName: (name: string) => void;
  onLeftIcon: () => void;
  onRightIcon: () => void;
}

function RenderIsEditing({
  tag,
  newTagName,
  setNewTagName,
  onLeftIcon,
  onRightIcon
}: RenderIsEditingProps) {
  const { t } = useTranslation(['items']);
  return (
    <>
      <TouchableOpacity onPress={onLeftIcon} style={ViewComponents.touchableIcon}>
        <Feather name={'check'} size={16} color={Colors.white} />
      </TouchableOpacity>

      <InputField
        label=""
        value={newTagName}
        onChangeText={setNewTagName}
        placeholder={t('items:tags.placeholder.newTagName')}
      />

      <TouchableOpacity onPress={onRightIcon} style={ViewComponents.touchableIcon}>
        <Feather name={'x'} size={16} color={Colors.white} />
      </TouchableOpacity>
    </>
  )
}