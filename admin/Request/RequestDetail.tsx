import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface RequestDetailData {
  id: string;
  type: 'import' | 'export';
  status: 'pending' | 'approved' | 'rejected';
  department_name: string;
  date: string;
  items: {
    material_name: string;
    quantity: number;
    unit_name: string;
  }[];
}

const RequestDetail = () => {
  const [request, setRequest] = useState<RequestDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const navigation = useNavigation();
  const { id }: any = route.params;

  const fetchDetail = async () => {
    try {
      const res = await fetch(`http://10.0.2.2:3000/requests/${id}`);
      const data = await res.json();
      setRequest(data);
    } catch {
      Alert.alert('Lỗi', 'Không thể tải chi tiết phiếu yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const res = await fetch(`http://10.0.2.2:3000/requests/${id}/approve`, { method: 'PUT' });
      if (res.ok) {
        Alert.alert('Thành công', 'Đã duyệt phiếu');
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', 'Không thể duyệt');
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể kết nối server');
    }
  };

  const handleReject = async () => {
    try {
      const res = await fetch(`http://10.0.2.2:3000/requests/${id}/reject`, { method: 'PUT' });
      if (res.ok) {
        Alert.alert('Đã từ chối phiếu');
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', 'Không thể từ chối');
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể kết nối server');
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  if (loading || !request) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chi tiết phiếu {request.type === 'import' ? 'nhập' : 'xuất'}</Text>
      <Text style={styles.label}>Phòng ban: {request.department_name}</Text>
      <Text style={styles.label}>Ngày yêu cầu: {request.date}</Text>
      <Text style={styles.label}>Trạng thái: {request.status}</Text>
      <Text style={styles.subHeader}>Danh sách vật tư</Text>

      {request.items.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.itemText}>{item.material_name}</Text>
          <Text style={styles.itemText}>SL: {item.quantity} {item.unit_name}</Text>
        </View>
      ))}

      {request.status === 'pending' && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.approveBtn} onPress={handleApprove}>
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.btnText}>Duyệt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectBtn} onPress={handleReject}>
            <Ionicons name="close" size={20} color="#fff" />
            <Text style={styles.btnText}>Từ chối</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  label: { fontSize: 14, marginBottom: 4 },
  subHeader: { fontWeight: '600', marginTop: 10, marginBottom: 6 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f1f1f1',
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  itemText: { fontSize: 14 },
  actionRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-around',
  },
  approveBtn: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rejectBtn: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnText: { color: '#fff', marginLeft: 6, fontWeight: '600' },
});

export default RequestDetail;
