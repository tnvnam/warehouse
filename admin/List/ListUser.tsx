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
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '..//AppNavigator';

interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  phone?: string;
  department_id?: string;
  role_id?: string;
  department_name?: string; // Thêm trường này
  role_name?: string;       // Thêm trường này
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

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

const renderStatusBadge = (isActive: boolean) => (
  <View style={[styles.badge, { backgroundColor: isActive ? '#4caf50' : '#f44336' }]}>
    <Text style={styles.badgeText}>{isActive ? 'Hoạt động' : 'Ngừng'}</Text>
  </View>
);

const ListUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/users');
      const data = await res.json();
      setUsers(data);
    } catch {
      Alert.alert('Lỗi', 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa người dùng này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa', onPress: async () => {
          try {
            const res = await fetch(`http://10.0.2.2:3000/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
              setUsers(prev => prev.filter(u => u.id !== id));
              Alert.alert('Thành công', 'Đã xóa người dùng');
            } else {
              Alert.alert('Lỗi', 'Không thể xóa người dùng');
            }
          } catch {
            Alert.alert('Lỗi', 'Không thể kết nối server');
          }
        }
      }
    ]);
  };

  useEffect(() => { fetchUsers(); }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách người dùng</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <View style={styles.row}>
                <Ionicons name="person-circle-outline" size={22} color="#1976d2" style={{ marginRight: 8 }} />
                <Text style={styles.name}>{item.full_name || item.username}</Text>
                {renderStatusBadge(item.is_active)}
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="finger-print-outline" size={16} color="#888" />
                <Text style={styles.infoText}>{item.username}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="at-outline" size={16} color="#888" />
                <Text style={styles.infoText}>{item.email}</Text>
              </View>
              {item.phone ? (
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={16} color="#888" />
                  <Text style={styles.infoText}>{item.phone}</Text>
                </View>
              ) : null}
              <View style={styles.infoRow}>
                <Ionicons name="business-outline" size={16} color="#888" />
                <Text style={styles.infoText}>
                  Phòng ban: {item.department_name || 'N/A'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="key-outline" size={16} color="#888" />
                <Text style={styles.infoText}>
                  Vai trò: {item.role_name || 'N/A'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color="#888" />
                <Text style={styles.infoText}>Tạo: {formatDate(item.created_at)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="refresh-circle-outline" size={16} color="#888" />
                <Text style={styles.infoText}>Cập nhật: {formatDate(item.updated_at)}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => deleteUser(item.id)} style={styles.iconBtn}>
              <Ionicons name="trash" size={20} color="#e53935" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có người dùng nào.</Text>}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddUser' as never)}>
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.addText}>Thêm người dùng</Text>
      </TouchableOpacity>
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
    elevation: 2,
    shadowColor: '#1976d2',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  name: { fontWeight: 'bold', fontSize: 16, color: '#222', flex: 1 },
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
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#1976d2',
    elevation: 2,
  },
  addText: { color: '#fff', marginLeft: 10, fontWeight: 'bold', fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#6c757d' },
});

export default ListUser;