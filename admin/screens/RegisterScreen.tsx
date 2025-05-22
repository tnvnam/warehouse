import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  ActivityIndicator, KeyboardAvoidingView, TouchableOpacity, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLORS from '../../theme/theme';
import { Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

interface Department { id: string; name: string; }
interface Role { id: string; name: string; }

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    full_name: '',
    email: '',
    phone: '',
    department_id: '',
    role_id: '',
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const passwordRef = useRef<TextInput>(null);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const fetchOptions = async () => {
    try {
      const depRes = await fetch('http://192.168.1.4:3000/departments');
      const roleRes = await fetch('http://192.168.1.4:3000/roles');
      const deps = await depRes.json();
      const rolesData = await roleRes.json();
      setDepartments(deps);
      setRoles(rolesData);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải dữ liệu phòng ban và vai trò.');
    }
  };

  useEffect(() => { fetchOptions(); }, []);

  const handleRegister = async () => {
    const { username, password, full_name, email, phone, department_id, role_id } = form;
    if (!username || !password || !full_name || !email || !phone || !department_id || !role_id) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://192.168.1.4:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, is_active: true }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        Alert.alert('✅ Thành công', 'Tạo tài khoản thành công!', [
          {
            text: 'Đăng nhập ngay',
            onPress: () => navigation.replace('Login', { username: form.username })
          }
        ]);
      } else {
        Alert.alert('Lỗi', data.error || 'Đăng ký thất bại');
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Đăng ký tài khoản</Text>

        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          value={form.username}
          onChangeText={(v) => handleChange('username', v)}
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            ref={passwordRef}
            style={styles.passwordInput}
            placeholder="Mật khẩu"
            secureTextEntry={secureText}
            value={form.password}
            onChangeText={(v) => handleChange('password', v)}
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <Ionicons name={secureText ? 'eye-off-outline' : 'eye-outline'} size={22} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          value={form.full_name}
          onChangeText={(v) => handleChange('full_name', v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(v) => handleChange('email', v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(v) => handleChange('phone', v)}
        />

        <Text style={styles.label}>Phòng ban</Text>
        <Picker
          selectedValue={form.department_id}
          onValueChange={(v) => handleChange('department_id', v)}
          style={styles.picker}
        >
          <Picker.Item label="-- Chọn phòng ban --" value="" />
          {departments.map(dep => (
            <Picker.Item key={dep.id} label={dep.name} value={dep.id} />
          ))}
        </Picker>

        <Text style={styles.label}>Vai trò</Text>
        <Picker
          selectedValue={form.role_id}
          onValueChange={(v) => handleChange('role_id', v)}
          style={styles.picker}
        >
          <Picker.Item label="-- Chọn vai trò --" value="" />
          {roles.map(role => (
            <Picker.Item key={role.id} label={role.name} value={role.id} />
          ))}
        </Picker>

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Đăng ký</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace('Login', { username: form.username })}>
        <Text style={styles.loginLink}>
            Đã có tài khoản? <Text style={{ fontWeight: 'bold' }}>Đăng nhập</Text>
        </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: COLORS.white,
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    color: COLORS.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 14,
    backgroundColor: COLORS.white,
    color: COLORS.text,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 14,
  },
  passwordInput: {
    flex: 1,
    color: COLORS.text,
  },
  picker: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 6,
    marginBottom: 20,
    backgroundColor: COLORS.white,
  },
  label: {
    marginBottom: 4,
    color: COLORS.primary,
    fontWeight: '600',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  loginLink: {
  marginTop: 16,
  textAlign: 'center',
  color: COLORS.primary,
},
});

export default RegisterScreen;
