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

interface Customer {
  id: string;
  company_name: string;
  contact_person?: string;
  phone: string;
  email?: string;
  address?: string;
  priority_level?: number;
}

const ListCustomer = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchCustomers = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/customers');
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa khách hàng này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa', onPress: async () => {
          try {
            const res = await fetch(`http://10.0.2.2:3000/customers/${id}`, { method: 'DELETE' });
            if (res.ok) {
              setCustomers(prev => prev.filter(c => c.id !== id));
              Alert.alert('Thành công', 'Đã xóa khách hàng');
            } else {
              Alert.alert('Lỗi', 'Không thể xóa khách hàng');
            }
          } catch {
            Alert.alert('Lỗi', 'Không thể kết nối server');
          }
        }
      }
    ]);
  };

  const renderPriority = (level?: number) => {
    if (level === 1) return 'Cao';
    if (level === 2) return 'Trung bình';
    return 'Bình thường';
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📋 Danh sách khách hàng</Text>

      <FlatList
        data={customers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.company_name}</Text>
              <Text style={styles.detail}>
                Liên hệ: {item.contact_person || '—'} | SĐT: {item.phone}
              </Text>
              <Text style={styles.detail}>
                Email: {item.email || '—'} | Ưu tiên: {renderPriority(item.priority_level)}
              </Text>
              <Text style={styles.detail}>
                Địa chỉ: {item.address || '—'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => deleteCustomer(item.id)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddCustomer' as never)}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addText}>Thêm khách hàng</Text>
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
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  name: { fontWeight: '700', fontSize: 16, marginBottom: 4, color: '#2e7d32' },
  detail: { color: '#555', fontSize: 13, marginBottom: 2 },
  addBtn: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#007bff',
  },
  addText: { color: '#fff', marginLeft: 6, fontWeight: '600', fontSize: 15 },
});

export default ListCustomer;
