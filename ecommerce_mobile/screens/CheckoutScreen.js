import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { getCurrentUser, isAuthenticated } from '../utils/auth';
import { getOrderTotals } from '../utils/cartPricing';
import {
  loadDeliveryAddress,
  saveDeliveryAddress,
  isAddressComplete,
  getUserDisplayName,
  loadEvcPaymentPhone,
  saveEvcPaymentPhone,
  isEvcPhoneValid,
} from '../utils/deliveryAddress';
import premiumAlert from '../utils/premiumAlert';
import CheckoutScreenHeader from '../components/premium/checkout/CheckoutScreenHeader';
import DeliveryAddressSection from '../components/premium/checkout/DeliveryAddressSection';
import PaymentMethodSection from '../components/premium/checkout/PaymentMethodSection';
import OrderSummarySection from '../components/premium/checkout/OrderSummarySection';
import CheckoutPlaceOrderBar from '../components/premium/checkout/CheckoutPlaceOrderBar';
import AddressEditorModal from '../components/premium/checkout/AddressEditorModal';
import usePremiumTheme from '../hooks/usePremiumTheme';
import useThemedStyles from '../hooks/useThemedStyles';
import CheckoutScreenShimmer from '../components/premium/skeletons/CheckoutScreenShimmer';

const EMPTY_ADDRESS = { line1: '', line2: '' };

export default function CheckoutScreen({ navigation, route }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const insets = useSafeAreaInsets();
  const { cart: contextCart, clearCart } = useCart();
  const cartItems = route.params?.cartItems?.length ? route.params.cartItems : contextCart;
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [evcPhone, setEvcPhone] = useState('');
  const [addressModal, setAddressModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hydrating, setHydrating] = useState(true);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + parseFloat(item.price || 0) * item.quantity, 0),
    [cartItems]
  );
  const totals = useMemo(() => getOrderTotals(subtotal), [subtotal]);

  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        setCustomerName(getUserDisplayName(user));

        const savedAddress = await loadDeliveryAddress();
        if (savedAddress?.line1) {
          setAddress(savedAddress);
        } else if (user?.address || user?.shipping_address) {
          const fromUser = {
            line1: user.address || user.shipping_address || '',
            line2: user.city ? `${user.city}${user.state ? `, ${user.state}` : ''}` : '',
          };
          if (fromUser.line1) {
            setAddress(fromUser);
            await saveDeliveryAddress(fromUser);
          }
        }

        const savedPhone = await loadEvcPaymentPhone();
        if (savedPhone) {
          setEvcPhone(savedPhone);
        } else if (user?.phone || user?.mobile) {
          setEvcPhone(user.phone || user.mobile || '');
        }
      } finally {
        setHydrating(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!cartItems.length) {
      navigation.replace('Cart');
    }
  }, [cartItems.length, navigation]);

  const openAddressEditor = () => setAddressModal(true);

  const handleSaveAddress = async (next) => {
    setAddress(next);
    await saveDeliveryAddress(next);
  };

  const handleEvcPhoneChange = async (value) => {
    setEvcPhone(value);
    if (isEvcPhoneValid(value)) {
      await saveEvcPaymentPhone(value);
    }
  };

  const placeOrder = async () => {
    if (!customerName.trim()) {
      premiumAlert('Account name missing', 'Please sign in with a profile that has your name set.', [
        { text: 'Sign In', onPress: () => navigation.navigate('Login') },
        { text: 'Cancel', style: 'cancel' },
      ], { variant: 'warning' });
      return;
    }
    if (!isAddressComplete(address)) {
      premiumAlert('Address required', 'Please add your delivery address (street / area).', [
        { text: 'Add address', onPress: openAddressEditor },
        { text: 'Cancel', style: 'cancel' },
      ], { variant: 'warning' });
      return;
    }
    if (!isEvcPhoneValid(evcPhone)) {
      premiumAlert('EVC number required', 'Enter a valid mobile number for EVC payment (at least 9 digits).', [
        { text: 'OK' },
      ], { variant: 'warning' });
      return;
    }
    if (!(await isAuthenticated())) {
      premiumAlert('Login required', 'Please sign in to place your order.', [
        { text: 'Sign In', onPress: () => navigation.navigate('Login') },
      ], { variant: 'login' });
      return;
    }

    await saveEvcPaymentPhone(evcPhone);

    try {
      setLoading(true);
      const deliveryLine = [address.line1, address.line2].filter(Boolean).join(', ');
      await api.post('/orders/', {
        items: cartItems.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        payment_method: 'evc',
        delivery_address: deliveryLine,
        recipient_name: customerName,
        phone: evcPhone.replace(/\s/g, ''),
      });
      await clearCart();
      premiumAlert('Order placed!', 'Your order was submitted successfully.', [
        { text: 'View orders', onPress: () => navigation.navigate('Main', { tab: 2 }) },
        { text: 'Done', onPress: () => navigation.navigate('Cart') },
      ], { variant: 'success' });
    } catch (error) {
      if (error.response?.status === 401) {
        premiumAlert('Session expired', 'Please sign in again to continue.', [
          { text: 'Sign In', onPress: () => navigation.navigate('Login') },
        ], { variant: 'login' });
      } else {
        premiumAlert(
          'Order failed',
          error.response?.data?.detail || 'Please try again.',
          [{ text: 'OK' }],
          { variant: 'error' }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length) return null;

  if (hydrating) {
    return <CheckoutScreenShimmer />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CheckoutScreenHeader onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <DeliveryAddressSection
          customerName={customerName}
          address={address}
          onEdit={openAddressEditor}
          onAddNew={openAddressEditor}
        />
        <PaymentMethodSection evcPhone={evcPhone} onEvcPhoneChange={handleEvcPhoneChange} />
        <OrderSummarySection cart={cartItems} totals={totals} />
        <View style={{ height: 140 }} />
      </ScrollView>

      <View style={{ paddingBottom: Math.max(insets.bottom, 8) }}>
        <CheckoutPlaceOrderBar
          total={totals.total}
          onPlaceOrder={placeOrder}
          loading={loading}
        />
      </View>

      <AddressEditorModal
        visible={addressModal}
        initial={address}
        onClose={() => setAddressModal(false)}
        onSave={handleSaveAddress}
      />
    </SafeAreaView>
  );
}

const createStyles = (premium) => ({

  container: { flex: 1, backgroundColor: premium.background },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
});

