import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';

interface MovementItem {
  id: string;
  type: 'import' | 'export';
  product_name: string;
  warehouse_name: string;
  unit: string;
  handler_name: string;
  price: number | null;
  batch_number: string;
  note: string;
  expiry_date: string;
  quantity: number;
  date: string;
}

const StockMovement = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [movements, setMovements] = useState<MovementItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovements = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/stock/movement');
      const result = await res.json();
      setMovements(result);
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu xuất/nhập kho');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMovements();
    }, [])
  );

  const deleteMovement = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa phiếu này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa',
        onPress: async () => {
          try {
            const res = await fetch(`http://10.0.2.2:3000/stock/delete/${id}`, {
              method: 'DELETE',
            });
            if (res.ok) {
              Alert.alert('Đã xóa');
              fetchMovements();
            } else {
              throw new Error();
            }
          } catch (err) {
            Alert.alert('Lỗi', 'Không thể xóa phiếu');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: MovementItem }) => {
    const icon = item.type === 'import' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline';
    const color = item.type === 'import' ? '#28a745' : '#dc3545';

    return (
      <View style={styles.item}>
        <Ionicons name={icon} size={24} color={color} style={styles.icon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.product_name}</Text>
          <Text style={styles.meta}>Kho: {item.warehouse_name}</Text>
          <Text style={styles.meta}>Số lượng: {item.quantity} {item.unit}</Text>
          <Text style={styles.meta}>Giá: {item.price ? `${item.price} đ` : '—'}</Text>
          <Text style={styles.meta}>Người xử lý: {item.handler_name || '—'}</Text>
          <Text style={styles.meta}>Số lô: {item.batch_number || '—'}</Text>
          <Text style={styles.meta}>Hạn dùng: {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString('vi-VN') : '—'}</Text>
          <Text style={styles.meta}>Ghi chú: {item.note || '—'}</Text>
          <Text style={styles.meta}>Ngày ghi nhận: {new Date(item.date).toLocaleDateString('vi-VN')}</Text>
        </View>
        <TouchableOpacity onPress={() => deleteMovement(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#b00020" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📦 Lịch sử xuất/nhập kho</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StockForm')}>
        <Text style={styles.buttonText}>➕ Tạo phiếu mới</Text>
      </TouchableOpacity>

      {movements.length === 0 ? (
        <Text style={styles.empty}>Không có dữ liệu.</Text>
      ) : (
        <FlatList
          data={movements}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#2e7d32' },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f1f8e9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  icon: { marginRight: 12, marginTop: 4 },
  title: { fontWeight: '600', fontSize: 16, color: '#33691e' },
  meta: { color: '#444', fontSize: 13 },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#999' },
  button: {
    marginBottom: 16,
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});

export default StockMovement;