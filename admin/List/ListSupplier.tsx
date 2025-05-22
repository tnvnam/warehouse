import React, { useEffect, useState } from 'react';
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

interface Supplier {
  id: string;
  code: string;
  name: string;
  tax_code?: string;
  address?: string;
  phone?: string;
  email?: string;
  contact_person?: string;
  contact_position?: string;
  business_field?: string;
  note?: string;
  credit_limit?: number;
  priority_level?: string;
  is_active?: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

const formatDate = (date?: string) => {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  } catch {
    return date;
  }
};

const renderStatusBadge = (isActive?: boolean) => (
  <View style={[styles.badge, { backgroundColor: isActive ? '#43a047' : '#e53935' }]}>
    <Text style={styles.badgeText}>{isActive ? 'Hoạt động' : 'Ngừng'}</Text>
  </View>
);

const ListSupplier = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/suppliers');
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải danh sách nhà cung cấp');
    } finally {
      setLoading(false);
    }
  };

  const deleteSupplier = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa nhà cung cấp này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa', onPress: async () => {
          try {
            const res = await fetch(`http://10.0.2.2:3000/suppliers/${id}`, { method: 'DELETE' });
            if (res.ok) {
              setSuppliers(prev => prev.filter(s => s.id !== id));
              Alert.alert('Thành công', 'Đã xóa nhà cung cấp');
            } else {
              Alert.alert('Lỗi', 'Không thể xóa nhà cung cấp');
            }
          } catch {
            Alert.alert('Lỗi', 'Không thể kết nối server');
          }
        }
      }
    ]);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  const openDetailModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🏢 Danh sách nhà cung cấp</Text>
      <FlatList
        data={suppliers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openDetailModal(item)}>
            <Ionicons name="business-outline" size={28} color="#1976d2" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.detail}>Mã: {item.code} | MST: {item.tax_code || '...'}</Text>
              <Text style={styles.detail}>Liên hệ: {item.contact_person || '...'} | {item.phone || '...'}</Text>
              {renderStatusBadge(item.is_active)}
            </View>
            <TouchableOpacity onPress={() => deleteSupplier(item.id)} style={styles.iconBtn}>
              <Ionicons name="trash-outline" size={20} color="#dc3545" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có nhà cung cấp nào.</Text>}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddSupplier' as never)}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addText}>Thêm nhà cung cấp</Text>
      </TouchableOpacity>

      {/* Modal chi tiết nhà cung cấp */}
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
              {selectedSupplier && (
                <>
                  <View style={{ alignItems: 'center', marginBottom: 10 }}>
                    <Text style={styles.supplierName}>{selectedSupplier.name}</Text>
                    <Text style={styles.supplierCode}>Mã: {selectedSupplier.code} | MST: {selectedSupplier.tax_code || '...'}</Text>
                    {renderStatusBadge(selectedSupplier.is_active)}
                  </View>
                  <View style={styles.detailBox}>
                    <DetailRow icon="call-outline" label="Điện thoại" value={selectedSupplier.phone} />
                    <DetailRow icon="mail-outline" label="Email" value={selectedSupplier.email} />
                    <DetailRow icon="person-outline" label="Người liên hệ" value={selectedSupplier.contact_person} />
                    <DetailRow icon="briefcase-outline" label="Chức vụ" value={selectedSupplier.contact_position} />
                    <DetailRow icon="location-outline" label="Địa chỉ" value={selectedSupplier.address} />
                    <DetailRow icon="business-outline" label="Lĩnh vực" value={selectedSupplier.business_field} />
                    <DetailRow icon="cash-outline" label="Hạn mức tín dụng" value={selectedSupplier.credit_limit?.toLocaleString('vi-VN')} />
                    <DetailRow icon="star-outline" label="Ưu tiên" value={selectedSupplier.priority_level} />
                    <DetailRow icon="information-circle-outline" label="Ghi chú" value={selectedSupplier.note} />
                    <DetailRow icon="calendar-outline" label="Tạo lúc" value={formatDate(selectedSupplier.created_at)} />
                    <DetailRow icon="refresh-circle-outline" label="Cập nhật" value={formatDate(selectedSupplier.updated_at)} />
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
    <Text style={styles.detailValue}>{value ? value : '...'}</Text>
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
  name: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  detail: { color: '#555', fontSize: 13, marginTop: 2 },
  badge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#43a047',
  },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
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
  supplierName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 2,
    textAlign: 'center',
  },
  supplierCode: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
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
});

export default ListSupplier;
