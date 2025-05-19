import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';

const AddUnit = () => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAddUnit = async () => {
    if (!code || !name) {
      Alert.alert('Lỗi', 'Mã đơn vị và tên đơn vị không được để trống');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:3000/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          name,
          description,
        }),
      });
      if (response.ok) {
        Alert.alert('Thành công', 'Đã thêm đơn vị mới!');
        setCode('');
        setName('');
        setDescription('');
      } else {
        Alert.alert('Lỗi', 'Không thể thêm đơn vị');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối server');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm Đơn Vị Tính</Text>
      <TextInput
        style={styles.input}
        placeholder="Mã đơn vị (ví dụ: kg, m2, thung)"
        value={code}
        onChangeText={setCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Tên đơn vị (ví dụ: Kilogram, Mét vuông, Thùng)"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mô tả"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Thêm Đơn Vị" onPress={handleAddUnit} />
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

export default AddUnit;