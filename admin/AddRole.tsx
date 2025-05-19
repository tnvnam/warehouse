import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const PERMISSIONS = [
  { label: 'Xem', value: 'view' },
  { label: 'Sửa', value: 'edit' },
  { label: 'Xóa', value: 'delete' },
  { label: 'Thêm', value: 'add' },
];

const AddRole = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [status, setStatus] = useState('active');

  const togglePermission = (value: string) => {
    setSelectedPermissions(prev =>
      prev.includes(value)
        ? prev.filter(p => p !== value)
        : [...prev, value]
    );
  };

  const handleAddRole = async () => {
    if (!name) {
      Alert.alert('Lỗi', 'Tên vai trò không được để trống');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:3000/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          permissions: { permissions: selectedPermissions }, // hoặc đổi thành object phù hợp
          status,
        }),
      });
      if (response.ok) {
        Alert.alert('Thành công', 'Đã thêm vai trò mới!');
        setName('');
        setDescription('');
        setSelectedPermissions([]);
        setStatus('active');
      } else {
        Alert.alert('Lỗi', 'Không thể thêm vai trò');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối server');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm Vai Trò</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên vai trò"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mô tả"
        value={description}
        onChangeText={setDescription}
      />
      <Text style={{ marginBottom: 8, fontWeight: 'bold' }}>Chọn quyền:</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
        {PERMISSIONS.map((perm) => (
          <TouchableOpacity
            key={perm.value}
            style={[
              styles.checkbox,
              selectedPermissions.includes(perm.value) && styles.checkboxSelected,
            ]}
            onPress={() => togglePermission(perm.value)}
          >
            <Text style={{ color: selectedPermissions.includes(perm.value) ? '#fff' : '#333' }}>
              {perm.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Trạng thái (active/inactive)"
        value={status}
        onChangeText={setStatus}
      />
      <Button title="Thêm Vai Trò" onPress={handleAddRole} />
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
  checkbox: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  checkboxSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
});

export default AddRole;