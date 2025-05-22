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
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';

interface RequestItem {
  id: string;
  type: 'import' | 'export';
  status: 'pending' | 'approved' | 'rejected';
  department_name: string;
  date: string;
  unit: string;
}

const RequestList = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://10.0.2.2:3000/requests');
      const result = await res.json();
      setRequests(result);
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách phiếu');
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa phiếu này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`http://10.0.2.2:3000/stock/delete/${id}`, {
              method: 'DELETE',
            });
            if (res.status === 204) {
              Alert.alert('Thành công', 'Đã xóa phiếu');
              fetchRequests();
            } else {
              throw new Error();
            }
          } catch {
            Alert.alert('Lỗi', 'Không thể xóa phiếu');
          }
        },
      },
    ]);
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  const renderItem = ({ item }: { item: RequestItem }) => {
    const icon = item.type === 'import' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline';
    const color = item.type === 'import' ? '#28a745' : '#dc3545';

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('RequestDetail', { id: item.id })}
        onLongPress={() => deleteRequest(item.id)}
      >
        <Ionicons name={icon} size={24} color={color} style={styles.icon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.type === 'import' ? 'Nhập kho' : 'Xuất kho'}</Text>
          <Text style={styles.meta}>Phòng ban: {item.department_name}</Text>
          <Text style={styles.meta}>Đơn vị tính: {item.unit}</Text>
          <Text style={styles.meta}>Ngày: {item.date} | Trạng thái: {translateStatus(item.status)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [route])
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📄 Danh sách phiếu yêu cầu</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RequestForm')}>
        <Text style={styles.buttonText}>➕ Tạo yêu cầu mới</Text>
      </TouchableOpacity>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
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
  button: {
    marginBottom: 16,
    backgroundColor: '#388e3c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default RequestList;
