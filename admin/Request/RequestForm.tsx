import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const RequestForm = () => {
  const [type, setType] = useState<'import' | 'export'>('import');
  const [departments, setDepartments] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [departmentId, setDepartmentId] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      const [depRes, matRes] = await Promise.all([
        fetch('http://10.0.2.2:3000/departments'),
        fetch('http://10.0.2.2:3000/materials'),
      ]);
      const depData = await depRes.json();
      const matData = await matRes.json();
      setDepartments(depData);
      setMaterials(matData);
      if (depData.length > 0) setDepartmentId(depData[0].id);
      if (matData.length > 0) setMaterialId(matData[0].id);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải dữ liệu');
    }
  };

  const submit = async () => {
    if (!type || !departmentId || !materialId || !quantity) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    const parsedQuantity = parseFloat(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      Alert.alert('Lỗi', 'Số lượng không hợp lệ');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://10.0.2.2:3000/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          department_id: departmentId,
          material_id: materialId,
          quantity: parsedQuantity,
        }),
      });

      if (res.ok) {
        Alert.alert('Thành công', 'Đã tạo phiếu yêu cầu', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Lỗi', 'Tạo phiếu thất bại');
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
    <View style={styles.container}>
      <Text style={styles.header}>📝 Tạo phiếu yêu cầu</Text>

      <Text style={styles.label}>Loại phiếu</Text>
      <Picker selectedValue={type} onValueChange={setType} style={styles.picker}>
        <Picker.Item label="Nhập kho" value="import" />
        <Picker.Item label="Xuất kho" value="export" />
      </Picker>

      <Text style={styles.label}>Phòng ban</Text>
      <Picker
        selectedValue={departmentId}
        onValueChange={setDepartmentId}
        style={styles.picker}
      >
        {departments.map((d) => (
          <Picker.Item key={d.id} label={d.name} value={d.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Nguyên vật liệu</Text>
      <Picker
        selectedValue={materialId}
        onValueChange={setMaterialId}
        style={styles.picker}
      >
        {materials.map((m) => (
          <Picker.Item key={m.id} label={m.name} value={m.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Số lượng</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        placeholder="Nhập số lượng"
      />

      <TouchableOpacity style={styles.submit} onPress={submit}>
        <Text style={styles.submitText}>Lưu yêu cầu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: { fontWeight: '600', marginBottom: 4, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#f1f1f1',
  },
  submit: {
    backgroundColor: '#1976d2',
    padding: 14,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

export default RequestForm;
