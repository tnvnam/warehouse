import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

interface StockCheck {
  id: string;
  date: string;
  note?: string;
  warehouse_name?: string;
}

const StockCheckList = () => {
  const [data, setData] = useState<StockCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://10.0.2.2:3000/stockcheck');
      const result = await res.json();
      setData(result);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải danh sách kiểm kê');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Tự động gọi lại khi quay lại màn hình
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const renderItem = ({ item }: { item: StockCheck }) => (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.date}>📅 {item.date}</Text>
        <Text style={styles.warehouse}>🏢 {item.warehouse_name || 'Không rõ kho'}</Text>
        {item.note ? <Text style={styles.note}>📝 {item.note}</Text> : null}
      </View>
      {/* Placeholder cho chức năng chi tiết sau này */}
      <TouchableOpacity onPress={() => Alert.alert('Chi tiết', `Mã kiểm kê: ${item.id}`)}>
        <Ionicons name="chevron-forward" size={20} color="#888" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📋 Danh sách phiếu kiểm kê</Text>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 100 }} />
      ) : (
        <>
          {data.length === 0 ? (
            <Text style={styles.empty}>Không có dữ liệu kiểm kê.</Text>
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 80 }}
            />
          )}
        </>
      )}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('StockCheckForm' as never)}
      >
        <Ionicons name="add-circle-outline" size={22} color="#fff" />
        <Text style={styles.addText}>Tạo kiểm kê</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9fdfb' },
  header: { fontSize: 22, fontWeight: '700', color: '#2e7d32', marginBottom: 16 },
  item: {
    backgroundColor: '#e8f5e9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  date: { fontWeight: '600', fontSize: 15, color: '#2e7d32' },
  warehouse: { color: '#333', fontSize: 13, marginTop: 4 },
  note: { fontSize: 12, fontStyle: 'italic', color: '#666', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 40, color: '#888' },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: '#43a047',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  addText: { color: '#fff', marginLeft: 8, fontWeight: '600', fontSize: 15 },
});

export default StockCheckList;
