import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../theme/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'GuestDashboard'>;

const GuestDashboard: React.FC<Props> = ({ navigation }) => {
  const handleLogout = async () => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('user');
        //   navigation.replace('Login');
          navigation.replace('Login', { username: '' });
        },
      },
    ]);
  };

  const menu = [
    { label: '📦 Danh sách sản phẩm', screen: 'ViewProducts' },
    { label: '🏬 Phòng ban & đơn vị', screen: 'ViewDepartments' },
    { label: '👤 Người dùng hệ thống', screen: 'ViewUsers' },
    { label: '📘 Giới thiệu hệ thống', screen: '' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👤 Chào mừng khách truy cập</Text>

      {menu.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => {
            if (item.screen) {
              navigation.navigate(item.screen as never);
            } else {
              Alert.alert('Thông tin', 'Chức năng đang phát triển!');
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
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    marginBottom: 14,
    elevation: 2,
  },
  cardText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutBtn: {
    marginTop: 30,
    backgroundColor: COLORS.danger || '#d9534f',
    padding: 14,
    borderRadius: 6,
  },
  logoutText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GuestDashboard;
