import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '..//AppNavigator'; 

interface User {
  id: string;
  full_name: string;
  email: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const ListUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa người dùng này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa', onPress: async () => {
          try {
            const res = await fetch(`http://10.0.2.2:3000/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
              setUsers(prev => prev.filter(u => u.id !== id));
              Alert.alert('Thành công', 'Đã xóa người dùng');
            } else {
              Alert.alert('Lỗi', 'Không thể xóa người dùng');
            }
          } catch {
            Alert.alert('Lỗi', 'Không thể kết nối server');
          }
        }
      }
    ]);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách người dùng</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.full_name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteUser(item.id)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddUser' as never)}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addText}>Thêm người dùng</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  name: { fontWeight: '600' },
  email: { color: '#555' },
  addBtn: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#007bff',
  },
  addText: { color: '#fff', marginLeft: 6, fontWeight: '600' },
});

export default ListUser;