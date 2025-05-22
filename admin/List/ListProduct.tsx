import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../AppNavigator';

interface Product {
  id: string;
  name: string;
  code: string;
  category: string;      // UUID
  category_name?: string; // Thêm trường này
  unit: string;          // UUID
  unit_name?: string;    // Thêm trường này
  price: number;
}

const ListProduct = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Lỗi tải sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', { id: item.id })}>
      <Ionicons name="cube-outline" size={32} color="#1976d2" style={{ marginRight: 14 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="barcode-outline" size={15} color="#888" />
          <Text style={styles.infoText}>Mã: {item.code}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="pricetag-outline" size={15} color="#888" />
          <Text style={styles.infoText}>Loại: {item.category_name || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="cube" size={15} color="#888" />
          <Text style={styles.infoText}>Đơn vị: {item.unit_name || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={15} color="#888" />
          <Text style={styles.infoText}>Giá: {item.price.toLocaleString('vi-VN')} đ</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#bbb" />
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📦 Danh sách sản phẩm</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có sản phẩm nào.</Text>}
      />
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddProduct' as never)}
      >
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.addText}>Thêm sản phẩm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7fafd' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#1976d2' },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#1976d2',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  name: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  infoText: { color: '#555', fontSize: 13, marginLeft: 6 },
  addBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: '#1976d2',
    elevation: 2,
  },
  addText: { color: '#fff', marginLeft: 10, fontWeight: 'bold', fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#6c757d' },
});

export default ListProduct;
