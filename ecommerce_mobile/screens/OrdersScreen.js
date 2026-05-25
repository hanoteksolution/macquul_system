import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isAuthenticated } from '../utils/auth';
import api from '../services/api';
import PremiumSearchBar from '../components/premium/PremiumSearchBar';
import OrdersScreenHeader from '../components/premium/orders/OrdersScreenHeader';
import OrderFilterTabs from '../components/premium/orders/OrderFilterTabs';
import PremiumOrderCard from '../components/premium/orders/PremiumOrderCard';
import PremiumEmptyState from '../components/premium/PremiumEmptyState';
import { orderMatchesFilter, normalizeStatus } from '../utils/orderStatus';
import { goToShop } from '../utils/navigationHelpers';
import usePremiumTheme from '../hooks/usePremiumTheme';
import useThemedStyles from '../hooks/useThemedStyles';
import OrdersScreenShimmer from '../components/premium/skeletons/OrdersScreenShimmer';

function buildFilterCounts(orders) {
  const counts = { all: orders.length };
  orders.forEach((o) => {
    const s = normalizeStatus(o?.status);
    if (s === 'pending') counts.pending = (counts.pending || 0) + 1;
    if (s === 'processing' || s === 'shipped') counts.processing = (counts.processing || 0) + 1;
    if (s === 'completed' || s === 'delivered') counts.completed = (counts.completed || 0) + 1;
    if (s === 'cancelled') counts.cancelled = (counts.cancelled || 0) + 1;
  });
  return counts;
}

export default function OrdersScreen({ navigation, setActiveTab, bottomInset = 52 }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const searchRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);

  useEffect(() => {
    checkAuthAndLoadOrders();
  }, []);

  const checkAuthAndLoadOrders = async () => {
    const isAuth = await isAuthenticated();
    setAuthenticated(isAuth);
    if (isAuth) await loadOrders();
    else setLoading(false);
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/');
      setOrders(response.data?.results || response.data || []);
    } catch (error) {
      if (error.response?.status === 401) setAuthenticated(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterCounts = useMemo(() => buildFilterCounts(orders), [orders]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orders.filter((o) => {
      if (!orderMatchesFilter(o, filter)) return false;
      if (!q) return true;
      const idMatch = String(o.id).includes(q);
      const statusMatch = (o.status || '').toLowerCase().includes(q);
      return idMatch || statusMatch;
    });
  }, [orders, filter, searchQuery]);

  const toggleSearch = () => {
    setSearchVisible((v) => {
      const next = !v;
      if (!next) setSearchQuery('');
      else setTimeout(() => searchRef.current?.focus?.(), 100);
      return next;
    });
  };

  const ListHeader = () => (
    <>
      <OrdersScreenHeader
        searchActive={searchVisible}
        onSearchPress={toggleSearch}
        onRefresh={() => {
          setRefreshing(true);
          loadOrders();
        }}
        refreshing={refreshing}
      />
      {searchVisible ? (
        <PremiumSearchBar
          ref={searchRef}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by order # or status..."
        />
      ) : null}
      <OrderFilterTabs active={filter} onChange={setFilter} counts={filterCounts} />
      {filtered.length > 0 ? (
        <View style={styles.listHead}>
          <Text style={styles.listTitle}>
            {filter === 'all' ? 'All orders' : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}
          </Text>
          <Text style={styles.listSub}>Pull down to refresh</Text>
        </View>
      ) : null}
    </>
  );

  if (!authenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <OrdersScreenHeader onSearchPress={() => {}} onRefresh={() => {}} />
        <PremiumEmptyState
          icon="receipt-outline"
          title="Login required"
          subtitle="Sign in to view your order history and track deliveries."
          buttonLabel="Sign In"
          onButtonPress={() => navigation.navigate('Login')}
        />
      </SafeAreaView>
    );
  }

  if (loading) {
    return <OrdersScreenShimmer />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {filtered.length === 0 ? (
        <FlatList
          data={[]}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <PremiumEmptyState
              icon="cube-outline"
              title={searchQuery ? 'No matching orders' : 'No orders yet'}
              subtitle={
                searchQuery
                  ? 'Try a different order number or filter.'
                  : 'Start shopping to see your orders here.'
              }
              buttonLabel={searchQuery ? undefined : 'Start shopping'}
              onButtonPress={searchQuery ? undefined : () => (setActiveTab ? setActiveTab(1) : goToShop(navigation))}
            />
          }
          contentContainerStyle={[styles.list, { paddingBottom: bottomInset, flexGrow: 1 }]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadOrders();
              }}
              tintColor={premium.indigo}
              colors={[premium.indigo]}
            />
          }
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={ListHeader}
          renderItem={({ item }) => (
            <PremiumOrderCard
              order={item}
              onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
            />
          )}
          contentContainerStyle={[styles.list, { paddingBottom: bottomInset }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadOrders();
              }}
              tintColor={premium.indigo}
              colors={[premium.indigo]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (premium) => ({

  container: { flex: 1, backgroundColor: premium.background },
  list: { paddingHorizontal: 20 },
  listHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listTitle: { fontSize: 16, fontWeight: '800', color: premium.text },
  listSub: { fontSize: 11, fontWeight: '600', color: premium.textMuted },
});

