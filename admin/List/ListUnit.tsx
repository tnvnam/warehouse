import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

interface Unit {
  id: string;
  name: string;
  description?: string;
}

const ListUnit = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUnits = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/units');
      const data = await res.json();
      setUnits(data);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải danh sách đơn vị');
    } finally {
      setLoading(false);
    }
  };

  const deleteUnit = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa đơn vị này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa', onPress: async () => {
          try {
            const res = await fetch(`http://10.0.2.2:3000/units/${id}`, { method: 'DELETE' });
            if (res.ok) {
              setUnits(prev => prev.filter(u => u.id !== id));
              Alert.alert('Thành công', 'Đã xóa đơn vị');
            } else {
              Alert.alert('Lỗi', 'Không thể xóa đơn vị');
            }
          } catch {
            Alert.alert('Lỗi', 'Không thể kết nối server');
          }
        }
      }
    ]);
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⚖️ Danh sách đơn vị tính</Text>
      <FlatList
        data={units}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Ionicons name="cube-outline" size={26} color="#1976d2" style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.infoRow}>
                <Ionicons name="barcode-outline" size={15} color="#888" />
                <Text style={styles.infoText}>Mã: {item.code}</Text>
              </View>
              <Text style={styles.desc}>{item.description || 'Không mô tả'}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteUnit(item.id)} style={styles.iconBtn}>
              <Ionicons name="trash-outline" size={20} color="#dc3545" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có đơn vị nào.</Text>}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddUnit' as never)}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addText}>Thêm đơn vị</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7fafd' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#1976d2' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  name: { fontWeight: 'bold', fontSize: 16, color: '#222', marginBottom: 2 },
  desc: { color: '#555', fontSize: 13 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    color: '#555',
    fontSize: 13,
    marginLeft: 4,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
    backgroundColor: '#f0f4fa',
    alignSelf: 'flex-start',
  },
  addBtn: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: '#1976d2',
    elevation: 2,
  },
  addText: { color: '#fff', marginLeft: 10, fontWeight: 'bold', fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#6c757d' },
});

export default ListUnit;
