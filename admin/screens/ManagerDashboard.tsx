import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../theme/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ManagerDashboard'>;

const ManagerDashboard: React.FC<Props> = ({ navigation }) => {
  const handleLogout = async () => {
    Alert.alert('Xác nhận', 'Bạn có muốn đăng xuất không?', [
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

  const actions = [
    { label: '📝 Phê duyệt yêu cầu nhập kho', screen: 'ApproveImportRequests' },
    { label: '📤 Phê duyệt yêu cầu xuất kho', screen: 'ApproveExportRequests' },
    { label: '👥 Quản lý nhân viên', screen: 'ManageEmployees' },
    { label: '📦 Kiểm tra kho & tồn', screen: 'InventoryOverview' },
    { label: '📊 Báo cáo & thống kê', screen: 'ReportScreen' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📋 Bảng điều khiển quản lý</Text>

      {actions.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => {
            if (item.screen) {
              navigation.navigate(item.screen as never);
            } else {
              Alert.alert('Thông báo', 'Chức năng đang cập nhật');
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

export default ManagerDashboard;
