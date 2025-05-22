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

interface Department {
  id: string;
  name: string;
  status: string;
}

const ListDepartment = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchDepartments = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/departments');
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải danh sách phòng ban');
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa phòng ban này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa', onPress: async () => {
          try {
            const res = await fetch(`http://10.0.2.2:3000/departments/${id}`, { method: 'DELETE' });
            if (res.ok) {
              setDepartments(prev => prev.filter(d => d.id !== id));
              Alert.alert('Thành công', 'Đã xóa phòng ban');
            } else {
              Alert.alert('Lỗi', 'Không thể xóa phòng ban');
            }
          } catch {
            Alert.alert('Lỗi', 'Không thể kết nối server');
          }
        }
      }
    ]);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách phòng ban</Text>
      <FlatList
        data={departments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.status}>Trạng thái: {item.status}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteDepartment(item.id)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddDepartment' as never)}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addText}>Thêm phòng ban</Text>
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
  status: { color: '#555', fontSize: 13 },
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

export default ListDepartment;
