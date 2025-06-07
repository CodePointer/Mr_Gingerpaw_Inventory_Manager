import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { InputField } from '@/components/common/InputField';
import { Layout, Colors, ViewComponents, Spacing, TextComponents } from '@/styles';
import { Feather } from '@expo/vector-icons';


interface TagCreateCardProps {
  isAdding: boolean;
  onToggle: () => void;
  onCreate: (tagName: string) => void;
}

export function TagCreateCard({
  isAdding,
  onToggle,
  onCreate,
}: TagCreateCardProps) {
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
    <View style={ViewComponents.tag}>
      <View style={Layout.row}>
        <TouchableOpacity 
          onPress={handleSubmit} 
          style={ViewComponents.touchableIcon}
        >
          <Feather name={isAdding ? 'check' : 'plus'} size={16} color={Colors.white} />
        </TouchableOpacity>

        {isAdding ? <InputField
          label=""
          value={newTagName}
          onChangeText={setNewTagName}
          placeholder={t('tags.placeholderNewTagName')}
          style={{ maxWidth: '80%' }}
        /> : <Text style={[TextComponents.tagText, { marginRight: Spacing.xsmall }]}>
          {t('tags.createNewTag')}
        </Text>}

        {isAdding && <TouchableOpacity 
          onPress={handleCancel} 
          style={ViewComponents.touchableIcon}
        >
          <Feather name={'x'} size={16} color={Colors.white} />
        </TouchableOpacity>}
        
      </View>
    </View>
  );
}
