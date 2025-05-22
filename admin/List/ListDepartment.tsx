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
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

interface Department {
  id: string;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  status?: string;
}

const ListDepartment = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [editModal, setEditModal] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [editForm, setEditForm] = useState({ name: '', code: '', description: '', is_active: true });

  const fetchDepartments = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/departments');
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải danh sách phòng ban');
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa phòng ban này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa', onPress: async () => {
          try {
            const res = await fetch(`http://10.0.2.2:3000/departments/${id}`, { method: 'DELETE' });
            if (res.ok) {
              setDepartments(prev => prev.filter(d => d.id !== id));
              Alert.alert('Thành công', 'Đã xóa phòng ban');
            } else {
              Alert.alert('Lỗi', 'Không thể xóa phòng ban');
            }
          } catch {
            Alert.alert('Lỗi', 'Không thể kết nối server');
          }
        }
      }
    ]);
  };

  const openEditModal = (dept: Department) => {
    setEditDept(dept);
    setEditForm({
      name: dept.name,
      code: dept.code,
      description: dept.description || '',
      is_active: dept.is_active,
    });
    setEditModal(true);
  };

  const handleEdit = async () => {
    if (!editDept) return;
    try {
      const res = await fetch(`http://10.0.2.2:3000/departments/${editDept.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setDepartments(prev =>
          prev.map(d => d.id === editDept.id ? { ...d, ...editForm } : d)
        );
        setEditModal(false);
        Alert.alert('Thành công', 'Đã cập nhật phòng ban');
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật phòng ban');
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể kết nối server');
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  const renderStatus = (active: boolean) => (
    <View style={[styles.badge, { backgroundColor: active ? '#4caf50' : '#f44336' }]}>
      <Text style={styles.badgeText}>{active ? 'Hoạt động' : 'Ngừng'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách phòng ban</Text>
      <FlatList
        data={departments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Ionicons name="business-outline" size={20} color="#1976d2" style={{ marginRight: 6 }} />
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.code}>  ({item.code})</Text>
                {renderStatus(item.is_active)}
              </View>
              <Text style={styles.desc} numberOfLines={2}>Mô tả: {item.description || '(Không có)'}</Text>
              <Text style={styles.date}>
                <Ionicons name="calendar-outline" size={14} color="#888" /> {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
              </Text>
            </View>
            <View style={styles.actionCol}>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.iconBtn}>
                <Ionicons name="pencil" size={22} color="#1976d2" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteDepartment(item.id)} style={styles.iconBtn}>
                <Ionicons name="trash" size={22} color="#e53935" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddDepartment' as never)}>
        <Ionicons name="add-circle" size={26} color="#fff" />
        <Text style={styles.addText}>Thêm phòng ban</Text>
      </TouchableOpacity>

      {/* Modal sửa phòng ban */}
      <Modal visible={editModal} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Sửa phòng ban</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên phòng ban"
              value={editForm.name}
              onChangeText={v => setEditForm(f => ({ ...f, name: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Mã phòng ban"
              value={editForm.code}
              onChangeText={v => setEditForm(f => ({ ...f, code: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Mô tả"
              value={editForm.description}
              onChangeText={v => setEditForm(f => ({ ...f, description: v }))}
            />
            <View style={styles.activeRow}>
              <Text style={{ marginRight: 8 }}>Hoạt động:</Text>
              <TouchableOpacity
                style={[styles.activeBtn, editForm.is_active && styles.activeBtnSelected]}
                onPress={() => setEditForm(f => ({ ...f, is_active: true }))}
              >
                <Text style={{ color: editForm.is_active ? '#fff' : '#1976d2' }}>Có</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.activeBtn, !editForm.is_active && styles.activeBtnSelectedRed]}
                onPress={() => setEditForm(f => ({ ...f, is_active: false }))}
              >
                <Text style={{ color: !editForm.is_active ? '#fff' : '#e53935' }}>Không</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setEditModal(false)} style={styles.cancelBtn}>
                <Text style={{ color: '#1976d2' }}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEdit} style={styles.saveBtn}>
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
  container: { flex: 1, padding: 16, backgroundColor: '#f7fafd' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#1976d2', alignSelf: 'center' },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#1976d2',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  name: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  code: { color: '#1976d2', fontWeight: '600', fontSize: 14, marginLeft: 2 },
  desc: { color: '#555', fontSize: 13, marginBottom: 2 },
  date: { color: '#888', fontSize: 12, marginTop: 2 },
  badge: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'center',
  },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  actionCol: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#f1f6fb',
  },
  addBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#1976d2',
    elevation: 2,
    shadowColor: '#1976d2',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  addText: { color: '#fff', marginLeft: 8, fontWeight: 'bold', fontSize: 16 },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 22,
    elevation: 6,
  },
  modalHeader: { fontWeight: 'bold', fontSize: 20, color: '#1976d2', marginBottom: 18, alignSelf: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 14 : 10,
    marginBottom: 14,
    fontSize: 15,
    backgroundColor: '#f8fafc',
  },
  activeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  activeBtn: {
    borderWidth: 1,
    borderColor: '#1976d2',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 18,
    marginHorizontal: 8,
    backgroundColor: '#fff',
  },
  activeBtnSelected: {
    backgroundColor: '#1976d2',
  },
  activeBtnSelectedRed: {
    backgroundColor: '#e53935',
    borderColor: '#e53935',
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  cancelBtn: {
    padding: 12,
    marginRight: 10,
    borderRadius: 6,
    backgroundColor: '#f1f6fb',
  },
  saveBtn: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
});

export default ListDepartment;
