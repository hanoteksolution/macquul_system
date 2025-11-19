import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import CustomBottomTabs from './components/CustomBottomTabs';
import HomeScreen from './screens/HomeScreen';
import ProductsScreen from './screens/ProductsScreen';
import OrdersScreen from './screens/OrdersScreen';
import ProfileScreen from './screens/ProfileScreen';
import CartScreen from './screens/CartScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import WishlistScreen from './screens/WishlistScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import OrderDetailScreen from './screens/OrderDetailScreen';

const Stack = createNativeStackNavigator();

const MainTabScreen = ({ navigation }) => {
  return (
    <CustomBottomTabs navigation={navigation}>
      <HomeScreen />
      <ProductsScreen />
      <OrdersScreen />
      <ProfileScreen />
    </CustomBottomTabs>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen 
              name="Main" 
              component={MainTabScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Cart" 
              component={CartScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="ProductDetail" 
              component={ProductDetailScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Wishlist" 
              component={WishlistScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Checkout" 
              component={CheckoutScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="OrderDetail" 
              component={OrderDetailScreen} 
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </ThemeProvider>
  );
}
