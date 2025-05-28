import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TagOut } from '@/services/types';
import { Colors } from '@/styles';
import { Feather } from '@expo/vector-icons';

interface TagSelectorProps {
  tags: TagOut[];
  selectedTagIds: Set<number>;
  toggleTagIds: (tagId: number) => void;
}

export function TagSelector({ tags, selectedTagIds, toggleTagIds }: TagSelectorProps) {
  return (
    <View style={styles.container}>
      {tags.map((tag) => (
        <TouchableOpacity
          key={tag.id}
          onPress={() => toggleTagIds(tag.id)}
          style={[
            styles.tag,
            selectedTagIds.has(tag.id) ? styles.selectedTag : styles.unselectedTag,
          ]}
        >
          {/* <Feather name="tag" color={Colors.white} size={16}></Feather> */}
          <Text style={styles.tagText}>{tag.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 4,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    margin: 2,
    // flexDirection: 'row',
    // alignContent: 'center',
  },
  selectedTag: {
    backgroundColor: Colors.primary,
  },
  unselectedTag: {
    backgroundColor: Colors.borderSoft,
  },
  tagText: {
    color: Colors.white,
    fontWeight: "500",
    // flex: 1,
  },
});
