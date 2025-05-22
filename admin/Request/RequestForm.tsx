import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';

interface Item {
  id: string;
  name: string;
}

const RequestForm = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [departments, setDepartments] = useState<Item[]>([]);
  const [materials, setMaterials] = useState<Item[]>([]);
  const [units, setUnits] = useState<Item[]>([]);

  const [departmentId, setDepartmentId] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [type, setType] = useState<'import' | 'export'>('import');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetch('http://10.0.2.2:3000/departments')
      .then(res => res.json())
      .then(setDepartments)
      .catch(() => Alert.alert('Lỗi', 'Không thể tải phòng ban'));

    fetch('http://10.0.2.2:3000/materials')
      .then(res => res.json())
      .then(setMaterials)
      .catch(() => Alert.alert('Lỗi', 'Không thể tải vật tư'));

    fetch('http://10.0.2.2:3000/units')
      .then(res => res.json())
      .then(setUnits)
      .catch(() => Alert.alert('Lỗi', 'Không thể tải đơn vị tính'));
  }, []);

  const handleSubmit = async () => {
    if (!departmentId || !materialId || !unitId || !quantity) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ các trường.');
      return;
    }

    try {
      const res = await fetch('http://10.0.2.2:3000/requests/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department_id: departmentId,
          material_id: materialId,
          unit_id: unitId,
          type,
          quantity: parseFloat(quantity),
          date: date.toISOString().split('T')[0],
        }),
      });

      if (res.ok) {
        Alert.alert('Thành công', 'Yêu cầu đã được tạo');
        navigation.navigate('RequestList', { refresh: true }); // 👈 reload
      } else {
        throw new Error();
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tạo yêu cầu');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tạo phiếu yêu cầu</Text>

      <Text style={styles.label}>Phòng ban</Text>
      <Picker selectedValue={departmentId} onValueChange={setDepartmentId} style={styles.input}>
        <Picker.Item label="-- Chọn phòng ban --" value="" />
        {departments.map(dep => (
          <Picker.Item key={dep.id} label={dep.name} value={dep.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Vật tư</Text>
      <Picker selectedValue={materialId} onValueChange={setMaterialId} style={styles.input}>
        <Picker.Item label="-- Chọn vật tư --" value="" />
        {materials.map(mat => (
          <Picker.Item key={mat.id} label={mat.name} value={mat.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Đơn vị tính</Text>
      <Picker selectedValue={unitId} onValueChange={setUnitId} style={styles.input}>
        <Picker.Item label="-- Chọn đơn vị --" value="" />
        {units.map(unit => (
          <Picker.Item key={unit.id} label={unit.name} value={unit.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Loại yêu cầu</Text>
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

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Gửi yêu cầu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#2e7d32' },
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

export default RequestForm;
