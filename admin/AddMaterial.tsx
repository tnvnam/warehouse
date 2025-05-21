import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const AddMaterial = () => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [specification, setSpecification] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [unitId, setUnitId] = useState('');
  const [units, setUnits] = useState([]);
  const [brand, setBrand] = useState('');
  const [origin, setOrigin] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [attributes, setAttributes] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [stockMin, setStockMin] = useState('');
  const [stockMax, setStockMax] = useState('');
  const [note, setNote] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetch('http://10.0.2.2:3000/product-categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
    fetch('http://10.0.2.2:3000/units')
      .then(res => res.json())
      .then(data => setUnits(data))
      .catch(() => setUnits([]));
    fetch('http://10.0.2.2:3000/suppliers')
      .then(res => res.json())
      .then(data => setSuppliers(data))
      .catch(() => setSuppliers([]));
  }, []);

  // Chuyển attributes từ chuỗi sang object JSON
  const parseAttributes = (str: string) => {
    if (!str.trim()) return {};
    try {
      // "màu: đỏ, size: XL" => { "màu": "đỏ", "size": "XL" }
      const arr = str.split(',').map(item => item.trim()).filter(Boolean);
      const obj: any = {};
      arr.forEach(item => {
        const [key, value] = item.split(':').map(s => s.trim());
        if (key) obj[key] = value || '';
      });
      return obj;
    } catch {
      return {};
    }
  };

  // Chuyển imageUrls từ chuỗi sang mảng
  const parseImageUrls = (str: string) => {
    if (!str.trim()) return [];
    return str.split(',').map(url => url.trim()).filter(Boolean);
  };

  const handleAddMaterial = async () => {
    if (!code || !name) {
      Alert.alert('Lỗi', 'Mã và tên nguyên vật liệu không được để trống');
      return;
    }
    if (!unitId) {
      Alert.alert('Lỗi', 'Bạn phải chọn đơn vị tính');
      return;
    }
    let attributesObj = parseAttributes(attributes);
    let imageUrlsArr = parseImageUrls(imageUrls);
    if (stockMin && (isNaN(Number(stockMin)) || Number(stockMin) < 0)) {
      Alert.alert('Lỗi', 'Tồn kho tối thiểu phải là số không âm');
      return;
    }
    if (stockMax && (isNaN(Number(stockMax)) || Number(stockMax) < 0)) {
      Alert.alert('Lỗi', 'Tồn kho tối đa phải là số không âm');
      return;
    }
    try {
      const response = await fetch('http://10.0.2.2:3000/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          name,
          specification,
          category_id: categoryId || null,
          unit_id: unitId,
          brand,
          origin,
          supplier_id: supplierId || null,
          attributes: attributesObj,
          image_urls: imageUrlsArr,
          stock_min: stockMin ? Number(stockMin) : null,
          stock_max: stockMax ? Number(stockMax) : null,
          note,
          is_active: isActive,
        }),
      });
      if (response.ok) {
        Alert.alert('Thành công', 'Đã thêm nguyên vật liệu mới!');
        setCode('');
        setName('');
        setSpecification('');
        setCategoryId('');
        setUnitId('');
        setBrand('');
        setOrigin('');
        setSupplierId('');
        setAttributes('');
        setImageUrls('');
        setStockMin('');
        setStockMax('');
        setNote('');
        setIsActive(true);
      } else {
        Alert.alert('Lỗi', 'Không thể thêm nguyên vật liệu');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối server');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm Nguyên Vật Liệu</Text>
      <TextInput style={styles.input} placeholder="Mã nguyên vật liệu" value={code} onChangeText={setCode} />
      <TextInput style={styles.input} placeholder="Tên nguyên vật liệu" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Thông số kỹ thuật" value={specification} onChangeText={setSpecification} />
      <Text style={{ marginBottom: 4 }}>Nhóm vật liệu</Text>
      <Picker selectedValue={categoryId} onValueChange={setCategoryId} style={styles.input}>
        <Picker.Item label="Chọn nhóm vật liệu" value="" />
        {categories.map((cat: any) => (
          <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
        ))}
      </Picker>
      <Text style={{ marginBottom: 4 }}>Đơn vị tính</Text>
      <Picker selectedValue={unitId} onValueChange={setUnitId} style={styles.input}>
        <Picker.Item label="Chọn đơn vị tính" value="" />
        {units.map((unit: any) => (
          <Picker.Item key={unit.id} label={unit.name} value={unit.id} />
        ))}
      </Picker>
      <TextInput style={styles.input} placeholder="Thương hiệu" value={brand} onChangeText={setBrand} />
      <TextInput style={styles.input} placeholder="Xuất xứ" value={origin} onChangeText={setOrigin} />
      <Text style={{ marginBottom: 4 }}>Nhà cung cấp chính</Text>
      <Picker selectedValue={supplierId} onValueChange={setSupplierId} style={styles.input}>
        <Picker.Item label="Chọn nhà cung cấp" value="" />
        {suppliers.map((sup: any) => (
          <Picker.Item key={sup.id} label={sup.name} value={sup.id} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder='Thuộc tính (vd: "màu: đỏ, size: XL")'
        value={attributes}
        onChangeText={setAttributes}
      />
      <TextInput
        style={styles.input}
        placeholder='Danh sách ảnh (cách nhau dấu phẩy)'
        value={imageUrls}
        onChangeText={setImageUrls}
      />
      <TextInput style={styles.input} placeholder="Tồn kho tối thiểu" value={stockMin} onChangeText={setStockMin} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Tồn kho tối đa" value={stockMax} onChangeText={setStockMax} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Ghi chú" value={note} onChangeText={setNote} />
      <TextInput
        style={styles.input}
        placeholder="Trạng thái (true/false)"
        value={isActive ? 'true' : 'false'}
        onChangeText={text => setIsActive(text === 'true')}
      />
      <Button title="Thêm Nguyên Vật Liệu" onPress={handleAddMaterial} />
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

export default AddMaterial;