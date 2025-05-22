import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

interface InventoryItem {
  material_name: string;
  warehouse_name: string;
  quantity: number;
}

const InventoryList = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/inventory');
      const data = await res.json();

      console.log('📦 Inventory response:', data); // Debug log

      if (Array.isArray(data)) {
        setInventory(data);
      } else {
        throw new Error('Dữ liệu trả về không hợp lệ');
      }
    } catch (error) {
      console.error('Lỗi tải tồn kho:', error);
      Alert.alert('Lỗi', 'Không thể tải tồn kho');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.material_name}</Text>
      <Text style={styles.sub}>🏬 {item.warehouse_name}</Text>
      <Text style={styles.qty}>Số lượng: {item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📦 Tồn kho hiện tại</Text>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      ) : inventory.length === 0 ? (
        <Text style={styles.empty}>Không có dữ liệu tồn kho.</Text>
      ) : (
        <FlatList
          data={inventory}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 16,
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#e8f5e9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: '600', color: '#1b5e20' },
  sub: { fontSize: 14, color: '#444', marginTop: 4 },
  qty: { fontSize: 14, color: '#000', fontWeight: '500', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 14, color: '#777' },
});

export default InventoryList;
