import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const OrderItemCard = ({ item, theme }) => (
  <View style={[styles.itemCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
    <View style={styles.itemInfo}>
      <Text style={[styles.itemName, { color: theme.text }]}>{item.product_name || item.name}</Text>
      <Text style={[styles.itemPrice, { color: theme.primary }]}>
        ${parseFloat(item.price || 0).toFixed(2)} x {item.quantity}
      </Text>
      <Text style={[styles.itemTotal, { color: theme.text }]}>
        Total: ${(parseFloat(item.price || 0) * parseInt(item.quantity || 1)).toFixed(2)}
      </Text>
    </View>
  </View>
);

export default function OrderDetailScreen({ route, navigation }) {
  const { orderId } = route.params;
  const { theme } = useTheme();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${orderId}/`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error loading order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.backButton, { color: theme.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Order Details</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.backButton, { color: theme.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Order Details</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Order Not Found</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            This order could not be loaded
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Calculate total from items if total_amount is not available
  const calculateTotalFromItems = () => {
    if (order.items && order.items.length > 0) {
      return order.items.reduce((sum, item) => {
        const price = parseFloat(item.price || 0);
        const quantity = parseInt(item.quantity || 1);
        return sum + (price * quantity);
      }, 0);
    }
    return 0;
  };

  const orderTotal = parseFloat(order.total_amount || order.total || 0) || calculateTotalFromItems();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Order Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Order Info */}
        <View style={[styles.orderInfo, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.orderHeader}>
            <Text style={[styles.orderNumber, { color: theme.text }]}>Order #{order.id}</Text>
            <Text style={[styles.orderDate, { color: theme.textSecondary }]}>
              {formatDate(order.created_at || order.date)}
            </Text>
          </View>
          
          <View style={styles.statusContainer}>
            <Text style={[styles.statusLabel, { color: theme.text }]}>Status:</Text>
            <Text style={[styles.statusValue, { color: getStatusColor(order.status) }]}>
              {order.status}
            </Text>
          </View>

          <View style={styles.totalContainer}>
            <Text style={[styles.totalLabel, { color: theme.text }]}>Total Amount:</Text>
            <Text style={[styles.totalValue, { color: theme.primary }]}>
              ${orderTotal.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.itemsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Order Items</Text>
          
          {order.items && order.items.length > 0 ? (
            <FlatList
              data={order.items}
              keyExtractor={(item, index) => `${item.id || index}`}
              renderItem={({ item }) => <OrderItemCard item={item} theme={theme} />}
              scrollEnabled={false}
            />
          ) : (
            <View style={[styles.noItems, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.noItemsText, { color: theme.textSecondary }]}>
                No items found for this order
              </Text>
            </View>
          )}
        </View>

        {/* Delivery Info */}
        {order.delivery_address && (
          <View style={[styles.deliveryInfo, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Delivery Information</Text>
            <Text style={[styles.deliveryText, { color: theme.textSecondary }]}>
              {order.delivery_address}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    fontSize: 24,
    fontWeight: 'bold',
    width: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  orderInfo: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  itemCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    marginBottom: 2,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  noItems: {
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  noItemsText: {
    fontSize: 14,
  },
  deliveryInfo: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  deliveryText: {
    fontSize: 14,
    lineHeight: 20,
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
  },
});
