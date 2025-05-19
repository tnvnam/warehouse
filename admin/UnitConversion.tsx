import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const UnitConversion = () => {
  const [productQuery, setProductQuery] = useState('');
  const [productSuggestions, setProductSuggestions] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [units, setUnits] = useState<any[]>([]);
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [factor, setFactor] = useState('');
  const [note, setNote] = useState('');

  // Lấy danh sách đơn vị
  useEffect(() => {
    fetch('http://10.0.2.2:3000/units')
      .then(res => res.json())
      .then(data => setUnits(data))
      .catch(() => setUnits([]));
  }, []);

  // Gợi ý sản phẩm khi nhập
  useEffect(() => {
    if (productQuery.length < 2) {
      setProductSuggestions([]);
      return;
    }
    fetch(`http://10.0.2.2:3000/products?search=${encodeURIComponent(productQuery)}`)
      .then(res => res.json())
      .then(data => setProductSuggestions(data))
      .catch(() => setProductSuggestions([]));
  }, [productQuery]);

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setProductQuery(product.name);
    setProductSuggestions([]);
  };

  const handleAddConversion = async () => {
    if (!selectedProduct) {
      Alert.alert('Lỗi', 'Bạn phải chọn sản phẩm');
      return;
    }
    if (!fromUnit || !toUnit) {
      Alert.alert('Lỗi', 'Bạn phải chọn đơn vị nguồn và đơn vị đích');
      return;
    }
    if (!factor || isNaN(Number(factor)) || Number(factor) <= 0) {
      Alert.alert('Lỗi', 'Hệ số quy đổi phải là số dương');
      return;
    }
    try {
      const response = await fetch('http://10.0.2.2:3000/unit-conversions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          from_unit_id: fromUnit,
          to_unit_id: toUnit,
          factor: Number(factor),
          note,
        }),
      });
      if (response.ok) {
        Alert.alert('Thành công', 'Đã thêm quy đổi đơn vị!');
        setSelectedProduct(null);
        setProductQuery('');
        setFromUnit('');
        setToUnit('');
        setFactor('');
        setNote('');
      } else {
        Alert.alert('Lỗi', 'Không thể thêm quy đổi');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối server');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm Quy Đổi Đơn Vị</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên sản phẩm..."
        value={productQuery}
        onChangeText={text => {
          setProductQuery(text);
          setSelectedProduct(null);
        }}
      />
      {productSuggestions.length > 0 && (
        <FlatList
          data={productSuggestions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectProduct(item)} style={styles.suggestionItem}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionList}
        />
      )}
      <Picker
        selectedValue={fromUnit}
        onValueChange={setFromUnit}
        style={styles.input}
      >
        <Picker.Item label="Chọn đơn vị nguồn" value="" />
        {units.map((unit: any) => (
          <Picker.Item key={unit.id} label={unit.name} value={unit.id} />
        ))}
      </Picker>
      <Picker
        selectedValue={toUnit}
        onValueChange={setToUnit}
        style={styles.input}
      >
        <Picker.Item label="Chọn đơn vị đích" value="" />
        {units.map((unit: any) => (
          <Picker.Item key={unit.id} label={unit.name} value={unit.id} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Hệ số quy đổi (factor)"
        value={factor}
        onChangeText={setFactor}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Ghi chú"
        value={note}
        onChangeText={setNote}
      />
      <Button title="Thêm Quy Đổi" onPress={handleAddConversion} />
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
  suggestionList: {
    maxHeight: 120,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default UnitConversion;