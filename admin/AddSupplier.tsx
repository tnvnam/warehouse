import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';

const DEFAULT_USER_ID = 'af5cdd63-3078-4f5c-98b6-4c07e5fe3d34';

const AddSupplier = () => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPosition, setContactPosition] = useState('');
  const [businessField, setBusinessField] = useState('');
  const [note, setNote] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleAddSupplier = async () => {
    if (!code || !name) {
      Alert.alert('Lỗi', 'Mã và tên nhà cung cấp không được để trống');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:3000/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          name,
          tax_code: taxCode,
          address,
          phone,
          email,
          contact_person: contactPerson,
          contact_position: contactPosition,
          business_field: businessField,
          note,
          credit_limit: creditLimit ? Number(creditLimit) : null,
          priority_level: priorityLevel,
          is_active: isActive,
          created_by: DEFAULT_USER_ID,
        }),
      });
      if (response.ok) {
        Alert.alert('Thành công', 'Đã thêm nhà cung cấp mới!');
        setCode('');
        setName('');
        setTaxCode('');
        setAddress('');
        setPhone('');
        setEmail('');
        setContactPerson('');
        setContactPosition('');
        setBusinessField('');
        setNote('');
        setCreditLimit('');
        setPriorityLevel('');
        setIsActive(true);
      } else {
        Alert.alert('Lỗi', 'Không thể thêm nhà cung cấp');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối server');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm Nhà Cung Cấp</Text>
      <TextInput style={styles.input} placeholder="Mã nhà cung cấp" value={code} onChangeText={setCode} />
      <TextInput style={styles.input} placeholder="Tên nhà cung cấp" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Mã số thuế" value={taxCode} onChangeText={setTaxCode} />
      <TextInput style={styles.input} placeholder="Địa chỉ" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Người liên hệ" value={contactPerson} onChangeText={setContactPerson} />
      <TextInput style={styles.input} placeholder="Chức vụ người liên hệ" value={contactPosition} onChangeText={setContactPosition} />
      <TextInput style={styles.input} placeholder="Lĩnh vực kinh doanh" value={businessField} onChangeText={setBusinessField} />
      <TextInput style={styles.input} placeholder="Ghi chú" value={note} onChangeText={setNote} />
      <TextInput style={styles.input} placeholder="Hạn mức tín dụng" value={creditLimit} onChangeText={setCreditLimit} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Mức độ ưu tiên" value={priorityLevel} onChangeText={setPriorityLevel} />
      <TextInput
        style={styles.input}
        placeholder="Trạng thái (true/false)"
        value={isActive ? 'true' : 'false'}
        onChangeText={text => setIsActive(text === 'true')}
      />
      <Button title="Thêm Nhà Cung Cấp" onPress={handleAddSupplier} />
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

export default AddSupplier;