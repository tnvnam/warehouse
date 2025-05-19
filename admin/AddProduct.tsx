import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

function generateBarcode() {
  // Tạo barcode ngẫu nhiên 13 số
  return Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
}

const AddProduct = () => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [specification, setSpecification] = useState('');
  const [unitId, setUnitId] = useState('');
  const [units, setUnits] = useState([]);
  const [brand, setBrand] = useState('');
  const [origin, setOrigin] = useState('');
  const [attributes, setAttributes] = useState('');
  const [price, setPrice] = useState('');
  const [stockMin, setStockMin] = useState('');
  const [stockMax, setStockMax] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [note, setNote] = useState('');

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
      // "màu đỏ, size XL" => { "màu đỏ": "", "size XL": "" }
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

  const handleAddProduct = async () => {
    if (!code || !name) {
      Alert.alert('Lỗi', 'Mã và tên sản phẩm không được để trống');
      return;
    }
    if (!categoryId) {
      Alert.alert('Lỗi', 'Bạn phải chọn danh mục sản phẩm');
      return;
    }
    if (!unitId) {
      Alert.alert('Lỗi', 'Bạn phải chọn đơn vị tính');
      return;
    }
    if (!supplierId) {
      Alert.alert('Lỗi', 'Bạn phải chọn nhà cung cấp');
      return;
    }
    let attributesObj = parseAttributes(attributes);
    try {
      const response = await fetch('http://10.0.2.2:3000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          name,
          barcode,
          category_id: categoryId,
          specification,
          unit_id: unitId,
          brand,
          origin,
          attributes: attributesObj,
          price: price ? Number(price) : null,
          stock_min: stockMin ? Number(stockMin) : null,
          stock_max: stockMax ? Number(stockMax) : null,
          supplier_id: supplierId,
          is_active: isActive,
          note,
        }),
      });
      if (response.ok) {
        Alert.alert('Thành công', 'Đã thêm sản phẩm mới!');
        setCode('');
        setName('');
        setBarcode('');
        setCategoryId('');
        setSpecification('');
        setUnitId('');
        setBrand('');
        setOrigin('');
        setAttributes('');
        setPrice('');
        setStockMin('');
        setStockMax('');
        setSupplierId('');
        setIsActive(true);
        setNote('');
      } else {
        Alert.alert('Lỗi', 'Không thể thêm sản phẩm');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối server');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm Sản Phẩm</Text>
      <TextInput style={styles.input} placeholder="Mã sản phẩm" value={code} onChangeText={setCode} />
      <TextInput style={styles.input} placeholder="Tên sản phẩm" value={name} onChangeText={setName} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Barcode"
          value={barcode}
          onChangeText={setBarcode}
        />
        <TouchableOpacity onPress={() => setBarcode(generateBarcode())} style={styles.barcodeBtn}>
          <Text style={{ color: '#007bff', fontWeight: 'bold' }}>Tạo</Text>
        </TouchableOpacity>
      </View>
      <Picker
        selectedValue={categoryId}
        onValueChange={setCategoryId}
        style={styles.input}
      >
        <Picker.Item label="Chọn danh mục sản phẩm" value="" />
        {categories.map((cat: any) => (
          <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
        ))}
      </Picker>
      <TextInput style={styles.input} placeholder="Quy cách/Đặc tả" value={specification} onChangeText={setSpecification} />
      <Picker
        selectedValue={unitId}
        onValueChange={setUnitId}
        style={styles.input}
      >
        <Picker.Item label="Chọn đơn vị tính" value="" />
        {units.map((unit: any) => (
          <Picker.Item key={unit.id} label={unit.name} value={unit.id} />
        ))}
      </Picker>
      <TextInput style={styles.input} placeholder="Thương hiệu" value={brand} onChangeText={setBrand} />
      <TextInput style={styles.input} placeholder="Xuất xứ" value={origin} onChangeText={setOrigin} />
      <TextInput
        style={styles.input}
        placeholder='Thuộc tính (vd: "màu: đỏ, size: XL")'
        value={attributes}
        onChangeText={setAttributes}
      />
      <TextInput style={styles.input} placeholder="Giá" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Tồn kho tối thiểu" value={stockMin} onChangeText={setStockMin} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Tồn kho tối đa" value={stockMax} onChangeText={setStockMax} keyboardType="numeric" />
      <Picker
        selectedValue={supplierId}
        onValueChange={setSupplierId}
        style={styles.input}
      >
        <Picker.Item label="Chọn nhà cung cấp" value="" />
        {suppliers.map((sup: any) => (
          <Picker.Item key={sup.id} label={sup.name} value={sup.id} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Trạng thái (true/false)"
        value={isActive ? 'true' : 'false'}
        onChangeText={text => setIsActive(text === 'true')}
      />
      <TextInput style={styles.input} placeholder="Ghi chú" value={note} onChangeText={setNote} />
      <Button title="Thêm Sản Phẩm" onPress={handleAddProduct} />
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
  barcodeBtn: {
    marginLeft: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#e6e6e6',
    borderRadius: 6,
  },
});

export default AddProduct;