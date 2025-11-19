import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

export default function WishlistScreen({ navigation }) {
  const { theme } = useTheme();
  const { wishlist, addToCart, removeFromWishlist } = useCart();

  const handleRemoveFromWishlist = async (product) => {
    await removeFromWishlist(product);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.item, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.imageContainer}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.image} />
        ) : (
          <Text style={[styles.placeholder, { color: theme.textSecondary }]}>📦</Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.price, { color: theme.primary }]}>${item.price}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRemoveFromWishlist(item)}>
        <Text style={styles.remove}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.back, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Wishlist</Text>
      </View>

      {wishlist.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Your wishlist is empty</Text>
          <TouchableOpacity style={[styles.shopButton, { backgroundColor: theme.primary }]} onPress={() => navigation.goBack()}>
            <Text style={styles.shopText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 50 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginLeft: 16 },
  item: { flexDirection: 'row', padding: 16, backgroundColor: colors.surface, margin: 8, borderRadius: 8 },
  imageContainer: { width: 60, height: 60, backgroundColor: colors.border, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%', borderRadius: 8 },
  placeholder: { fontSize: 24 },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  price: { fontSize: 14, color: colors.primary, marginTop: 4 },
  remove: { fontSize: 20 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: colors.textSecondary, marginBottom: 20 },
  shopButton: { backgroundColor: colors.primary, padding: 16, borderRadius: 8 },
  shopText: { color: 'white', fontWeight: 'bold' },
});
