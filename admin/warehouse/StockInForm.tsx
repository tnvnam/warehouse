import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

interface Warehouse {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  name: string;
}

interface Material {
  id: string;
  name: string;
}

const StockInForm = () => {
  const navigation = useNavigation();
  const [warehouseId, setWarehouseId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [whRes, supRes, matRes] = await Promise.all([
          fetch('http://10.0.2.2:3000/warehouses'),
          fetch('http://10.0.2.2:3000/suppliers'),
          fetch('http://10.0.2.2:3000/materials'),
        ]);
        setWarehouses(await whRes.json());
        setSuppliers(await supRes.json());
        setMaterials(await matRes.json());
      } catch {
        Alert.alert('Lỗi', 'Không thể tải dữ liệu');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!warehouseId || !supplierId || !materialId || !quantity) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ');
      return;
    }

    try {
      const res = await fetch('http://10.0.2.2:3000/stockin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          warehouse_id: warehouseId,
          supplier_id: supplierId,
          date: new Date().toISOString().split('T')[0],
          note,
          items: [
            {
              material_id: materialId,
              quantity: Number(quantity),
            },
          ],
        }),
      });

      if (res.ok) {
        Alert.alert('Thành công', 'Đã tạo phiếu nhập');
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', 'Không thể tạo phiếu nhập');
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể kết nối server');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Tạo phiếu nhập kho</Text>

      <Text style={styles.label}>Kho nhập</Text>
      <View style={styles.pickerWrap}>
        <Picker selectedValue={warehouseId} onValueChange={setWarehouseId}>
          <Picker.Item label="-- Chọn kho --" value="" />
          {warehouses.map(w => (
            <Picker.Item key={w.id} label={w.name} value={w.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Nhà cung cấp</Text>
      <View style={styles.pickerWrap}>
        <Picker selectedValue={supplierId} onValueChange={setSupplierId}>
          <Picker.Item label="-- Chọn nhà cung cấp --" value="" />
          {suppliers.map(s => (
            <Picker.Item key={s.id} label={s.name} value={s.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Nguyên vật liệu</Text>
      <View style={styles.pickerWrap}>
        <Picker selectedValue={materialId} onValueChange={setMaterialId}>
          <Picker.Item label="-- Chọn vật tư --" value="" />
          {materials.map(m => (
            <Picker.Item key={m.id} label={m.name} value={m.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Số lượng</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Nhập số lượng"
      />

      <Text style={styles.label}>Ghi chú</Text>
      <TextInput
        style={styles.input}
        value={note}
        onChangeText={setNote}
        placeholder="Thêm ghi chú nếu có"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Ionicons name="save" size={20} color="#fff" />
        <Text style={styles.buttonText}>Lưu phiếu nhập</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  label: { marginTop: 12, marginBottom: 4, fontWeight: '600' },
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 6,
  },
  buttonText: { color: '#fff', marginLeft: 6, fontWeight: '600' },
});

export default StockInForm;