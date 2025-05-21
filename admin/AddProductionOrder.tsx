import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const DEFAULT_USER_ID = 'af5cdd63-3078-4f5c-98b6-4c07e5fe3d34';

const STATUSES = [
  { label: 'Đang chờ', value: 'Đang chờ' },
  { label: 'Đã duyệt', value: 'Đã duyệt' },
  { label: 'Đang sản xuất', value: 'Đang sản xuất' },
  { label: 'Hoàn thành', value: 'Hoàn thành' },
  { label: 'Đã hủy', value: 'Đã hủy' },
];

const AddProductionOrder = () => {
  const [orderCode, setOrderCode] = useState('');
  const [productId, setProductId] = useState('');
  const [products, setProducts] = useState([]);
  const [plannedQuantity, setPlannedQuantity] = useState('');
  const [actualQuantity, setActualQuantity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [requesterId, setRequesterId] = useState(DEFAULT_USER_ID);
  const [approverId, setApproverId] = useState(DEFAULT_USER_ID);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('Đang chờ');
  const [priority, setPriority] = useState('1');
  const [note, setNote] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetch('http://10.0.2.2:3000/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]));
    fetch('http://10.0.2.2:3000/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => setUsers([]));
  }, []);

  const handleAddOrder = async () => {
    if (!orderCode || !productId || !plannedQuantity) {
      Alert.alert('Lỗi', 'Mã đơn, sản phẩm và số lượng dự kiến không được để trống');
      return;
    }
    if (isNaN(Number(plannedQuantity)) || Number(plannedQuantity) <= 0) {
      Alert.alert('Lỗi', 'Số lượng dự kiến phải là số dương');
      return;
    }
    if (actualQuantity && (isNaN(Number(actualQuantity)) || Number(actualQuantity) < 0)) {
      Alert.alert('Lỗi', 'Số lượng thực tế phải là số không âm');
      return;
    }
    if (priority && (isNaN(Number(priority)) || Number(priority) < 1 || Number(priority) > 5)) {
      Alert.alert('Lỗi', 'Độ ưu tiên từ 1 đến 5');
      return;
    }
    try {
      const response = await fetch('http://10.0.2.2:3000/production-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_code: orderCode,
          product_id: productId,
          planned_quantity: Number(plannedQuantity),
          actual_quantity: actualQuantity ? Number(actualQuantity) : null,
          start_date: startDate || null,
          end_date: endDate || null,
          requester_id: requesterId,
          approver_id: approverId,
          status,
          priority: Number(priority),
          note,
          is_active: isActive,
        }),
      });
      if (response.ok) {
        Alert.alert('Thành công', 'Đã thêm lệnh sản xuất!');
        setOrderCode('');
        setProductId('');
        setPlannedQuantity('');
        setActualQuantity('');
        setStartDate('');
        setEndDate('');
        setRequesterId(DEFAULT_USER_ID);
        setApproverId(DEFAULT_USER_ID);
        setStatus('Đang chờ');
        setPriority('1');
        setNote('');
        setIsActive(true);
      } else {
        Alert.alert('Lỗi', 'Không thể thêm lệnh sản xuất');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối server');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm Lệnh Sản Xuất</Text>
      <TextInput style={styles.input} placeholder="Mã đơn sản xuất" value={orderCode} onChangeText={setOrderCode} />
      <Text style={{ marginBottom: 4 }}>Sản phẩm</Text>
      <Picker selectedValue={productId} onValueChange={setProductId} style={styles.input}>
        <Picker.Item label="Chọn sản phẩm" value="" />
        {products.map((p: any) => (
          <Picker.Item key={p.id} label={p.name} value={p.id} />
        ))}
      </Picker>
      <TextInput style={styles.input} placeholder="Số lượng dự kiến" value={plannedQuantity} onChangeText={setPlannedQuantity} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Số lượng thực tế" value={actualQuantity} onChangeText={setActualQuantity} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Ngày bắt đầu (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate} />
      <TextInput style={styles.input} placeholder="Ngày kết thúc (YYYY-MM-DD)" value={endDate} onChangeText={setEndDate} />
      <Text style={{ marginBottom: 4 }}>Người yêu cầu</Text>
      <Picker selectedValue={requesterId} onValueChange={setRequesterId} style={styles.input}>
        {users.map((u: any) => (
          <Picker.Item key={u.id} label={u.full_name || u.username} value={u.id} />
        ))}
      </Picker>
      <Text style={{ marginBottom: 4 }}>Người phê duyệt</Text>
      <Picker selectedValue={approverId} onValueChange={setApproverId} style={styles.input}>
        {users.map((u: any) => (
          <Picker.Item key={u.id} label={u.full_name || u.username} value={u.id} />
        ))}
      </Picker>
      <Text style={{ marginBottom: 4 }}>Trạng thái</Text>
      <Picker selectedValue={status} onValueChange={setStatus} style={styles.input}>
        {STATUSES.map(s => <Picker.Item key={s.value} label={s.label} value={s.value} />)}
      </Picker>
      <TextInput style={styles.input} placeholder="Độ ưu tiên (1-5)" value={priority} onChangeText={setPriority} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Ghi chú" value={note} onChangeText={setNote} />
      <TextInput
        style={styles.input}
        placeholder="Trạng thái (true/false)"
        value={isActive ? 'true' : 'false'}
        onChangeText={text => setIsActive(text === 'true')}
      />
      <Button title="Thêm Lệnh Sản Xuất" onPress={handleAddOrder} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
});

export default AddProductionOrder;