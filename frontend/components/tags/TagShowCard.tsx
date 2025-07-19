import { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Modal, ViewStyle, TextStyle, Touchable, TouchableOpacity, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useItems, useTags } from '@/hooks';
import Button from '@/components/common/Button';
import { InputField } from '@/components/common/InputField';
import { Layout, Colors, ViewComponents, Spacing, TextComponents } from '@/styles';
import { TagOut } from '@/services/types';
import { Feather } from '@expo/vector-icons';


interface TagShowCardProps {
  tag: TagOut;
  selected: boolean;
  onToggle: (tagId: string) => void; 
}


export function TagShowCard({
  tag,
  selected,
  onToggle,
}: TagShowCardProps) {
  const getBackgroundColor = () => {
    return selected ? Colors.primary : Colors.borderSoft;
  };

  return (
    <View style={[ViewComponents.tag, { backgroundColor: getBackgroundColor() }]}>
      <View style={[Layout.row, { paddingHorizontal: Spacing.xsmall }]}>
        <TouchableOpacity onPress={() => onToggle(tag.id)}>
          <Text style={TextComponents.tagText}>
            {tag.name}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}