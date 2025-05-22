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

interface Supplier {
  id: string;
  name: string;
  contact_name?: string;
  phone?: string;
}

const ListSupplier = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/suppliers');
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải danh sách nhà cung cấp');
    } finally {
      setLoading(false);
    }
  };

  const deleteSupplier = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa nhà cung cấp này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa', onPress: async () => {
          try {
            const res = await fetch(`http://10.0.2.2:3000/suppliers/${id}`, { method: 'DELETE' });
            if (res.ok) {
              setSuppliers(prev => prev.filter(s => s.id !== id));
              Alert.alert('Thành công', 'Đã xóa nhà cung cấp');
            } else {
              Alert.alert('Lỗi', 'Không thể xóa nhà cung cấp');
            }
          } catch {
            Alert.alert('Lỗi', 'Không thể kết nối server');
          }
        }
      }
    ]);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách nhà cung cấp</Text>
      <FlatList
        data={suppliers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.detail}>Liên hệ: {item.contact_name || 'Chưa rõ'} | {item.phone || '...'}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteSupplier(item.id)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddSupplier' as never)}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addText}>Thêm nhà cung cấp</Text>
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
  detail: { color: '#555', fontSize: 13 },
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

export default ListSupplier;
