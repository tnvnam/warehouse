import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

interface Item {
  id: string;
  name: string;
}

const StockForm = () => {
  const [materials, setMaterials] = useState<Item[]>([]);
  const [warehouses, setWarehouses] = useState<Item[]>([]);
  const [materialId, setMaterialId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [type, setType] = useState('import');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetch('http://10.0.2.2:3000/materials')
      .then(res => res.json())
      .then(setMaterials)
      .catch(() => Alert.alert('Lỗi', 'Không thể tải vật tư'));

    fetch('http://10.0.2.2:3000/warehouses')
      .then(res => res.json())
      .then(setWarehouses)
      .catch(() => Alert.alert('Lỗi', 'Không thể tải kho'));
  }, []);

  const submit = async () => {
    if (!materialId || !warehouseId || !quantity) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ các trường.');
      return;
    }

    try {
      const res = await fetch('http://10.0.2.2:3000/stock/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          material_id: materialId,
          warehouse_id: warehouseId,
          type,
          quantity: parseFloat(quantity),
          date: date.toISOString().split('T')[0],
        }),
      });

      if (res.ok) {
        Alert.alert('Thành công', 'Phiếu đã được tạo');
        setMaterialId('');
        setWarehouseId('');
        setQuantity('');
        setType('import');
        setDate(new Date());
      } else {
        throw new Error();
      }
    } catch (err) {
      console.error('Lỗi tạo phiếu:', err);
      Alert.alert('Lỗi', 'Không thể tạo phiếu xuất/nhập kho');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo phiếu xuất/nhập kho</Text>

      <Text style={styles.label}>Vật tư</Text>
      <Picker
        selectedValue={materialId}
        onValueChange={setMaterialId}
        style={styles.input}
      >
        <Picker.Item label="-- Chọn vật tư --" value="" />
        {materials.map(m => (
          <Picker.Item key={m.id} label={m.name} value={m.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Kho</Text>
      <Picker
        selectedValue={warehouseId}
        onValueChange={setWarehouseId}
        style={styles.input}
      >
        <Picker.Item label="-- Chọn kho --" value="" />
        {warehouses.map(w => (
          <Picker.Item key={w.id} label={w.name} value={w.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Loại phiếu</Text>
      <Picker selectedValue={type} onValueChange={setType} style={styles.input}>
        <Picker.Item label="Nhập kho" value="import" />
        <Picker.Item label="Xuất kho" value="export" />
      </Picker>

      <Text style={styles.label}>Số lượng</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Nhập số lượng"
      />

      <Text style={styles.label}>Ngày</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>{date.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Lưu phiếu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#2e7d32' },
  label: { fontWeight: '600', marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#388e3c',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

export default StockForm;
