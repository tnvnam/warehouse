import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

interface StockInItem {
  id: string;
  warehouse_name: string;
  supplier_name: string;
  date: string;
  note?: string;
}

const StockInList = () => {
  const [data, setData] = useState<StockInItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  const fetchData = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/stockin');
      const result = await res.json();
      setData(result);
    } catch {
      Alert.alert('Lỗi', 'Không thể tải dữ liệu phiếu nhập kho');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }: { item: StockInItem }) => (
    <View style={styles.item}>
      <Ionicons name="document-text-outline" size={24} color="#007bff" style={styles.icon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Kho: {item.warehouse_name}</Text>
        <Text style={styles.meta}>Nhà cung cấp: {item.supplier_name}</Text>
        <Text style={styles.meta}>Ngày: {item.date}</Text>
        {item.note ? <Text style={styles.meta}>Ghi chú: {item.note}</Text> : null}
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách phiếu nhập kho</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('StockInForm' as never)}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addText}>Tạo phiếu nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  icon: { marginRight: 12, marginTop: 4 },
  title: { fontWeight: '600', fontSize: 16 },
  meta: { color: '#555', fontSize: 13 },
  addBtn: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#28a745',
  },
  addText: { color: '#fff', marginLeft: 6, fontWeight: '600' },
});

export default StockInList;
