import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@/hooks/useAuth';
import { useFamily } from '@/hooks/useFamily';
import { useRouter } from 'expo-router';
import { sharedStyles } from '@/styles/shared';
import { Colors } from '@/styles/colors';


export default function MeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [selectedFamily, setSelectedFamily] = useState('默认家庭');
  const {
    families,
    currentFamilyId,
    setCurrentFamilyId,
    loading,
    error,
  } = useFamily();
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  
  // useEffect(() => {
  //   const fetchFamilies = async () => {
  //     try {
  //       const response = await axios.get('/families/', {
  //         headers: { 
  //           Authorization: `Bearer ${user?.token}` 
  //         },
  //       });
  //       setFamilies(response.data);
  //     } catch (err) {
  //       console.error('Failed to fetch families:', err);
  //       setError('Failed to fetch families. Please try again later.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchFamilies();
  // }, [user]);

  const handleLogout = () => {
    Alert.alert('确认退出', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '退出',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/login');
        },
      },
    ]);
  };

  useEffect(() => {
    console.log('🏠 当前家庭 ID 已更新为：', currentFamilyId);
  }, [currentFamilyId])

  if (loading) {
    return (
      <View style={sharedStyles.container}>
        <ActivityIndicator size="large" color={Colors.primaryDeep} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={sharedStyles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={sharedStyles.container}>
      <Text style={styles.sectionTitle}>账户信息</Text>
      <Text style={styles.infoText}>用户名：{user?.username}</Text>
      <Text style={styles.infoText}>邮箱：{user?.username}@example.com</Text>

      <Text style={styles.sectionTitle}>当前家庭</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={String(currentFamilyId)}
          onValueChange={(itemValue) => {
            setCurrentFamilyId(Number(itemValue));
          }}
          style={styles.picker}
        >
          {families.map((family) => (
            <Picker.Item 
              key={family.id} 
              label={family.name} 
              value={String(family.id)} 
              color={Colors.textDark}
            />
          ))}
        </Picker>
      </View>

      <View style={{ marginTop: 32 }}>
        <Button title="退出登录" color={Colors.primaryDeep} onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    color: Colors.textDark,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.textDark,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: 6,
    overflow: 'hidden',
  },
  picker: {
    color: Colors.textDark,               // ✅ 控制文字颜色
    // backgroundColor: Colors.white,       // ✅ 可选：Picker 背景
    // height: 160,                           // ✅ 可加高度
    // borderRadius: 6,                     // ❗ iOS 有效，Android 较难圆角
  },  
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});
