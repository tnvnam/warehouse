import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';

interface ReportItem {
  id: string;
  material_name: string;
  department_name: string;
  type: string;
  quantity: number;
  date: string;
}

const InventoryReport = () => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [type, setType] = useState('all');

  const [reportData, setReportData] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDepartments = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/departments');
      const data = await res.json();
      setDepartments(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải phòng ban');
    }
  };

  const fetchReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('from', fromDate.toISOString().split('T')[0]);
      params.append('to', toDate.toISOString().split('T')[0]);
      if (selectedDepartment) params.append('department_id', selectedDepartment);
      if (type !== 'all') params.append('type', type);

      const res = await fetch(`http://10.0.2.2:3000/report?${params.toString()}`);
      const data: ReportItem[] = await res.json();

      if (!Array.isArray(data)) throw new Error('Invalid data');
      setReportData(data);
    } catch (error) {
      console.error('Lỗi báo cáo:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu báo cáo');
    } finally {
      setLoading(false);
    }
  };

 const requestWritePermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Yêu cầu quyền ghi file',
        message: 'Ứng dụng cần quyền để lưu báo cáo Excel',
        buttonPositive: 'Đồng ý',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

  const exportToExcel = async () => {
  const granted = await requestWritePermission();
if (!granted) {
  Alert.alert('Chưa cấp quyền', 'Bạn cần cho phép ghi bộ nhớ để xuất Excel');
  return;
}

  try {
    if (!reportData.length) {
      Alert.alert('Không có dữ liệu để xuất');
      return;
    }

    // Chuyển dữ liệu sang Excel
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'BaoCaoTonKho');

    const wbout = XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' });

    const path = `${RNFS.DocumentDirectoryPath}/baocao-tonkho.xlsx`;

    // Hàm chuyển string → binary
    const s2ab = (s: string) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };

    await RNFS.writeFile(path, wbout, 'ascii');

    Alert.alert('✅ Xuất Excel thành công', `File đã lưu tại:\n${path}`);
  } catch (err) {
    console.error('Export error:', err);
    Alert.alert('❌ Lỗi', 'Không thể xuất Excel');
  }
};

  useEffect(() => {
    fetchDepartments();
  }, []);

  const renderItem = ({ item }: { item: ReportItem }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.material_name}</Text>
      <Text style={styles.detail}>Phòng ban: {item.department_name}</Text>
      <Text style={styles.detail}>Ngày: {item.date}</Text>
      <Text style={styles.detail}>Loại: {item.type === 'import' ? 'Nhập' : 'Xuất'}</Text>
      <Text style={styles.qty}>Số lượng: {item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📈 Báo cáo tồn kho</Text>

      <Text style={styles.label}>Từ ngày</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowFromPicker(true)}>
        <Text>{fromDate.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>
      {showFromPicker && (
        <DateTimePicker
          value={fromDate}
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowFromPicker(false);
            if (date) setFromDate(date);
          }}
        />
      )}

      <Text style={styles.label}>Đến ngày</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowToPicker(true)}>
        <Text>{toDate.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>
      {showToPicker && (
        <DateTimePicker
          value={toDate}
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowToPicker(false);
            if (date) setToDate(date);
          }}
        />
      )}

      <Text style={styles.label}>Phòng ban</Text>
      <Picker
        selectedValue={selectedDepartment}
        onValueChange={(value) => setSelectedDepartment(value)}
        style={styles.input}
      >
        <Picker.Item label="Tất cả" value="" />
        {departments.map((d) => (
          <Picker.Item key={d.id} label={d.name} value={d.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Loại phiếu</Text>
      <Picker
        selectedValue={type}
        onValueChange={(value) => setType(value)}
        style={styles.input}
      >
        <Picker.Item label="Tất cả" value="all" />
        <Picker.Item label="Nhập kho" value="import" />
        <Picker.Item label="Xuất kho" value="export" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={fetchReport}>
        <Text style={styles.buttonText}>📊 Xem báo cáo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={exportToExcel}>
        <Text style={styles.buttonText}>📥 Xuất Excel</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : reportData.length === 0 ? (
        <Text style={styles.empty}>Không có dữ liệu phù hợp.</Text>
      ) : (
        <FlatList
          data={reportData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2e7d32', marginBottom: 16 },
  label: { fontWeight: '600', marginBottom: 4, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#388e3c',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    marginTop: 10,
    backgroundColor: '#1976d2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  empty: { textAlign: 'center', marginTop: 30, color: '#999' },
  item: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  name: { fontSize: 16, fontWeight: '600', color: '#1b5e20' },
  detail: { fontSize: 13, marginTop: 4, color: '#333' },
  qty: { fontSize: 14, marginTop: 4, color: '#000' },
});

export default InventoryReport;