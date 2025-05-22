import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../theme/theme';

const ChangePassword = ({ navigation }: any) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert('Lỗi', 'Mật khẩu mới không khớp');
    }

    try {
      const stored = await AsyncStorage.getItem('user');
      const user = stored ? JSON.parse(stored) : null;
      if (!user) throw new Error('Không tìm thấy người dùng');

      const res = await fetch(`http://10.0.2.2:3000/users/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        Alert.alert('Thành công', 'Đã đổi mật khẩu');
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', result.message || 'Đổi mật khẩu thất bại');
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể đổi mật khẩu');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Đổi mật khẩu</Text>

      <TextInput
        placeholder="Mật khẩu hiện tại"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
        style={styles.input}
      />

      <TextInput
        placeholder="Mật khẩu mới"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
      />

      <TextInput
        placeholder="Xác nhận mật khẩu mới"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Xác nhận</Text>
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

export default ChangePassword;
