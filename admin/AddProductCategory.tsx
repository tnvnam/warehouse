import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';

const AddProductCategory = () => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleAddCategory = async () => {
    if (!code || !name) {
      Alert.alert('Lỗi', 'Mã danh mục và tên danh mục không được để trống');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:3000/product-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          name,
          description,
          is_active: isActive,
        }),
      });
      if (response.ok) {
        Alert.alert('Thành công', 'Đã thêm danh mục sản phẩm mới!');
        setCode('');
        setName('');
        setDescription('');
        setIsActive(true);
      } else {
        Alert.alert('Lỗi', 'Không thể thêm danh mục sản phẩm');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối server');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm Danh Mục Sản Phẩm</Text>
      <TextInput
        style={styles.input}
        placeholder="Mã danh mục"
        value={code}
        onChangeText={setCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Tên danh mục"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mô tả"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Trạng thái (true/false)"
        value={isActive ? 'true' : 'false'}
        onChangeText={text => setIsActive(text === 'true')}
      />
      <Button title="Thêm Danh Mục" onPress={handleAddCategory} />
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

export default AddProductCategory;