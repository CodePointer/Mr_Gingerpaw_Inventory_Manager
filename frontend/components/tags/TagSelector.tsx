import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { TagOut } from '@/services/types';
import { Layout, Colors } from '@/styles';
import { Feather } from '@expo/vector-icons';
import { TagShowCard } from './TagShowCard';
import { TagCreateCard } from './TagCreateCard';
import { useState } from 'react';


interface TagSelectorProps {
  tags: TagOut[];
  selectedTagIds: Set<number>;
  style?: ViewStyle | ViewStyle;
  toggleTagIds: (tagId: number) => void;
  onCreateTag: ((name: string) => Promise<void>) | null;
}


export function TagSelector({ 
  tags, 
  selectedTagIds, 
  style = {},
  toggleTagIds,
  onCreateTag = null
}: TagSelectorProps) {

  const [adding, setAdding] = useState(false);

  return (
    <View style={[Layout.rowWrap, style]}>
      {tags.map((tag) => (
        <TagShowCard 
          key={tag.id}
          tag={tag}
          selected={selectedTagIds.has(tag.id)}
          onToggle={toggleTagIds}
        />
      ))}

      {onCreateTag !== null && <TagCreateCard 
        key="create"
        isAdding={adding}
        onToggle={() => setAdding(!adding)}
        onCreate={onCreateTag}
      />}
    </View>
  );
}
