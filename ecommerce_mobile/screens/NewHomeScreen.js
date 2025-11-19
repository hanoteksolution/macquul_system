import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

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
      
      setProducts(productsData);
      setCategories(categoriesData);
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerText}>Here the tab menues categories</Text>
        </View>

        {/* Dynamic Slider/Carousel Section */}
        <View style={styles.sliderSection}>
          <Text style={styles.sliderText}>Here dynamic the slider/Carousel</Text>
        </View>

        {/* Products Section */}
        <View style={styles.productsSection}>
          <Text style={styles.productsText}>here the products</Text>
        </View>

        {/* Bottom Navigation Section */}
        <View style={styles.bottomNavSection}>
          <Text style={styles.bottomNavText}>here the bottom navigation</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  
  // Header Section
  headerSection: {
    backgroundColor: '#E5E5E5',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  
  // Slider Section
  sliderSection: {
    backgroundColor: '#E5E5E5',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  sliderText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  
  // Products Section
  productsSection: {
    backgroundColor: '#FFFFFF',
    minHeight: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  productsText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  
  // Bottom Navigation Section
  bottomNavSection: {
    backgroundColor: '#E5E5E5',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 8,
  },
  bottomNavText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
});
