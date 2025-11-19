import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { colors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onPress, onAddToCart, theme }) => {
  if (!product) return null;
  
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={() => onPress(product)}>
      <View style={styles.imageContainer}>
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} style={styles.image} />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: theme.border }]}>
            <Text style={[styles.placeholderText, { color: theme.textSecondary }]}>📦</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>{product.name || 'Unnamed Product'}</Text>
        <Text style={[styles.category, { color: theme.textSecondary }]}>{product.category?.name || 'General'}</Text>
        <View style={styles.footer}>
          <Text style={[styles.price, { color: theme.primary }]}>${product.price || '0.00'}</Text>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]} onPress={() => onAddToCart(product)}>
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ProductsScreen({ navigation }) {
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products/'),
        api.get('/categories/'),
      ]);
      
      const productsData = productsRes.data?.results || productsRes.data || [];
      const categoriesData = categoriesRes.data?.results || categoriesRes.data || [];
      
      // Filter out any invalid products
      const validProducts = productsData.filter(product => product && product.name);
      const validCategories = categoriesData.filter(category => category && category.name);
      
      setProducts(validProducts);
      setCategories([{ id: 0, name: 'All' }, ...validCategories]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    const success = await addToCart(product, 1);
    if (success) {
      Alert.alert('Success', 'Added to cart!');
    } else {
      Alert.alert('Error', 'Failed to add to cart');
    }
  };

  const filteredProducts = (products || []).filter(product => {
    if (!product || !product.name) return false;
    const matchesSearch = searchTerm ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesCategory = selectedCategory === 'All' || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Text style={[styles.title, { color: theme.text }]}>Products</Text>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
          placeholder="Search products..."
          placeholderTextColor={theme.textSecondary}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <View style={styles.categories}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryTab, 
                { backgroundColor: selectedCategory === item.name ? theme.primary : theme.surface, borderColor: theme.border }
              ]}
              onPress={() => setSelectedCategory(item.name)}
            >
              <Text style={[
                styles.categoryText, 
                { color: selectedCategory === item.name ? 'white' : theme.text }
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
            onAddToCart={handleAddToCart}
            theme={theme}
          />
        )}
        contentContainerStyle={styles.grid}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 16, backgroundColor: colors.surface },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  searchInput: { backgroundColor: colors.background, borderRadius: 8, padding: 12, fontSize: 16 },
  categories: { paddingHorizontal: 16, marginVertical: 16 },
  categoryTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.surface, marginRight: 8 },
  activeTab: { backgroundColor: colors.primary },
  categoryText: { fontSize: 14, color: colors.text },
  activeText: { color: 'white' },
  grid: { padding: 16 },
  card: { flex: 1, backgroundColor: colors.surface, borderRadius: 12, margin: 6, shadowOpacity: 0.1, elevation: 3 },
  imageContainer: { height: 120, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  image: { width: '100%', height: '100%', borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  placeholder: { width: '100%', height: '100%', backgroundColor: colors.border, borderTopLeftRadius: 12, borderTopRightRadius: 12, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 32, color: colors.textSecondary },
  info: { padding: 12 },
  name: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 },
  category: { fontSize: 12, color: colors.textSecondary, marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
  addButton: { width: 32, height: 32, backgroundColor: colors.primary, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  addText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: colors.textSecondary },
});
