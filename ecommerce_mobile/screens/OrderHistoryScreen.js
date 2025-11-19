import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import api from '../services/api';

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/').then(res => setOrders(res.data));
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Order History</Text>
      <FlatList
        data={orders}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#eee' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: '600' }}>Order #{item.id}</Text>
              <Text>Status: {item.status}</Text>
            </View>
            <Text>Total: ${item.total_price}</Text>
            {item.items?.map(it => (
              <Text key={it.id} style={{ color: '#6b7280' }}>{it.product_name} x {it.quantity} @ ${it.price}</Text>
            ))}
          </View>
        )}
      />
    </View>
  );
}
