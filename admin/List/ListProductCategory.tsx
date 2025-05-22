import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
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

  // Modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

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

  const openEditModal = (category: ProductCategory) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditDesc(category.description || '');
    setEditModalVisible(true);
  };

  const handleEditSave = async () => {
    if (!editingCategory) return;
    if (!editName.trim()) {
      Alert.alert('Lỗi', 'Tên danh mục không được để trống');
      return;
    }
    try {
      const res = await fetch(`http://10.0.2.2:3000/product-categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, description: editDesc }),
      });
      if (res.ok) {
        setCategories(prev =>
          prev.map(c =>
            c.id === editingCategory.id
              ? { ...c, name: editName, description: editDesc }
              : c
          )
        );
        setEditModalVisible(false);
        setEditingCategory(null);
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật danh mục');
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    }
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
          <View style={styles.card}>
            <Ionicons name="folder-open-outline" size={32} color="#388e3c" style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc}>{item.description || 'Không có mô tả'}</Text>
            </View>
            <TouchableOpacity
              onPress={() => openEditModal(item)}
              style={styles.iconBtn}
            >
              <Ionicons name="pencil-outline" size={20} color="#1976d2" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteCategory(item.id)} style={styles.iconBtn}>
              <Ionicons name="trash-outline" size={20} color="#dc3545" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có danh mục nào.</Text>}
      />
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddProductCategory' as never)}
      >
        <Ionicons name="add" size={22} color="#fff" />
        <Text style={styles.addText}>Thêm danh mục</Text>
      </TouchableOpacity>

      {/* Modal chỉnh sửa */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chỉnh sửa danh mục</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên danh mục"
              value={editName}
              onChangeText={setEditName}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Mô tả"
              value={editDesc}
              onChangeText={setEditDesc}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={{ color: '#1976d2' }}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleEditSave}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9fdfc' },
  header: { fontSize: 22, fontWeight: '700', color: '#2e7d32', marginBottom: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#388e3c',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  name: { fontSize: 16, fontWeight: '600', color: '#1b5e20' },
  desc: { fontSize: 13, color: '#555', marginTop: 2 },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f4fa',
    marginLeft: 8,
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
  addText: { color: '#fff', fontSize: 15, marginLeft: 6, fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#6c757d' },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 22,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 18,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dce4f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    fontSize: 15,
    backgroundColor: '#f8fafc',
    color: '#333',
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#e9edf2',
  },
  saveBtn: {
    backgroundColor: '#1976d2',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});

export default ListProductCategory;
