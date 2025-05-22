import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface MovementItem {
  id: number;
  type: 'import' | 'export';
  product_name: string;
  warehouse_name: string;
  quantity: number;
  date: string;
}

const StockMovement = () => {
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

  useEffect(() => {
    fetchMovements();
  }, []);

  const renderItem = ({ item }: { item: MovementItem }) => {
    const icon = item.type === 'import' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline';
    const color = item.type === 'import' ? '#28a745' : '#dc3545';

    return (
      <View style={styles.item}>
        <Ionicons name={icon} size={24} color={color} style={styles.icon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.product_name}</Text>
          <Text style={styles.meta}>Kho: {item.warehouse_name}</Text>
          <Text style={styles.meta}>Số lượng: {item.quantity}</Text>
          <Text style={styles.meta}>Ngày: {item.date}</Text>
        </View>
      </View>
    );
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lịch sử xuất/nhập kho</Text>
      <FlatList
        data={movements}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  icon: { marginRight: 12, marginTop: 4 },
  title: { fontWeight: '600', fontSize: 16 },
  meta: { color: '#555', fontSize: 13 },
});

export default StockMovement;
