import React, { useEffect, useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AdminHome from './AdminHome';

// Giả lập login, bạn có thể thay bằng API thực tế sau này
const defaultUser = {
  username: 'tnvnam',
  full_name: 'Trần Nam Việt',
  email: 'tnvnam@example.com',
  role: 'Quản trị viên',
};

function CustomDrawerContent(props: any) {
  const user = defaultUser;
  function alert(arg0: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userInfo}>
        <Ionicons name="person-circle-outline" size={60} color="#2a5d9f" />
        <Text style={styles.userName}>{user.full_name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <Text style={styles.userRole}>{user.role}</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Tài khoản"
        icon={({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />}
        onPress={() => alert('Chức năng tài khoản')}
      />
      <DrawerItem
        label="Đăng xuất"
        icon={({ color, size }) => <Ionicons name="log-out-outline" color={color} size={size} />}
        onPress={() => alert('Đăng xuất')}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="AdminHome"
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          drawerActiveTintColor: '#2a5d9f',
        }}
      >
        <Drawer.Screen
          name="AdminHome"
          component={AdminHome}
          options={{
            title: 'Trang chủ Admin',
            drawerIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
          }}
        />
        {/* Các màn hình khác như RoleManager, DepartmentManager, UserManager sẽ thêm ở đây */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  userInfo: {
    alignItems: 'center',
    marginVertical: 24,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 8,
    color: '#2a5d9f',
  },
  userEmail: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  userRole: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
    fontStyle: 'italic',
  },
});