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

interface Customer {
  id: string;
  company_name: string;
  contact_person?: string;
  phone: string;
  email?: string;
  address?: string;
  priority_level?: number;
}

const renderPriority = (level?: number) => {
  if (level === 1) return <Text style={[styles.priority, { backgroundColor: '#e53935' }]}>Cao</Text>;
  if (level === 2) return <Text style={[styles.priority, { backgroundColor: '#ffb300' }]}>Trung bình</Text>;
  return <Text style={[styles.priority, { backgroundColor: '#43a047' }]}>Bình thường</Text>;
};

const ListCustomer = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const fetchCustomers = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/customers');
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa khách hàng này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa', onPress: async () => {
          try {
            const res = await fetch(`http://10.0.2.2:3000/customers/${id}`, { method: 'DELETE' });
            if (res.ok) {
              setCustomers(prev => prev.filter(c => c.id !== id));
              Alert.alert('Thành công', 'Đã xóa khách hàng');
            } else {
              Alert.alert('Lỗi', 'Không thể xóa khách hàng');
            }
          } catch {
            Alert.alert('Lỗi', 'Không thể kết nối server');
          }
        }
      }
    ]);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  const openDetailModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👥 Danh sách khách hàng</Text>
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openDetailModal(item)}>
            <Ionicons name="people-circle-outline" size={32} color="#1976d2" style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.company_name}</Text>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={15} color="#888" />
                <Text style={styles.infoText}>Liên hệ: {item.contact_person || '—'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={15} color="#888" />
                <Text style={styles.infoText}>SĐT: {item.phone}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={15} color="#888" />
                <Text style={styles.infoText}>Email: {item.email || '—'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={15} color="#888" />
                <Text style={styles.infoText}>Địa chỉ: {item.address || '—'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="star-outline" size={15} color="#888" />
                <Text style={styles.infoText}>Ưu tiên: {renderPriority(item.priority_level)}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => deleteCustomer(item.id)} style={styles.iconBtn}>
              <Ionicons name="trash-outline" size={20} color="#dc3545" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có khách hàng nào.</Text>}
      />

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddCustomer' as never)}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addText}>Thêm khách hàng</Text>
      </TouchableOpacity>

      {/* Modal chi tiết khách hàng */}
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
              {selectedCustomer && (
                <>
                  <Text style={styles.modalTitle}>{selectedCustomer.company_name}</Text>
                  <View style={styles.detailBox}>
                    <DetailRow icon="person-outline" label="Người liên hệ" value={selectedCustomer.contact_person} />
                    <DetailRow icon="call-outline" label="SĐT" value={selectedCustomer.phone} />
                    <DetailRow icon="mail-outline" label="Email" value={selectedCustomer.email} />
                    <DetailRow icon="location-outline" label="Địa chỉ" value={selectedCustomer.address} />
                    <DetailRow icon="star-outline" label="Ưu tiên" value={renderPriority(selectedCustomer.priority_level)} />
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
  value?: React.ReactNode;
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
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  infoText: { color: '#555', fontSize: 13, marginLeft: 6 },
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
  priority: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
    marginLeft: 4,
  },
});

export default ListCustomer;
