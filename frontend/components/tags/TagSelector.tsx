import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { TagOut } from '@/services/types';
import { Colors, ViewComponents } from '@/styles';
import { Feather } from '@expo/vector-icons';
import { SelectableChip } from '@/components/common/SelectableChip';


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
    <View style={[ViewComponents.tagsContainer, style]}>

      {onCreateTag !== null && 
      <View style={ViewComponents.tag}>
        <TouchableOpacity onPress={onCreateTag} style={ViewComponents.touchableIcon}>
          <Feather name={'edit'} size={16} color={Colors.white} />
        </TouchableOpacity>
      </View>}

      {tags.map((tag) => (
        <SelectableChip
          key={tag.id}
          onPress={() => toggleTagIds(tag.id)}
          selected={selectedTagIds.has(tag.id)}
        >
          {tag.name}
        </SelectableChip>
      ))}
    </View>
  );
}
