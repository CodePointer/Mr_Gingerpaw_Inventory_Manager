import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { sharedStyles } from '@/styles/shared';

export default function EntryScreen() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [remindAt, setRemindAt] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [drafts, setDrafts] = useState<any[]>([]);

  const handleSubmit = () => {
    if (!name || !category || !quantity || !unit) {
      Alert.alert('请填写完整的物品信息');
      return;
    }

    const draftItem = {
      id: Date.now().toString(),
      name,
      category,
      quantity,
      unit,
      remindAt,
    };

    setDrafts(prev => [...prev, draftItem]);
    setName('');
    setCategory('');
    setQuantity('');
    setUnit('');
    setRemindAt(null);
    Alert.alert('已添加到草稿');
  };

  return (
    <View style={sharedStyles.container}>
      {/* 表单卡片 */}
      <View style={styles.card}>
        <Text style={sharedStyles.title}>录入新物品</Text>

        <TextInput
          style={sharedStyles.input}
          placeholder="物品名称"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={sharedStyles.input}
          placeholder="类别（可选）"
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={sharedStyles.input}
          placeholder="数量"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <TextInput
          style={sharedStyles.input}
          placeholder="单位（如 kg、瓶、盒）"
          value={unit}
          onChangeText={setUnit}
        />

        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.reminderBtn}>
          <Text>{remindAt ? `提醒时间: ${remindAt.toLocaleDateString()}` : '设置提醒时间（可选）'}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={remindAt || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setRemindAt(date);
            }}
          />
        )}

        <Button title="保存为草稿" onPress={handleSubmit} />
      </View>

      {/* 草稿列表 */}
      <FlatList
        style={{ marginTop: 16 }}
        data={drafts}
        keyExtractor={item => item.id}
        ListHeaderComponent={<Text style={styles.draftTitle}>草稿</Text>}
        renderItem={({ item }) => (
          <View style={styles.draftCard}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetail}>
              {item.category || '未分类'} · {item.quantity}{item.unit}
            </Text>
            {item.remindAt && (
              <Text style={styles.reminderText}>提醒：{new Date(item.remindAt).toLocaleDateString()}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={sharedStyles.emptyText}>暂无草稿</Text>}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff0e0',
    padding: 16,
    borderRadius: 10,
  },
  reminderBtn: {
    paddingVertical: 10,
    marginBottom: 12,
  },
  draftTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  draftCard: {
    backgroundColor: '#ffeede',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemDetail: {
    color: '#666',
    marginTop: 4,
  },
  reminderText: {
    marginTop: 4,
    color: '#cc5500',
    fontStyle: 'italic',
  },
});