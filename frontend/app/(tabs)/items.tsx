// app/(tabs)/items.tsx
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { useState } from 'react';
import { sharedStyles } from '@/styles/shared';

const fakeItems = [
  { id: '1', name: '大米', category: '粮食', quantity: '5kg' },
  { id: '2', name: '洗衣液', category: '日用品', quantity: '2瓶' },
  { id: '3', name: '可乐', category: '饮料', quantity: '6罐' },
];

export default function ItemsScreen() {
  const [search, setSearch] = useState('');

  const filteredItems = fakeItems.filter(item =>
    item.name.includes(search) || item.category.includes(search)
  );

  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.title}>当前家庭库存</Text>

      <TextInput
        style={sharedStyles.input}
        placeholder="搜索物品或类别"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetail}>{item.category} · {item.quantity}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={sharedStyles.emptyText}>未找到相关物品</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemCard: {
    backgroundColor: '#fff0e0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemDetail: {
    color: '#666',
    marginTop: 4,
  },
});
