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

interface Material {
  id: string;
  name: string;
  code: string;
  type: string;
}

const ListMaterial = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchMaterials = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/materials');
      const data = await res.json();
      setMaterials(data);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải danh sách vật tư');
    } finally {
      setLoading(false);
    }
  };

  const deleteMaterial = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa vật tư này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa', onPress: async () => {
          try {
            const res = await fetch(`http://10.0.2.2:3000/materials/${id}`, { method: 'DELETE' });
            if (res.ok) {
              setMaterials(prev => prev.filter(m => m.id !== id));
              Alert.alert('Thành công', 'Đã xóa vật tư');
            } else {
              Alert.alert('Lỗi', 'Không thể xóa vật tư');
            }
          } catch {
            Alert.alert('Lỗi', 'Không thể kết nối server');
          }
        }
      }
    ]);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách nguyên vật liệu</Text>
      <FlatList
        data={materials}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.detail}>Mã: {item.code} | Loại: {item.type}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteMaterial(item.id)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddMaterial' as never)}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addText}>Thêm vật tư</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  name: { fontWeight: '600', fontSize: 16 },
  detail: { color: '#555', fontSize: 13 },
  addBtn: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#007bff',
  },
  addText: { color: '#fff', marginLeft: 6, fontWeight: '600' },
});

export default ListMaterial;
