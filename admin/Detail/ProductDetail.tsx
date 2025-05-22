import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import type { RootStackParamList } from '../AppNavigator';

const { width } = Dimensions.get('window');

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  description?: string;
  created_at?: string;
  category_name?: string;
  unit_name?: string;
  brand?: string;
  origin?: string;
}

const ProductDetail: React.FC = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const { id } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://10.0.2.2:3000/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Lỗi tải sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );

  if (!product)
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Không tìm thấy sản phẩm</Text>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        {/* Căn giữa tên sản phẩm & mã */}
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.sub}>Mã: {product.code}</Text>

        <View style={styles.divider} />

        {/* Chỉ căn giữa tiêu đề section đầu tiên */}
        <Section label="Thông tin sản phẩm" centerTitle>
          <Info label="Danh mục" value={product.category_name} />
          <Info label="Đơn vị" value={product.unit_name} />
          <Info label="Thương hiệu" value={product.brand} />
          <Info label="Xuất xứ" value={product.origin} />
        </Section>

        <Section label="Giá & mô tả">
          <Info label="Giá" value={product.price?.toLocaleString() + ' đ'} />
          <Info label="Mô tả" value={product.description} />
        </Section>

        <Section label="Khác">
          <Info
            label="Ngày tạo"
            value={
              product.created_at
                ? new Date(product.created_at).toLocaleDateString('vi-VN')
                : undefined
            }
          />
        </Section>
      </View>
    </ScrollView>
  );
};

const Section = ({
  label,
  children,
  centerTitle,
}: {
  label: string;
  children: React.ReactNode;
  centerTitle?: boolean;
}) => (
  <View style={styles.section}>
    <Text
      style={[
        styles.sectionTitle,
        centerTitle ? { textAlign: 'center' } : null,
      ]}
    >
      {label}
    </Text>
    <View>{children}</View>
  </View>
);

const Info = ({ label, value }: { label: string; value?: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || '—'}</Text>
  </View>
);

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F0F9F3',
    alignItems: 'center',
    paddingVertical: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: width * 0.9,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 4,
  },
  sub: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0F2F1',
    marginVertical: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#388e3c',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
    paddingBottom: 4,
  },
  infoRow: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 15,
    color: '#222',
    marginTop: 2,
  },
  error: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F9F3',
  },
});

export default ProductDetail;
