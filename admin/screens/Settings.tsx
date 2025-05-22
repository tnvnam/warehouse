import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../AppNavigator';
import COLORS from '../../theme/theme';

const Settings = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [user, setUser] = useState<any>(null);

  const loadUser = async () => {
    const stored = await AsyncStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  };

  useEffect(() => {
    loadUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [])
  );

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const renderItem = (icon: string, label: string, onPress?: () => void) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Ionicons name={icon} size={20} color={COLORS.primary} style={{ width: 30 }} />
      <Text style={styles.itemText}>{label}</Text>
    </TouchableOpacity>
  );

  const getRoleName = (roleId: string): string => {
    switch (roleId) {
      case '148fa076-70da-40c0-9c83-4ea2004b39cb':
        return 'Admin';
      case '1ef47567-49f8-41ed-8d22-138d5ae68ccd':
        return 'Quản lý kho';
      case '8b79a84f-436c-4dd8-9c6e-2266b94dc379':
        return 'Nhân viên';
      case '3af49502-a14f-4e95-ba8f-c41975ebcdb6':
        return 'Khách';
      default:
        return 'Không rõ';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header thông tin người dùng */}
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={48} color={COLORS.primary} />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.name}>{user?.full_name || 'Người dùng'}</Text>
          <Text style={styles.phone}>
            {getRoleName(user?.role_id)} | {user?.email || ''}
          </Text>
        </View>
      </View>

      <Text style={styles.section}>Tài khoản</Text>
      {renderItem('lock-closed-outline', 'Đổi mật khẩu', () => navigation.navigate('ChangePassword'))}
      {renderItem('person-outline', 'Thông tin cá nhân', () => navigation.navigate('UserProfile'))}

      <Text style={styles.section}>Hiển thị</Text>
      {renderItem('contrast-outline', 'Chế độ sáng/tối')}
      {renderItem('language-outline', 'Ngôn ngữ')}

      <Text style={styles.section}>Khác</Text>
      {renderItem('document-text-outline', 'Chính sách & Điều khoản')}
      {renderItem('help-circle-outline', 'Liên hệ hỗ trợ')}

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.white },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  name: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  phone: { color: COLORS.gray, fontSize: 14 },
  section: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '600',
    color: COLORS.primary,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 15,
    color: COLORS.text,
  },
  logoutBtn: {
    marginTop: 40,
    backgroundColor: '#e63946',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Settings;
