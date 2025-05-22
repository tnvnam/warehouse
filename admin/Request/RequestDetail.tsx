import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator'; // Đảm bảo đường dẫn đúng

type RequestDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RequestDetail'
>;

const RequestDetail = () => {
  const route = useRoute();
  const navigation = useNavigation<RequestDetailNavigationProp>();
  const { id } = route.params as { id: string };

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchRequest = async () => {
    try {
      const res = await fetch(`http://10.0.2.2:3000/requests/${id}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setRequest(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải chi tiết yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`http://10.0.2.2:3000/requests/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error();
      Alert.alert('Thành công', `Yêu cầu đã được ${status === 'approved' ? 'duyệt' : 'từ chối'}`);
      navigation.navigate('ApproveRequestList');
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái yêu cầu');
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  if (!request) return <Text style={styles.error}>Không tìm thấy yêu cầu</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📄 Chi tiết phiếu yêu cầu</Text>
      <Text style={styles.item}>Loại: {request.type === 'import' ? 'Nhập kho' : 'Xuất kho'}</Text>
      <Text style={styles.item}>Phòng ban: {request.department_name || 'Không rõ'}</Text>
      <Text style={styles.item}>Nguyên vật liệu: {request.material_name || 'Không rõ'}</Text>
      <Text style={styles.item}>Kho: {request.warehouse_name || 'Không có'}</Text>
      <Text style={styles.item}>Đơn vị: {request.unit_name || 'Không rõ'}</Text>
      <Text style={styles.item}>Số lượng: {parseFloat(request.quantity).toFixed(2)}</Text>
      <Text style={styles.item}>Ngày: {request.date}</Text>
      <Text style={styles.item}>Trạng thái: {request.status}</Text>

      {request.status === 'pending' && (
        <View style={styles.buttons}>
          <Button title="✔️ Duyệt yêu cầu" onPress={() => handleUpdateStatus('approved')} />
          <View style={{ height: 10 }} />
          <Button title="❌ Từ chối yêu cầu" color="#c62828" onPress={() => handleUpdateStatus('rejected')} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#2e7d32' },
  item: { fontSize: 16, marginBottom: 8 },
  error: { fontSize: 16, color: 'red', marginTop: 100, textAlign: 'center' },
  buttons: { marginTop: 20 },
});

export default RequestDetail;
