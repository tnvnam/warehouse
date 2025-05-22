import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'RequestList'>;

interface RequestItem {
  id: string;
  type: 'import' | 'export';
  status: 'pending' | 'approved' | 'rejected';
  department_name: string;
  date: string;
}

const RequestList = () => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://10.0.2.2:3000/requests');
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải danh sách yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Tự động gọi lại khi quay lại màn hình
  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [])
  );

  const translateStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  const renderItem = ({ item }: { item: RequestItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('RequestDetail', { id: item.id })}
    >
      <Ionicons
        name={item.type === 'import' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'}
        size={24}
        color={item.type === 'import' ? '#007bff' : 'orange'}
        style={styles.icon}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>
          Phiếu {item.type === 'import' ? 'nhập' : 'xuất'} - {item.department_name}
        </Text>
        <Text style={styles.meta}>
          Ngày: {item.date} | Trạng thái: {translateStatus(item.status)}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#888" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📑 Danh sách phiếu yêu cầu</Text>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 100 }} />
      ) : requests.length === 0 ? (
        <Text style={styles.empty}>Không có phiếu yêu cầu nào.</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('RequestForm')}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addText}>Tạo yêu cầu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc', padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#2e7d32' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: { marginRight: 12 },
  title: { fontWeight: '600', fontSize: 16, color: '#1b5e20' },
  meta: { color: '#555', fontSize: 13, marginTop: 4 },
  addBtn: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#43a047',
  },
  addText: { color: '#fff', marginLeft: 6, fontWeight: '600', fontSize: 15 },
  empty: { textAlign: 'center', color: '#888', marginTop: 40, fontSize: 14 },
});

export default RequestList;
