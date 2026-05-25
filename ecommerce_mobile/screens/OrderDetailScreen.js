import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import PremiumPageHeader from '../components/premium/PremiumPageHeader';
import OrderTrackingSteps from '../components/premium/orders/OrderTrackingSteps';
import OrderLineItem from '../components/premium/orders/OrderLineItem';
import PremiumEmptyState from '../components/premium/PremiumEmptyState';
import {
  getStatusMeta,
  formatOrderDateTime,
  getOrderTotal,
} from '../utils/orderStatus';
import premiumAlert from '../utils/premiumAlert';
import usePremiumTheme from '../hooks/usePremiumTheme';
import useThemedStyles from '../hooks/useThemedStyles';
import OrderDetailShimmer from '../components/premium/skeletons/OrderDetailShimmer';
import { resolveMediaUrl } from '../utils/mediaUrl';

async function enrichOrderItemsWithImages(order) {
  if (!order?.items?.length) return order;
  const missing = order.items.some((item) => !item.image_url && item.product);
  if (!missing) return order;

  try {
    const res = await api.get('/products/');
    const list = res.data?.results || res.data || [];
    const byId = new Map(list.map((p) => [p.id, p]));
    return {
      ...order,
      items: order.items.map((item) => {
        const productId =
          typeof item.product === 'object' ? item.product?.id : item.product;
        const product = byId.get(productId);
        const image_url =
          item.image_url ||
          product?.image_url ||
          resolveMediaUrl(product?.image);
        return image_url ? { ...item, image_url } : item;
      }),
    };
  } catch {
    return order;
  }
}

export default function OrderDetailScreen({ route, navigation }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${orderId}/`);
      const enriched = await enrichOrderItemsWithImages(response.data);
      setOrder(enriched);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <OrderDetailShimmer />;
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <PremiumPageHeader title="Order Details" onBack={() => navigation.goBack()} />
        <PremiumEmptyState icon="document-outline" title="Order not found" subtitle="This order could not be loaded." />
      </SafeAreaView>
    );
  }

  const meta = getStatusMeta(order.status);
  const orderTotal = getOrderTotal(order);
  const subtotal = orderTotal;
  const shipping = parseFloat(order.shipping_fee || 0);
  const tax = parseFloat(order.tax || 0);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <PremiumPageHeader
        title="Order Details"
        onBack={() => navigation.goBack()}
        rightIcon="ellipsis-horizontal"
        onRightPress={() => premiumAlert('Options', 'More actions coming soon.', [{ text: 'OK' }])}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={premium.gradientPrimary} style={styles.summaryCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.summaryTop}>
            <Text style={styles.summaryOrder}>Order #{order.id}</Text>
            <View style={[styles.statusPill, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Text style={styles.statusPillText}>{meta.label}</Text>
            </View>
          </View>
          <Text style={styles.summaryDate}>{formatOrderDateTime(order.created_at || order.date)}</Text>
          <Text style={styles.summaryTotal}>${orderTotal.toFixed(2)}</Text>
        </LinearGradient>

        <OrderTrackingSteps status={order.status} />

        {(order.delivery_address || order.shipping_address) && (
          <TouchableOpacity style={styles.addressCard} activeOpacity={0.9}>
            <LinearGradient colors={['rgba(99,102,241,0.15)', 'rgba(139,92,246,0.08)']} style={styles.addressIcon}>
              <Ionicons name="location" size={22} color={premium.indigo} />
            </LinearGradient>
            <View style={styles.addressBody}>
              <Text style={styles.addressLabel}>Delivery address</Text>
              <Text style={styles.addressName}>{order.recipient_name || 'Customer'}</Text>
              <Text style={styles.addressText}>
                {order.delivery_address || order.shipping_address}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={premium.textMuted} />
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>Order items</Text>
        {order.items?.length > 0 ? (
          order.items.map((item, index) => <OrderLineItem key={item.id || index} item={item} />)
        ) : (
          <Text style={styles.noItems}>No items in this order</Text>
        )}

        <View style={styles.paymentCard}>
          <Text style={styles.paymentTitle}>Payment summary</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Subtotal</Text>
            <Text style={styles.paymentValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Shipping</Text>
            <Text style={styles.paymentValue}>${shipping.toFixed(2)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Tax</Text>
            <Text style={styles.paymentValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.paymentRow, styles.paymentTotalRow]}>
            <Text style={styles.totalLabel}>Total amount</Text>
            <Text style={styles.totalValue}>${orderTotal.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.supportCard}
          activeOpacity={0.9}
          onPress={() => premiumAlert('Support', 'Our team will assist you shortly.', [{ text: 'OK' }], { variant: 'info' })}
        >
          <LinearGradient colors={premium.gradientSignIn} style={styles.supportIcon}>
            <Ionicons name="headset" size={24} color="#fff" />
          </LinearGradient>
          <View style={styles.supportText}>
            <Text style={styles.supportTitle}>Need help?</Text>
            <Text style={styles.supportSub}>Contact our support team</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={premium.emerald} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (premium) => ({

  container: { flex: 1, backgroundColor: premium.background },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },
  summaryCard: {
    borderRadius: premium.radiusXl,
    padding: 22,
    marginBottom: 16,
    ...premium.shadowCard,
  },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  summaryOrder: { fontSize: 20, fontWeight: '800', color: '#fff' },
  statusPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  statusPillText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  summaryDate: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 12 },
  summaryTotal: { fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: premium.surface,
    borderRadius: premium.radiusLg,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: premium.border,
    ...premium.shadowSoft,
  },
  addressIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressBody: { flex: 1 },
  addressLabel: { fontSize: 12, fontWeight: '600', color: premium.textMuted, marginBottom: 4 },
  addressName: { fontSize: 15, fontWeight: '700', color: premium.text, marginBottom: 2 },
  addressText: { fontSize: 13, color: premium.textSecondary, lineHeight: 18 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: premium.text, marginBottom: 12 },
  noItems: { color: premium.textMuted, marginBottom: 16 },
  paymentCard: {
    backgroundColor: premium.surface,
    borderRadius: premium.radiusLg,
    padding: 18,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: premium.border,
    ...premium.shadowSoft,
  },
  paymentTitle: { fontSize: 16, fontWeight: '800', color: premium.text, marginBottom: 14 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  paymentLabel: { fontSize: 14, color: premium.textSecondary, fontWeight: '500' },
  paymentValue: { fontSize: 14, fontWeight: '700', color: premium.text },
  paymentTotalRow: {
    marginTop: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: premium.border,
    marginBottom: 0,
  },
  totalLabel: { fontSize: 16, fontWeight: '700', color: premium.text },
  totalValue: { fontSize: 22, fontWeight: '800', color: premium.emerald },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: premium.surface,
    borderRadius: premium.radiusLg,
    padding: 16,
    borderWidth: 1,
    borderColor: premium.border,
    ...premium.shadowSoft,
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  supportText: { flex: 1 },
  supportTitle: { fontSize: 16, fontWeight: '700', color: premium.text },
  supportSub: { fontSize: 13, color: premium.textSecondary, marginTop: 2 },
});

