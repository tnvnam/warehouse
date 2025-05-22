import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Warehouse {
  id: string;
  name: string;
  description?: string;
}

const StockCheckForm = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [warehouseId, setWarehouseId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const fetchWarehouses = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/warehouses');
      const data = await res.json();
      setWarehouses(data);
      if (data.length > 0) setWarehouseId(data[0].id);
    } catch {
      Alert.alert('Lỗi', 'Không thể tải danh sách kho');
    }
  };

  const submit = async () => {
    if (!warehouseId || !date) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn kho và ngày kiểm kê');
      return;
    }

    const formattedDate = date.toISOString().split('T')[0];

    try {
      setLoading(true);
      const res = await fetch('http://10.0.2.2:3000/stockcheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ warehouse_id: warehouseId, date: formattedDate, note }),
      });

      if (res.ok) {
        Alert.alert('Thành công', 'Đã tạo kiểm kê', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Lỗi', 'Không thể tạo kiểm kê');
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể kết nối server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📝 Tạo kiểm kê kho</Text>

      <Text style={styles.label}>Kho</Text>
      {warehouses.map((w) => (
        <TouchableOpacity
          key={w.id}
          style={[
            styles.option,
            warehouseId === w.id && styles.optionSelected,
          ]}
          onPress={() => setWarehouseId(w.id)}
        >
          <Text style={{ color: warehouseId === w.id ? '#fff' : '#333' }}>
            {w.name}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Ngày kiểm kê</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>{date.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            setShowDatePicker(Platform.OS === 'ios');
            setDate(currentDate);
          }}
        />
      )}

      <Text style={styles.label}>Ghi chú</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Ghi chú nếu có..."
        value={note}
        onChangeText={setNote}
        multiline
      />

      <TouchableOpacity style={styles.submit} onPress={submit}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>Lưu kiểm kê</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2e7d32',
    textAlign: 'center',
  },
  label: { fontWeight: '600', marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  option: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#eee',
    marginBottom: 6,
  },
  optionSelected: {
    backgroundColor: '#43a047',
  },
  submit: {
    backgroundColor: '#2196f3',
    marginTop: 24,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default StockCheckForm;
