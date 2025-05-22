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
  code: string;
  name: string;
  parent_id?: string;
  parent_name?: string;      // <-- Thêm trường này
  address?: string;
  manager_id?: string;
  manager_name?: string;     // <-- Thêm trường này
  note?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

const formatDate = (date?: string) => {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  } catch {
    return date;
  }
};

const renderStatusBadge = (isActive?: boolean) => (
  <View style={[styles.badge, { backgroundColor: isActive ? '#43a047' : '#e53935' }]}>
    <Text style={styles.badgeText}>{isActive ? 'Hoạt động' : 'Ngừng'}</Text>
  </View>
);

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
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <View style={styles.row}>
                <Ionicons name="cube-outline" size={22} color="#388e3c" style={{ marginRight: 8 }} />
                <Text style={styles.name}>{item.name}</Text>
                {renderStatusBadge(item.is_active)}
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="barcode-outline" size={16} color="#888" />
                <Text style={styles.infoText}>Mã kho: {item.code}</Text>
              </View>
              {item.parent_id && (
                <View style={styles.infoRow}>
                  <Ionicons name="git-branch-outline" size={16} color="#888" />
                  <Text style={styles.infoText}>Kho cha: {item.parent_name}</Text>
                </View>
              )}
              {item.manager_id && (
                <View style={styles.infoRow}>
                  <Ionicons name="person-outline" size={16} color="#888" />
                  <Text style={styles.infoText}>Quản lý: {item.manager_name}</Text>
                </View>
              )}
              {item.address && (
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={16} color="#888" />
                  <Text style={styles.infoText}>Địa chỉ: {item.address}</Text>
                </View>
              )}
              {item.note && (
                <View style={styles.infoRow}>
                  <Ionicons name="document-text-outline" size={16} color="#888" />
                  <Text style={styles.infoText}>Ghi chú: {item.note}</Text>
                </View>
              )}
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color="#888" />
                <Text style={styles.infoText}>Tạo: {formatDate(item.created_at)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="refresh-circle-outline" size={16} color="#888" />
                <Text style={styles.infoText}>Cập nhật: {formatDate(item.updated_at)}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => deleteWarehouse(item.id)} style={styles.iconBtn}>
              <Ionicons name="trash" size={20} color="#e53935" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có kho nào.</Text>}
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
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e8f5e9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  name: { fontSize: 16, fontWeight: '600', color: '#1b5e20', flex: 1 },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  infoText: { color: '#555', fontSize: 13, marginLeft: 6 },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
    backgroundColor: '#f0f4fa',
    alignSelf: 'flex-start',
  },
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
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#6c757d' },
});

export default ListWarehouse;
