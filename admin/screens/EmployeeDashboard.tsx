import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../theme/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'EmployeeDashboard'>;

const EmployeeDashboard: React.FC<Props> = ({ navigation }) => {
  const handleLogout = async () => {
    Alert.alert('Xác nhận', 'Bạn muốn đăng xuất?', [
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
    { label: '📦 Xem danh sách sản phẩm', screen: 'ViewProducts' },
    { label: '📝 Tạo yêu cầu nhập kho', screen: 'CreateStockRequest' },
    { label: '📋 Danh sách yêu cầu của tôi', screen: 'MyRequests' },
    { label: '🔍 Kiểm tra tồn kho', screen: 'InventoryCheck' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👨‍🔧 Nhân viên kho</Text>

      {actions.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => {
            if (item.screen) {
              navigation.navigate(item.screen as never); // hoặc dùng type-safe nếu bạn có định nghĩa
            } else {
              Alert.alert('Thông báo', 'Chức năng đang phát triển');
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
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    marginBottom: 14,
    elevation: 3,
  },
  cardText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutBtn: {
    marginTop: 30,
    backgroundColor: COLORS.danger || '#dc3545',
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

export default EmployeeDashboard;
