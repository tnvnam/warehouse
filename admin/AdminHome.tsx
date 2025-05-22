import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const adminFunctions = [
  {
    title: 'Quản lý vai trò (Roles)',
    icon: 'people-circle-outline',
    description: 'Tạo và chỉnh sửa roles',
    navigate: 'RoleManager',
  },
  {
    title: 'Phòng ban',
    icon: 'business-outline',
    description: 'Tạo, sửa, xoá phòng ban',
    navigate: 'DepartmentManager',
  },
  {
    title: 'Người dùng (Users)',
    icon: 'person-outline',
    description: 'Quản lý, thêm, sửa, xoá users',
    navigate: 'UserManager',
  },
];

const AdminHome = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Ionicons name="home-outline" size={32} color="#2a5d9f" />
        <Text style={styles.headerText}>Trang chủ Admin</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {adminFunctions.map((func, idx) => (
          <TouchableOpacity
            key={func.title}
            style={styles.card}
            onPress={() => navigation.navigate(func.navigate)}
            activeOpacity={0.8}
          >
            <Ionicons name={func.icon as any} size={36} color="#2a5d9f" style={{ marginBottom: 8 }} />
            <Text style={styles.cardTitle}>{func.title}</Text>
            <Text style={styles.cardDesc}>{func.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e6ed',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#2a5d9f',
  },
  container: {
    padding: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a5d9f',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});

export default AdminHome;