import React, { ReactNode, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

interface Material {
  [x: string]: ReactNode;
  id: string;
  name: string;
  code: string;
  specification?: string;
  category_id?: string;
  category_name?: string;
  unit_id?: string;
  unit_name?: string;
  brand?: string;
  origin?: string;
  supplier_id?: string;
  supplier_name?: string;
  attributes?: any;
  image_urls?: string[];
  stock_min?: number;
  stock_max?: number;
  note?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

const ListMaterial = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
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

  const openDetailModal = (material: Material) => {
    setSelectedMaterial(material);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🧱 Danh sách nguyên vật liệu</Text>
      <FlatList
        data={materials}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openDetailModal(item)}>
            <Ionicons name="cube-outline" size={28} color="#1976d2" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.infoRow}>
                <Ionicons name="barcode-outline" size={15} color="#888" />
                <Text style={styles.infoText}>Mã: {item.code}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="pricetag-outline" size={15} color="#888" />
                <Text style={styles.infoText}>Loại: {item.category_name || '—'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="cube" size={15} color="#888" />
                <Text style={styles.infoText}>Đơn vị: {item.unit_name || '—'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="business-outline" size={15} color="#888" />
                <Text style={styles.infoText}>NCC: {item.supplier_name || '—'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="pricetag-outline" size={15} color="#888" />
                <Text style={styles.infoText}>Thương hiệu: {item.brand || '—'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="flag-outline" size={15} color="#888" />
                <Text style={styles.infoText}>Xuất xứ: {item.origin || '—'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="alert-circle-outline" size={15} color="#888" />
                <Text style={styles.infoText}>Tồn kho min: {item.stock_min ?? '—'} | max: {item.stock_max ?? '—'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="checkmark-circle-outline" size={15} color={item.is_active ? "#43a047" : "#e53935"} />
                <Text style={styles.infoText}>Trạng thái: {item.is_active ? 'Hoạt động' : 'Ngừng'}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => deleteMaterial(item.id)} style={styles.iconBtn}>
              <Ionicons name="trash-outline" size={20} color="#dc3545" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có vật tư nào.</Text>}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddMaterial' as never)}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addText}>Thêm vật tư</Text>
      </TouchableOpacity>

      {/* Modal chi tiết vật tư */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close-circle" size={28} color="#888" />
            </TouchableOpacity>
            <ScrollView>
              {selectedMaterial && (
                <>
                  <Text style={styles.modalTitle}>{selectedMaterial.name}</Text>
                  <View style={styles.detailBox}>
                    <DetailRow icon="barcode-outline" label="Mã vật tư" value={selectedMaterial.code} />
                    <DetailRow icon="pricetag-outline" label="Loại" value={selectedMaterial.category_name} />
                    <DetailRow icon="cube-outline" label="Đơn vị" value={selectedMaterial.unit_name} />
                    <DetailRow icon="document-text-outline" label="Quy cách" value={selectedMaterial.specification} />
                    <DetailRow icon="business-outline" label="Nhà cung cấp" value={selectedMaterial.supplier_name} />
                    <DetailRow icon="pricetag-outline" label="Thương hiệu" value={selectedMaterial.brand} />
                    <DetailRow icon="flag-outline" label="Xuất xứ" value={selectedMaterial.origin} />
                    <DetailRow icon="alert-circle-outline" label="Tồn kho min" value={selectedMaterial.stock_min} />
                    <DetailRow icon="alert-circle-outline" label="Tồn kho max" value={selectedMaterial.stock_max} />
                    <DetailRow icon="information-circle-outline" label="Ghi chú" value={selectedMaterial.note} />
                    <DetailRow icon="calendar-outline" label="Tạo lúc" value={selectedMaterial.created_at} />
                    <DetailRow icon="refresh-circle-outline" label="Cập nhật" value={selectedMaterial.updated_at} />
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value?: string | number;
}) => (
  <View style={styles.detailRow}>
    <Ionicons name={icon} size={18} color="#1976d2" style={{ width: 26 }} />
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value ? value : '—'}</Text>
  </View>
);

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
  detail: { color: '#555', fontSize: 13 },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '92%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 22,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 12,
    textAlign: 'center',
  },
  detailBox: {
    backgroundColor: '#f6fafd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.7,
    borderBottomColor: '#e0e6ed',
    paddingVertical: 7,
    marginHorizontal: 2,
  },
  detailLabel: {
    minWidth: 110,
    color: '#444',
    fontWeight: '500',
    fontSize: 15,
  },
  detailValue: {
    color: '#222',
    fontSize: 15,
    flex: 1,
    flexWrap: 'wrap',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    color: '#333',
    fontSize: 14,
    marginLeft: 6,
  },
});

export default ListMaterial;
