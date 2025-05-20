import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../theme/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminDashboard'>;

const AdminDashboard: React.FC<Props> = ({ navigation }) => {
  const handleLogout = async () => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('user');
          navigation.replace('Login', { username: '' });
        },
      },
    ]);
  };

  const buttons = [
    { label: '📁 Quản lý danh mục sản phẩm', screen: 'AddProductCategory' },
    { label: '🏬 Quản lý phòng ban', screen: 'AddDepartment' },
    { label: '📦 Quản lý đơn vị tính', screen: 'AddUnit' },
    { label: '🧑‍💼 Quản lý vai trò', screen: 'AddRole' },
    { label: '👤 Quản lý người dùng', screen: 'AddUser' },
    { label: '🧾 Báo cáo tổng quan (sắp có)', screen: '' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎛 Trang quản trị</Text>

      {buttons.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => {
            if (item.screen) {
              navigation.navigate(item.screen as never); // 👈 optional cast nếu cần
            } else {
              Alert.alert('Thông báo', 'Chức năng đang phát triển!');
            }
          }}
        >
          <Text style={styles.cardText}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.primary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 14,
    elevation: 3,
  },
  cardText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  logoutBtn: {
    marginTop: 30,
    padding: 14,
    backgroundColor: COLORS.danger || '#dc3545',
    borderRadius: 6,
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default AdminDashboard;
