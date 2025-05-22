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

interface Warehouse {
  id: string;
  name: string;
  location?: string;
  type?: string; // nếu có loại kho: nội bộ, thuê ngoài, v.v.
  status?: string; // nếu có trạng thái: hoạt động, tạm ngưng
}

const ListWarehouse = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchWarehouses = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/warehouses');
      const data = await res.json();
      setWarehouses(data);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải danh sách kho');
    } finally {
      setLoading(false);
    }
  };

  const deleteWarehouse = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xoá kho này?', [
      { text: 'Huỷ' },
      {
        text: 'Xoá', onPress: async () => {
          try {
            const res = await fetch(`http://10.0.2.2:3000/warehouses/${id}`, {
              method: 'DELETE',
            });
            if (res.ok) {
              setWarehouses(prev => prev.filter(w => w.id !== id));
              Alert.alert('Đã xoá', 'Kho đã được xoá');
            } else {
              Alert.alert('Lỗi', 'Không thể xoá kho');
            }
          } catch {
            Alert.alert('Lỗi', 'Không thể kết nối đến server');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🏢 Danh sách kho</Text>

      <FlatList
        data={warehouses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.detail}>
                Vị trí: {item.location || 'Không rõ'}
              </Text>
              {item.type && (
                <Text style={styles.detail}>Loại: {item.type}</Text>
              )}
              {item.status && (
                <Text style={styles.detail}>Trạng thái: {item.status}</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => deleteWarehouse(item.id)}>
              <Ionicons name="trash-outline" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddWarehouse' as never)}
      >
        <Ionicons name="add" size={22} color="#fff" />
        <Text style={styles.addText}>Thêm kho</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7fdfc' },
  header: { fontSize: 22, fontWeight: '700', color: '#2e7d32', marginBottom: 16 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: '600', color: '#1b5e20', marginBottom: 4 },
  detail: { fontSize: 13, color: '#555', marginBottom: 2 },
  addBtn: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#43a047',
    paddingVertical: 12,
    borderRadius: 8,
  },
  addText: { color: '#fff', marginLeft: 6, fontWeight: '600', fontSize: 15 },
});

export default ListWarehouse;
