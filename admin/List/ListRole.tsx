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
  Switch, // Thêm Switch cho status
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: Record<string, any>; // Kiểu JSONB, có thể là object
  status?: string; // 'active', 'inactive', etc.
  created_at: string; // Mặc định có từ DB
  updated_at: string; // Mặc định có từ DB
}

const ListRole = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    status: 'active', // Mặc định là active
    // permissions sẽ không chỉnh sửa trực tiếp trong form đơn giản này
  });

  const API_URL = 'http://10.0.2.2:3000/roles';

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Không thể tải danh sách vai trò');
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      Alert.alert('Lỗi', (err as Error).message || 'Đã xảy ra lỗi không xác định.');
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa vai trò này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (res.ok) {
              setRoles(prev => prev.filter(r => r.id !== id));
              Alert.alert('Thành công', 'Đã xóa vai trò');
            } else {
              const errorData = await res.json().catch(() => ({ message: 'Không thể xóa vai trò.' }));
              Alert.alert('Lỗi', errorData.message);
            }
          } catch {
            Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ.');
          }
        },
      },
    ]);
  };

  const openEditModal = (role: Role) => {
    setCurrentRole(role);
    setEditForm({
      name: role.name,
      description: role.description || '',
      status: role.status || 'active', // Lấy status từ role, mặc định 'active'
    });
    setIsEditModalVisible(true);
  };

  const handleUpdateRole = async () => {
    if (!currentRole) return;
    try {
      const payload = {
        name: editForm.name,
        description: editForm.description,
        status: editForm.status,
        // permissions không được gửi nếu không chỉnh sửa ở đây
      };
      const res = await fetch(`${API_URL}/${currentRole.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updatedRoleFromServer = await res.json();
        setRoles(prevRoles =>
          prevRoles.map(role =>
            role.id === currentRole.id ? { ...role, ...updatedRoleFromServer } : role
          )
        );
        setIsEditModalVisible(false);
        setCurrentRole(null);
        Alert.alert('Thành công', 'Đã cập nhật vai trò.');
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Không thể cập nhật vai trò.' }));
        Alert.alert('Lỗi', errorData.message);
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ.');
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const renderStatusBadge = (status: string | undefined) => {
    const isActive = status === 'active';
    return (
      <View style={[styles.badge, { backgroundColor: isActive ? '#4caf50' : '#f44336' }]}>
        <Text style={styles.badgeText}>{isActive ? 'Hoạt động' : 'Ngừng'}</Text>
      </View>
    );
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
    } catch (e) {
      return 'N/A';
    }
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách Vai trò</Text>
      <FlatList
        data={roles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Ionicons name="key-outline" size={20} color="#1976d2" style={{ marginRight: 8 }} />
                <Text style={styles.name}>{item.name}</Text>
                {renderStatusBadge(item.status)}
              </View>
              <Text style={styles.desc} numberOfLines={2}>
                Mô tả: {item.description || '(Không có)'}
              </Text>
              <Text style={styles.infoText}>
                <Ionicons name="shield-checkmark-outline" size={14} color="#888" /> Quyền: {' '}
                {item.permissions && Object.keys(item.permissions).length > 0
                  ? `${Object.keys(item.permissions).length} quyền`
                  : 'Chưa gán'}
              </Text>
              <Text style={styles.infoText}>
                <Ionicons name="calendar-outline" size={14} color="#888" /> Tạo: {formatDate(item.created_at)}
              </Text>
              <Text style={styles.infoText}>
                <Ionicons name="refresh-circle-outline" size={14} color="#888" /> Cập nhật: {formatDate(item.updated_at)}
              </Text>
            </View>
            <View style={styles.actionCol}>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.iconBtn}>
                <Ionicons name="pencil" size={22} color="#1976d2" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteRole(item.id)} style={styles.iconBtn}>
                <Ionicons name="trash" size={22} color="#e53935" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có vai trò nào.</Text>}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddRole' as never)}>
        <Ionicons name="add-circle" size={26} color="#fff" />
        <Text style={styles.addText}>Thêm Vai trò</Text>
      </TouchableOpacity>

      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setIsEditModalVisible(false);
          setCurrentRole(null);
        }}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Sửa Vai Trò</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên vai trò"
              value={editForm.name}
              onChangeText={(text) => setEditForm(f => ({ ...f, name: text }))}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Mô tả (không bắt buộc)"
              value={editForm.description}
              onChangeText={(text) => setEditForm(f => ({ ...f, description: text }))}
              multiline
              numberOfLines={3}
            />
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Trạng thái hoạt động:</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={editForm.status === 'active' ? "#1976d2" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() =>
                  setEditForm(f => ({ ...f, status: f.status === 'active' ? 'inactive' : 'active' }))
                }
                value={editForm.status === 'active'}
              />
            </View>
            {/* Permissions không chỉnh sửa ở đây, có thể hiển thị nếu cần */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => {
                  setIsEditModalVisible(false);
                  setCurrentRole(null);
                }}
                style={styles.cancelBtn}
              >
                <Text style={{ color: '#1976d2' }}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpdateRole} style={styles.saveBtn}>
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7fafd' },
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
  name: { fontWeight: 'bold', fontSize: 16, color: '#222', flexShrink: 1, marginRight: 8 }, // Cho phép co lại nếu tên dài
  desc: { color: '#555', fontSize: 13, marginTop: 4, marginBottom: 6 },
  infoText: { color: '#666', fontSize: 12, marginBottom: 3, flexDirection: 'row', alignItems: 'center' },
  badge: {
    marginLeft: 'auto', // Đẩy badge sang phải
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12, // Bo tròn hơn
    alignSelf: 'flex-start', // Căn badge với dòng tên
  },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  actionCol: { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', marginLeft: 10, paddingTop: 4 },
  iconBtn: {
    padding: 8, // Tăng padding
    borderRadius: 20, // Bo tròn hơn
    marginBottom: 8,
    backgroundColor: '#f0f4fa', // Màu nền nhẹ hơn
  },
  addBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25, // Bo tròn hơn
    backgroundColor: '#1976d2',
    elevation: 3,
    shadowColor: '#1976d2',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  addText: { color: '#fff', marginLeft: 10, fontWeight: 'bold', fontSize: 17 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#6c757d' },

  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)', // Tăng độ mờ
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 16, // Bo tròn hơn
    padding: 25, // Tăng padding
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  modalHeader: { fontWeight: 'bold', fontSize: 21, color: '#1976d2', marginBottom: 20, alignSelf: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#dce4f0', // Màu border nhẹ hơn
    borderRadius: 10, // Bo tròn hơn
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 14 : 11,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f8fafc', // Màu nền input
    color: '#333',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  switchRow: { // Style cho dòng chứa Switch
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 5,
  },
  switchLabel: { // Style cho nhãn của Switch
    fontSize: 16,
    color: '#333',
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#e9edf2', // Màu nút hủy
  },
  saveBtn: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
});

export default ListRole;
