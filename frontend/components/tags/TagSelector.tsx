import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { TagOut } from '@/services/types';
import { Layout, Colors, ViewComponents } from '@/styles';
import { Feather } from '@expo/vector-icons';
import { TagShowCard } from './TagShowCard';
// import { TagCreateCard } from './TagCreateCard';
import { useState } from 'react';


interface TagSelectorProps {
  tags: TagOut[];
  selectedTagIds: Set<string>;
  style?: ViewStyle | ViewStyle;
  toggleTagIds: (tagId: string) => void;
  onCreateTag: (() => void) | null;
}


export function TagSelector({ 
  tags, 
  selectedTagIds, 
  style = {},
  toggleTagIds,
  onCreateTag = null
}: TagSelectorProps) {

  // const [adding, setAdding] = useState(false);
  return (
    <View style={[Layout.rowWrap, style]}>
      {/* {onCreateTag !== null && <TagCreateCard 
        key="create"
        isAdding={adding}
        onToggle={() => setAdding(!adding)}
        onCreate={onCreateTag}
      />} */}

      {onCreateTag !== null && 
      <View style={ViewComponents.tag}>
        <TouchableOpacity onPress={onCreateTag} style={ViewComponents.touchableIcon}>
          <Feather name={'edit'} size={16} color={Colors.white} />
        </TouchableOpacity>
      </View>}

      {tags.map((tag) => (
        <TagShowCard 
          key={tag.id}
          tag={tag}
          selected={selectedTagIds.has(tag.id)}
          onToggle={toggleTagIds}
        />
      ))}
    </View>
  );
}
