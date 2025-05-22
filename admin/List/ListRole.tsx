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

interface Role {
  id: string;
  name: string;
  description?: string;
}

const ListRole = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchRoles = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/roles');
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải danh sách vai trò');
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa vai trò này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa', onPress: async () => {
          try {
            const res = await fetch(`http://10.0.2.2:3000/roles/${id}`, { method: 'DELETE' });
            if (res.ok) {
              setRoles(prev => prev.filter(r => r.id !== id));
              Alert.alert('Thành công', 'Đã xóa vai trò');
            } else {
              Alert.alert('Lỗi', 'Không thể xóa vai trò');
            }
          } catch {
            Alert.alert('Lỗi', 'Không thể kết nối server');
          }
        }
      }
    ]);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách vai trò</Text>
      <FlatList
        data={roles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc}>{item.description || 'Không mô tả'}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteRole(item.id)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddRole' as never)}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addText}>Thêm vai trò</Text>
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
  name: { fontWeight: '600', fontSize: 16 },
  desc: { color: '#555', fontSize: 13 },
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

export default ListRole;
