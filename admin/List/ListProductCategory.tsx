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

interface ProductCategory {
  id: string;
  name: string;
  description?: string;
}

const ListProductCategory = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/product-categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải danh mục sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xoá danh mục này?', [
      { text: 'Huỷ' },
      {
        text: 'Xoá',
        onPress: async () => {
          try {
            const res = await fetch(`http://10.0.2.2:3000/product-categories/${id}`, {
              method: 'DELETE',
            });
            if (res.ok) {
              setCategories(prev => prev.filter(c => c.id !== id));
              Alert.alert('Đã xoá', 'Danh mục đã được xoá');
            } else {
              Alert.alert('Lỗi', 'Không thể xoá danh mục');
            }
          } catch {
            Alert.alert('Lỗi', 'Không thể kết nối đến server');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📂 Danh mục sản phẩm</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc}>{item.description || 'Không có mô tả'}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteCategory(item.id)}>
              <Ionicons name="trash-outline" size={20} color="#dc3545" />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddProductCategory' as never)}
      >
        <Ionicons name="add" size={22} color="#fff" />
        <Text style={styles.addText}>Thêm danh mục</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9fdfc' },
  header: { fontSize: 22, fontWeight: '700', color: '#2e7d32', marginBottom: 16 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  itemContent: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#1b5e20' },
  desc: { fontSize: 13, color: '#555', marginTop: 2 },
  addBtn: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#43a047',
    paddingVertical: 12,
    borderRadius: 8,
  },
  addText: { color: '#fff', fontSize: 15, marginLeft: 6, fontWeight: '600' },
});

export default ListProductCategory;
