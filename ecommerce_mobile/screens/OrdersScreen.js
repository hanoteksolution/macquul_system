import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { isAuthenticated } from '../utils/auth';
import api from '../services/api';

const OrderCard = ({ order, theme, onPress }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return theme.success;
      case 'processing': return theme.warning;
      case 'shipped': return theme.info;
      case 'cancelled': return theme.error;
      default: return theme.textSecondary;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.orderCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={() => onPress(order.id)}
    >
      <View style={styles.orderHeader}>
        <Text style={[styles.orderNumber, { color: theme.text }]}>Order #{order.id}</Text>
        <Text style={[styles.orderDate, { color: theme.textSecondary }]}>
          {formatDate(order.created_at || order.date)}
        </Text>
      </View>
      <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>
        Status: {order.status}
      </Text>
      <Text style={[styles.orderTotal, { color: theme.text }]}>
        Total: ${(parseFloat(order.total_amount || order.total || 0) || 0).toFixed(2)}
      </Text>
      {order.items && order.items.length > 0 && (
        <Text style={[styles.orderItems, { color: theme.textSecondary }]}>
          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
        </Text>
      )}
      <Text style={[styles.viewDetails, { color: theme.primary }]}>Tap to view details</Text>
    </TouchableOpacity>
  );
};

export default function OrdersScreen({ navigation }) {
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthAndLoadOrders();
  }, []);

  const checkAuthAndLoadOrders = async () => {
    const isAuth = await isAuthenticated();
    setAuthenticated(isAuth);
    
    if (isAuth) {
      await loadOrders();
    } else {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/');
      const ordersData = response.data?.results || response.data || [];
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
      if (error.response?.status === 401) {
        setAuthenticated(false);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await checkAuthAndLoadOrders();
  };

  const handleOrderPress = (orderId) => {
    navigation.navigate('OrderDetail', { orderId });
  };

  if (!authenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.text }]}>My Orders</Text>
        </View>
        
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Login Required</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            Please login to view your orders
          </Text>
          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.text }]}>My Orders</Text>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Text style={[styles.title, { color: theme.text }]}>My Orders</Text>
      </View>
      
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>No Orders Yet</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            Start shopping to see your orders here
          </Text>
          <TouchableOpacity 
            style={[styles.shopButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => <OrderCard order={item} theme={theme} onPress={handleOrderPress} />}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.primary]}
              tintColor={theme.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  orderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
  },
  orderStatus: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '600',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderItems: {
    fontSize: 12,
    marginTop: 4,
  },
  viewDetails: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  loginButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shopButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});
