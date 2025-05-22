import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../AppNavigator';

const screenWidth = Dimensions.get('window').width;

const stats = [
  { label: 'Tồn thấp', value: 12, icon: 'arrow-down-circle-outline', color: '#dc3545' },
  { label: 'Vượt mức', value: 8, icon: 'arrow-up-circle-outline', color: '#17a2b8' },
  { label: 'Hết hạn', value: 5, icon: 'alert-circle-outline', color: '#ffc107' },
];

const sections = [
  {
    title: 'Truy cập nhanh',
    data: [
      { icon: 'cube-outline', title: 'Tồn kho', route: 'InventoryList' },
      { icon: 'swap-horizontal', title: 'Xuất/Nhập', route: 'StockMovement' },
      { icon: 'bar-chart-outline', title: 'Báo cáo', route: 'InventoryReport' },
    ],
  },
  {
    title: 'Quản lý danh mục',
    data: [
      { icon: 'albums-outline', title: 'Danh mục sản phẩm', route: 'ListProductCategory' },
      { icon: 'pricetags-outline', title: 'Sản phẩm', route: 'ListProduct' },
      { icon: 'construct-outline', title: 'Nguyên vật liệu', route: 'ListMaterial' },
      { icon: 'people-outline', title: 'Nhà cung cấp', route: 'ListSupplier' },
      { icon: 'person-circle-outline', title: 'Khách hàng', route: 'ListCustomer' },
      { icon: 'business-outline', title: 'Kho', route: 'ListWarehouse' },
      { icon: 'scale-outline', title: 'Đơn vị tính', route: 'ListUnit' },
      { icon: 'git-branch-outline', title: 'Phòng ban', route: 'ListDepartment' },
    ],
  },
  {
    title: 'Hệ thống',
    data: [
      { icon: 'shield-checkmark-outline', title: 'Vai trò', route: 'ListRole' },
      { icon: 'person-outline', title: 'Người dùng', route: 'ListUser' },
      { icon: 'clipboard-outline', title: 'Kiểm kê kho', route: 'StockCheckList' },
      { icon: 'document-text-outline', title: 'Yêu cầu', route: 'RequestList' },
    ],
  },
];

const Dashboard = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(item.route)}>
      <Ionicons name={item.icon} size={26} color="#007bff" style={styles.cardIcon} />
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📊 Tổng quan kho</Text>

      <View style={styles.statSection}>
        {stats.map((item, index) => (
          <View key={index} style={styles.statCard}>
            <Ionicons name={item.icon} size={26} color={item.color} />
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.route}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.subHeader}>{title}</Text>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#222',
  },
  statSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    width: (screenWidth - 64) / 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 6,
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 25,
    color: '#444',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  cardIcon: {
    marginRight: 12,
  },
  cardText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
});

export default Dashboard;
