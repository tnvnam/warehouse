import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainTabNavigator from './screens/MainTabNavigator';

import ChangePassword from './settings/ChangePassword';
import UserProfile from './settings/UserProfile';

import AddUser from './AddUser';
import AddRole from './AddRole';
import AddDepartment from './AddDepartment';
import AddUnit from './AddUnit';
import AddProductCategory from './AddProductCategory';
import AddProduct from './AddProduct';
import AddMaterial from './AddMaterial';
import AddCustomer from './AddCustomer';
import AddSupplier from './AddSupplier';
import AddWarehouse from './AddWarehouse';

import ListUser from './List/ListUser';
import ListRole from './List/ListRole';
import ListDepartment from './List/ListDepartment';
import ListUnit from './List/ListUnit';
import ListProductCategory from './List/ListProductCategory';
import ListProduct from './List/ListProduct';
import ListMaterial from './List/ListMaterial';
import ListCustomer from './List/ListCustomer';
import ListSupplier from './List/ListSupplier';
import ListWarehouse from './List/ListWarehouse';

import RequestList from './Request/RequestList';
import RequestForm from './Request/RequestForm';
import RequestDetail from './Request/RequestDetail';

import ProductDetail from './Detail/ProductDetail';

// 💡 Thêm các màn hình kiểm kê
import StockCheckList from './warehouse/StockCheckList';
import StockCheckForm from './warehouse/StockCheckForm';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  ChangePassword: undefined;
  UserProfile: undefined;

  // Add
  AddUser: undefined;
  AddRole: undefined;
  AddDepartment: undefined;
  AddUnit: undefined;
  AddProductCategory: undefined;
  AddProduct: undefined;
  AddMaterial: undefined;
  AddCustomer: undefined;
  AddSupplier: undefined;
  AddWarehouse: undefined;

  // List
  ListUser: undefined;
  ListRole: undefined;
  ListDepartment: undefined;
  ListUnit: undefined;
  ListProductCategory: undefined;
  ListProduct: undefined;
  ListMaterial: undefined;
  ListCustomer: undefined;
  ListSupplier: undefined;
  ListWarehouse: undefined;

  // Detail
  ProductDetail: { id: string };

  // Request
  RequestList: undefined;
  RequestForm: undefined;
  RequestDetail: { id: string };

  // 🆕 Stock Check
  StockCheckList: undefined;
  StockCheckForm: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        {/* Auth */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="UserProfile" component={UserProfile} />

        {/* Add */}
        <Stack.Screen name="AddUser" component={AddUser} />
        <Stack.Screen name="AddRole" component={AddRole} />
        <Stack.Screen name="AddDepartment" component={AddDepartment} />
        <Stack.Screen name="AddUnit" component={AddUnit} />
        <Stack.Screen name="AddProductCategory" component={AddProductCategory} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="AddMaterial" component={AddMaterial} />
        <Stack.Screen name="AddCustomer" component={AddCustomer} />
        <Stack.Screen name="AddSupplier" component={AddSupplier} />
        <Stack.Screen name="AddWarehouse" component={AddWarehouse} />

        {/* List */}
        <Stack.Screen name="ListUser" component={ListUser} />
        <Stack.Screen name="ListRole" component={ListRole} />
        <Stack.Screen name="ListDepartment" component={ListDepartment} />
        <Stack.Screen name="ListUnit" component={ListUnit} />
        <Stack.Screen name="ListProductCategory" component={ListProductCategory} />
        <Stack.Screen name="ListProduct" component={ListProduct} />
        <Stack.Screen name="ListMaterial" component={ListMaterial} />
        <Stack.Screen name="ListCustomer" component={ListCustomer} />
        <Stack.Screen name="ListSupplier" component={ListSupplier} />
        <Stack.Screen name="ListWarehouse" component={ListWarehouse} />

        {/* Detail */}
        <Stack.Screen name="ProductDetail" component={ProductDetail} />

        {/* Request */}
        <Stack.Screen name="RequestList" component={RequestList} />
        <Stack.Screen name="RequestForm" component={RequestForm} />
        <Stack.Screen name="RequestDetail" component={RequestDetail} />

        {/* Stock Check */}
        <Stack.Screen name="StockCheckList" component={StockCheckList} />
        <Stack.Screen name="StockCheckForm" component={StockCheckForm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
