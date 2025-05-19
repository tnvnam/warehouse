import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Department {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
}

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [roleId, setRoleId] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    fetch('http://10.0.2.2:3000/departments')
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(() => setDepartments([]));
    fetch('http://10.0.2.2:3000/roles')
      .then(res => res.json())
      .then(data => setRoles(data))
      .catch(() => setRoles([]));
  }, []);

  const handleAddUser = async () => {
    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Email không đúng định dạng.');
      return;
    }
    // Kiểm tra số điện thoại 10 số
    const phoneRegex = /^\d{10}$/;
    if (phone && !phoneRegex.test(phone)) {
      Alert.alert('Lỗi', 'Số điện thoại phải gồm đúng 10 chữ số.');
      return;
    }
    if (!username || !password) {
      Alert.alert('Lỗi', 'Tên đăng nhập và mật khẩu không được để trống');
      return;
    }
    try {
      const response = await fetch('http://10.0.2.2:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          full_name: fullName,
          email,
          phone,
          department_id: departmentId,
          role_id: roleId,
          is_active: isActive,
        }),
      });
      if (response.ok) {
        Alert.alert('Thành công', 'Đã thêm người dùng mới!');
        setUsername('');
        setPassword('');
        setFullName('');
        setEmail('');
        setPhone('');
        setDepartmentId('');
        setRoleId('');
        setIsActive(true);
      } else {
        Alert.alert('Lỗi', 'Không thể thêm người dùng');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối server');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm Người Dùng</Text>
      <TextInput style={styles.input} placeholder="Tên đăng nhập" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Họ tên" value={fullName} onChangeText={setFullName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Số điện thoại" value={phone} onChangeText={setPhone} />

      <Text style={{ marginBottom: 4 }}>Phòng ban</Text>
      <Picker
        selectedValue={departmentId}
        onValueChange={setDepartmentId}
        style={styles.input}
      >
        <Picker.Item label="Chọn phòng ban" value="" />
        {departments.map(dep => (
          <Picker.Item key={dep.id} label={dep.name} value={dep.id} />
        ))}
      </Picker>

      <Text style={{ marginBottom: 4 }}>Vai trò</Text>
      <Picker
        selectedValue={roleId}
        onValueChange={setRoleId}
        style={styles.input}
      >
        <Picker.Item label="Chọn vai trò" value="" />
        {roles.map(role => (
          <Picker.Item key={role.id} label={role.name} value={role.id} />
        ))}
      </Picker>

      <TextInput style={styles.input} placeholder="Trạng thái (true/false)" value={isActive ? 'true' : 'false'} onChangeText={text => setIsActive(text === 'true')} />
      <Button title="Thêm Người Dùng" onPress={handleAddUser} />
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

export default AddUser;