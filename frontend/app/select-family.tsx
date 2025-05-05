import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useFamily } from '../hooks/useFamily';
import { useRouter } from 'expo-router';
import { Button } from 'react-native';
import { useAuth } from '../hooks/useAuth';

const fakeFamilies = [
  { id: 1, name: '刘家', notes: 'Adelaide Home' },
  { id: 2, name: '桥家', notes: 'Beijing 老家' },
];

export default function SelectFamilyScreen() {
  const { selectedFamily, selectFamily } = useFamily();
  const router = useRouter();

  const handleSelect = (family: typeof fakeFamilies[0]) => {
    selectFamily(family);
    router.replace('/items');
  };

  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>请选择一个家庭</Text>
      <FlatList
        data={fakeFamilies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isSelected = selectedFamily?.id == item.id;
          return (
            <Pressable style={styles.card} onPress={() => handleSelect(item)}>
              <Text style={styles.familyName}>
                {item.name} {isSelected ? '✅': ''}
              </Text>
              <Text style={styles.notes}>{item.notes}</Text>
            </Pressable>
          );
        }}
      />

      <Button title="退出登录" onPress={() => {
        logout();
        router.replace('/login');
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 12,
  },
  familyName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notes: {
    fontSize: 14,
    color: '#666',
  },
});
