import React, { useState, useCallback } from 'react';
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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';

interface RequestItem {
  id: string;
  type: 'import' | 'export';
  status: 'pending' | 'approved' | 'rejected';
  department_name: string;
  unit_name: string;
  date: string;
}

const ApproveRequestList = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/requests');
      const result = await res.json();

      const pending = result.filter((r: RequestItem) => r.status === 'pending');
      console.log('✅ Danh sách yêu cầu chờ duyệt:', pending); // Debug
      setRequests(pending);
    } catch (error) {
      console.error('❌ Lỗi khi tải danh sách:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách phiếu');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchRequests();
    }, [])
  );

  const renderItem = ({ item }: { item: RequestItem }) => {
    const icon = item.type === 'import' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline';
    const color = item.type === 'import' ? '#28a745' : '#dc3545';

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          console.log('👉 Chọn yêu cầu ID:', item.id); // Debug
          navigation.navigate('RequestDetail', { id: item.id });
        }}
      >
        <Ionicons name={icon} size={24} color={color} style={styles.icon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.type === 'import' ? 'Nhập kho' : 'Xuất kho'}</Text>
          <Text style={styles.meta}>Phòng ban: {item.department_name}</Text>
          <Text style={styles.meta}>Đơn vị tính: {item.unit_name}</Text>
          <Text style={styles.meta}>Ngày: {item.date} | Trạng thái: Chờ duyệt</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📥 Duyệt yêu cầu</Text>
      {requests.length === 0 ? (
        <Text style={styles.meta}>Không có yêu cầu chờ duyệt.</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#2e7d32' },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#ffb74d',
    borderWidth: 1,
  },
  icon: { marginRight: 12, marginTop: 4 },
  title: { fontWeight: '600', fontSize: 16, color: '#f57c00' },
  meta: { color: '#444', fontSize: 13 },
});

export default ApproveRequestList;
