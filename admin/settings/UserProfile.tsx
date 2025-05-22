import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../theme/theme';

const UserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setFullName(parsed.full_name || '');
        setEmail(parsed.email || '');
        setPhone(parsed.phone || '');
      }
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    if (!fullName || !email) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      const res = await fetch(`http://10.0.2.2:3000/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, phone }),
      });
      const result = await res.json();

      if (res.ok) {
        Alert.alert('Thành công', 'Đã cập nhật thông tin cá nhân');
        const updatedUser = { ...user, full_name: fullName, email, phone };
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        Alert.alert('Lỗi', result.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thông tin cá nhân</Text>

      <TextInput
        placeholder="Họ và tên"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Số điện thoại"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Lưu thay đổi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserProfile;
