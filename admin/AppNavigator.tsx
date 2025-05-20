import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import các màn hình
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AdminDashboard from './screens/AdminDashboard';
import ManagerDashboard from './screens/ManagerDashboard';
import EmployeeDashboard from './screens/EmployeeDashboard';
import GuestDashboard from './screens/GuestDashboard';

export type RootStackParamList = {
  Login: { username?: string }; 
  Register: undefined;
  AdminDashboard: undefined;
  ManagerDashboard: undefined;
  EmployeeDashboard: undefined;
  GuestDashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
  <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
    <Stack.Screen name="ManagerDashboard" component={ManagerDashboard} />
    <Stack.Screen name="EmployeeDashboard" component={EmployeeDashboard} />
    <Stack.Screen name="GuestDashboard" component={GuestDashboard} />
  </Stack.Navigator>
</NavigationContainer>
  );
};

export default AppNavigator;
