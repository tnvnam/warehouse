import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const DEFAULT_USER_ID = 'af5cdd63-3078-4f5c-98b6-4c07e5fe3d34';

const PRIORITIES = [
  { label: 'Cao', value: 'Cao' },
  { label: 'Trung bình', value: 'Trung bình' },
  { label: 'Thấp', value: 'Thấp' },
];

const STATUSES = [
  { label: 'Đang hoạt động', value: 'Đang hoạt động' },
  { label: 'Tạm dừng', value: 'Tạm dừng' },
  { label: 'Ngừng hợp tác', value: 'Ngừng hợp tác' },
];

const SCALES = [
  { label: 'Lớn', value: 'Lớn' },
  { label: 'Vừa', value: 'Vừa' },
  { label: 'Nhỏ', value: 'Nhỏ' },
];

const AddCustomer = () => {
  const [taxCode, setTaxCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPosition, setContactPosition] = useState('');
  const [businessField, setBusinessField] = useState('');
  const [note, setNote] = useState('');
  const [scale, setScale] = useState('Vừa');
  const [status, setStatus] = useState('Đang hoạt động');
  const [creditLimit, setCreditLimit] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('Thấp');

  const handleAddCustomer = async () => {
    if (!taxCode || !companyName) {
      Alert.alert('Lỗi', 'Mã số thuế và tên công ty không được để trống');
      return;
    }
    if (phone && !/^\d{10}$/.test(phone)) {
      Alert.alert('Lỗi', 'Số điện thoại phải gồm đúng 10 chữ số');
      return;
    }
    if (email && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      Alert.alert('Lỗi', 'Email không đúng định dạng');
      return;
    }
    if (creditLimit && (isNaN(Number(creditLimit)) || Number(creditLimit) < 0)) {
      Alert.alert('Lỗi', 'Hạn mức phải là số không âm');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:3000/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tax_code: taxCode,
          company_name: companyName,
          address,
          phone,
          email,
          contact_person: contactPerson,
          contact_position: contactPosition,
          created_by: DEFAULT_USER_ID,
          updated_by: DEFAULT_USER_ID,
          business_field: businessField,
          note,
          scale,
          status,
          credit_limit: creditLimit ? Number(creditLimit) : 0,
          priority_level: priorityLevel,
        }),
      });
      if (response.ok) {
        Alert.alert('Thành công', 'Đã thêm khách hàng mới!');
        setTaxCode('');
        setCompanyName('');
        setAddress('');
        setPhone('');
        setEmail('');
        setContactPerson('');
        setContactPosition('');
        setBusinessField('');
        setNote('');
        setScale('Vừa');
        setStatus('Đang hoạt động');
        setCreditLimit('');
        setPriorityLevel('Thấp');
      } else {
        Alert.alert('Lỗi', 'Không thể thêm khách hàng');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối server');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm Khách Hàng</Text>
      <TextInput style={styles.input} placeholder="Mã số thuế" value={taxCode} onChangeText={setTaxCode} />
      <TextInput style={styles.input} placeholder="Tên công ty" value={companyName} onChangeText={setCompanyName} />
      <TextInput style={styles.input} placeholder="Địa chỉ" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Người liên hệ" value={contactPerson} onChangeText={setContactPerson} />
      <TextInput style={styles.input} placeholder="Chức vụ người liên hệ" value={contactPosition} onChangeText={setContactPosition} />
      <TextInput style={styles.input} placeholder="Ngành nghề kinh doanh" value={businessField} onChangeText={setBusinessField} />
      <TextInput style={styles.input} placeholder="Ghi chú" value={note} onChangeText={setNote} />
      <Text style={{ marginBottom: 4 }}>Quy mô công ty</Text>
      <Picker selectedValue={scale} onValueChange={setScale} style={styles.input}>
        {SCALES.map(s => <Picker.Item key={s.value} label={s.label} value={s.value} />)}
      </Picker>
      <Text style={{ marginBottom: 4 }}>Trạng thái</Text>
      <Picker selectedValue={status} onValueChange={setStatus} style={styles.input}>
        {STATUSES.map(s => <Picker.Item key={s.value} label={s.label} value={s.value} />)}
      </Picker>
      <TextInput style={styles.input} placeholder="Hạn mức tín dụng" value={creditLimit} onChangeText={setCreditLimit} keyboardType="numeric" />
      <Text style={{ marginBottom: 4 }}>Mức độ ưu tiên</Text>
      <Picker selectedValue={priorityLevel} onValueChange={setPriorityLevel} style={styles.input}>
        {PRIORITIES.map(p => <Picker.Item key={p.value} label={p.label} value={p.value} />)}
      </Picker>
      <Button title="Thêm Khách Hàng" onPress={handleAddCustomer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
});

export default AddCustomer;