import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../AppNavigator';
import COLORS from '../../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation, route }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  useEffect(() => {
    if (route.params?.username) {
      setUsername(route.params.username);
      setTimeout(() => {
        passwordRef.current?.focus();
      }, 300);
    }
  }, [route.params]);

  const getPermissionsByRole = (roleId: string) => {
    switch (roleId) {
      case '148fa076-70da-40c0-9c83-4ea2004b39cb': // Admin
        return ['view', 'edit', 'delete', 'add'];
      case '1ef47567-49f8-41ed-8d22-138d5ae68ccd': // Manager
        return ['view', 'edit', 'add'];
      case '8b79a84f-436c-4dd8-9c6e-2266b94dc379': // Employee
        return ['add', 'view'];
      case '3af49502-a14f-4e95-ba8f-c41975ebcdb6': // Guest
      default:
        return ['view'];
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://192.168.1.4:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        const permissions = getPermissionsByRole(data.user.role_id);
        const fullUser = { ...data.user, permissions };
        await AsyncStorage.setItem('user', JSON.stringify(fullUser));
        Alert.alert('✅ Thành công', 'Đăng nhập thành công!');
        navigation.navigate('MainTabs');
      } else {
        Alert.alert('Lỗi', data.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert('Lỗi', 'Không thể kết nối máy chủ');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          ref={passwordRef}
          style={styles.passwordInput}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureText}
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Ionicons
            name={secureText ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={COLORS.gray}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>Đăng nhập</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerLink}>
          Bạn chưa có tài khoản? <Text style={{ fontWeight: '600' }}>Đăng ký</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: COLORS.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 48,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
    color: COLORS.text,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  registerLink: {
    textAlign: 'center',
    color: COLORS.primary,
  },
});

export default LoginScreen;
