import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';

interface Material {
  id: string;
  name: string;
}

interface Warehouse {
  id: string;
  name: string;
}

interface Unit {
  id: string;
  name: string;
}

interface User {
  id: string;
  full_name: string;
}

const StockForm = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [materialId, setMaterialId] = useState<string | null>(null);
  const [warehouseId, setWarehouseId] = useState<string | null>(null);
  const [unitId, setUnitId] = useState<string | null>(null);
  const [handlerId, setHandlerId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [type, setType] = useState<'import' | 'export'>('import');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [mats, whs, uts, usrs] = await Promise.all([
        fetch('http://10.0.2.2:3000/materials').then(res => res.json()),
        fetch('http://10.0.2.2:3000/warehouses').then(res => res.json()),
        fetch('http://10.0.2.2:3000/units').then(res => res.json()),
        fetch('http://10.0.2.2:3000/users').then(res => res.json()),
      ]);
      setMaterials(mats);
      setWarehouses(whs);
      setUnits(uts);
      setUsers(usrs);
      if (mats[0]) setMaterialId(mats[0].id);
      if (whs[0]) setWarehouseId(whs[0].id);
      if (uts[0]) setUnitId(uts[0].id);
      if (usrs[0]) setHandlerId(usrs[0].id);
    } catch {
      Alert.alert('Lỗi', 'Không thể tải dữ liệu');
    }
  };

  const submit = async () => {
    if (!materialId || !warehouseId || !unitId || !quantity || !type) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://10.0.2.2:3000/stock/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          material_id: materialId,
          warehouse_id: warehouseId,
          unit_id: unitId,
          handler_id: handlerId,
          quantity: parseFloat(quantity),
          price: price ? parseFloat(price) : null,
          note,
          batch_number: batchNumber,
          expiry_date: expiryDate.toISOString().split('T')[0],
          date: new Date().toISOString().split('T')[0],
          type,
        }),
      });

      if (res.ok) {
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', 'Không thể tạo phiếu');
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể kết nối server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📥 Tạo phiếu nhập/xuất</Text>

      <Text style={styles.label}>Loại</Text>
      <Picker selectedValue={type} onValueChange={val => setType(val)}>
        <Picker.Item label="Nhập kho" value="import" />
        <Picker.Item label="Xuất kho" value="export" />
      </Picker>

      <Text style={styles.label}>Vật tư</Text>
      <Picker selectedValue={materialId} onValueChange={val => setMaterialId(val)}>
        {materials.map(m => (
          <Picker.Item key={m.id} label={m.name} value={m.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Kho</Text>
      <Picker selectedValue={warehouseId} onValueChange={val => setWarehouseId(val)}>
        {warehouses.map(w => (
          <Picker.Item key={w.id} label={w.name} value={w.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Đơn vị</Text>
      <Picker selectedValue={unitId} onValueChange={val => setUnitId(val)}>
        {units.map(u => (
          <Picker.Item key={u.id} label={u.name} value={u.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Người xử lý</Text>
      <Picker selectedValue={handlerId} onValueChange={val => setHandlerId(val)}>
        {users.map(user => (
          <Picker.Item key={user.id} label={user.full_name} value={user.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Số lượng</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={quantity} onChangeText={setQuantity} />

      <Text style={styles.label}>Giá</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={price} onChangeText={setPrice} />

      <Text style={styles.label}>Số lô</Text>
      <TextInput style={styles.input} value={batchNumber} onChangeText={setBatchNumber} />

      <Text style={styles.label}>Hạn dùng</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowExpiryPicker(true)}>
        <Text>{expiryDate.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>

      {showExpiryPicker && (
        <DateTimePicker
          value={expiryDate}
          mode="date"
          display="default"
          onChange={(e, selected) => {
            if (selected) setExpiryDate(selected);
            setShowExpiryPicker(false);
          }}
        />
      )}

      <Text style={styles.label}>Ghi chú</Text>
      <TextInput style={[styles.input, { height: 80 }]} value={note} onChangeText={setNote} multiline />

      <TouchableOpacity style={styles.button} onPress={submit}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Lưu phiếu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#2e7d32', textAlign: 'center' },
  label: { marginTop: 12, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#f9f9f9'
  },
  button: {
    backgroundColor: '#1976d2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
});

export default StockForm;