import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Dashboard from '../screens/Dashboard';
import InventoryList from '../warehouse/InventoryList';
import StockMovement from '../warehouse/StockMovement';
import InventoryReport from '../warehouse/InventoryReport';
import Settings from '../screens/Settings';

export type TabParamList = {
  Dashboard: undefined;
  InventoryList: undefined;
  InventoryReport: undefined;
  StockMovement: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';

          switch (route.name) {
            case 'Dashboard':
              iconName = 'home-outline';
              break;
            case 'InventoryList':
              iconName = 'cube-outline';
              break;
            case 'InventoryReport':
              iconName = 'bar-chart-outline';
              break;
            case 'StockMovement':
              iconName = 'swap-horizontal';
              break;
            case 'Settings':
              iconName = 'settings-outline';
              break;
            default:
              iconName = 'ellipsis-horizontal-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12 },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} options={{ title: 'Tổng quan' }} />
      <Tab.Screen name="InventoryList" component={InventoryList} options={{ title: 'Tồn kho' }} />
      <Tab.Screen name="InventoryReport" component={InventoryReport} options={{ title: 'Báo cáo' }} />
      <Tab.Screen name="StockMovement" component={StockMovement} options={{ title: 'Xuất/Nhập' }} />
      <Tab.Screen name="Settings" component={Settings} options={{ title: 'Cài đặt' }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
