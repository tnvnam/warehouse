import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const DEFAULT_USER_ID = 'af5cdd63-3078-4f5c-98b6-4c07e5fe3d34';

const AddWarehouse = () => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [warehouses, setWarehouses] = useState([]);
  const [address, setAddress] = useState('');
  const [managerId, setManagerId] = useState(DEFAULT_USER_ID);
  const [users, setUsers] = useState([]);
  const [note, setNote] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Lấy danh sách kho cha và user quản lý
  useEffect(() => {
    fetch('http://10.0.2.2:3000/warehouses')
      .then(res => res.json())
      .then(data => setWarehouses(data))
      .catch(() => setWarehouses([]));
    fetch('http://10.0.2.2:3000/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => setUsers([]));
  }, []);

  const handleAddWarehouse = async () => {
    if (!code || !name) {
      Alert.alert('Lỗi', 'Mã kho và tên kho không được để trống');
      return;
    }
    try {
      const response = await fetch('http://10.0.2.2:3000/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          name,
          parent_id: parentId || null,
          address,
          manager_id: managerId,
          note,
          is_active: isActive,
          created_by: DEFAULT_USER_ID,
        }),
      });
      if (response.ok) {
        Alert.alert('Thành công', 'Đã thêm kho mới!');
        setCode('');
        setName('');
        setParentId('');
        setAddress('');
        setManagerId(DEFAULT_USER_ID);
        setNote('');
        setIsActive(true);
      } else {
        Alert.alert('Lỗi', 'Không thể thêm kho');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối server');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm Kho</Text>
      <TextInput style={styles.input} placeholder="Mã kho" value={code} onChangeText={setCode} />
      <TextInput style={styles.input} placeholder="Tên kho" value={name} onChangeText={setName} />
      <Text style={{ marginBottom: 4 }}>Kho cha (nếu là kho nhỏ)</Text>
      <Picker selectedValue={parentId} onValueChange={setParentId} style={styles.input}>
        <Picker.Item label="Không chọn (kho lớn)" value="" />
        {warehouses.map((w: any) => (
          <Picker.Item key={w.id} label={w.name} value={w.id} />
        ))}
      </Picker>
      <TextInput style={styles.input} placeholder="Địa chỉ kho" value={address} onChangeText={setAddress} />
      <Text style={{ marginBottom: 4 }}>Người quản lý</Text>
      <Picker selectedValue={managerId} onValueChange={setManagerId} style={styles.input}>
        {users.map((u: any) => (
          <Picker.Item key={u.id} label={u.full_name || u.username} value={u.id} />
        ))}
      </Picker>
      <TextInput style={styles.input} placeholder="Ghi chú" value={note} onChangeText={setNote} />
      <TextInput
        style={styles.input}
        placeholder="Trạng thái (true/false)"
        value={isActive ? 'true' : 'false'}
        onChangeText={text => setIsActive(text === 'true')}
      />
      <Button title="Thêm Kho" onPress={handleAddWarehouse} />
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

export default AddWarehouse;