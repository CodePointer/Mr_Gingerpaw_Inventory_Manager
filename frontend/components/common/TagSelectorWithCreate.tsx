import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { TagOut } from "@/services/types";
import { Colors } from "@/styles";
import { useTags } from "@/hooks";
import { useTranslation } from "react-i18next";


interface TagSelectorWithCreateProps {
  tags: TagOut[];
  selectedTagIds: Set<number>;
  toggleTag: (tagId: number) => void;
  onCreateTag: (name: string) => Promise<void>;
}

export default function TagSelectorWithCreate({
  tags,
  selectedTagIds,
  toggleTag,
  onCreateTag,
}: TagSelectorWithCreateProps) {
  const { t } = useTranslation();
  const { createTag } = useTags();
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const onAdd = async () => {
    if (newName.trim()) {
      await createTag(newName.trim());
      setNewName("");
    }
    setAdding(false);
  };

  return (
    <View style={styles.container}>
      {tags.map((tag) => (
        <TouchableOpacity
          key={tag.id}
          onPress={() => toggleTag(tag.id)}
          style={[
            styles.tag,
            selectedTagIds.has(tag.id) ? styles.selected : styles.unselected,
          ]}
        >
          <Text style={styles.text}>{tag.name}</Text>
        </TouchableOpacity>
      ))}

      {adding ? (
        <View style={styles.newTagRow}>
          <TextInput
            style={[styles.input, styles.newInput]}
            placeholder={t('tag.placeholderNewTag')}
            value={newName}
            onChangeText={setNewName}
          />
          <TouchableOpacity onPress={onAdd} style={styles.okButton}>
            <Text style={styles.okText}>✔︎</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAdding(false)} style={styles.cancelButton}>
            <Text style={styles.cancelText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setAdding(true)} style={[styles.tag, styles.addButton]}>
          <Text style={styles.text}>{t('tag.buttonNewTag')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", marginVertical: 10 },
  tag: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, margin: 5 },
  selected: { backgroundColor: Colors.primary },
  unselected: { backgroundColor: Colors.borderSoft },
  text: { color: Colors.white, fontWeight: "500" },
  addButton: { backgroundColor: Colors.primaryDeep },
  newTagRow: { flexDirection: "row", alignItems: "center", margin: 5 },
  newInput: { flex: 1, backgroundColor: Colors.white, borderColor: Colors.borderSoft, borderWidth: 1 },
  input: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 5 },
  okButton: { padding: 8, backgroundColor: Colors.primary, borderRadius: 20, marginRight: 5 },
  okText: { color: Colors.white },
  cancelButton: { padding: 8, backgroundColor: Colors.borderSoft, borderRadius: 20 },
  cancelText: { color: Colors.white },
});
