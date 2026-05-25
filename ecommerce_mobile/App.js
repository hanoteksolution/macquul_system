import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider } from './context/CartContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AlertProvider } from './context/AlertContext';
import AppThemeRoot from './components/AppThemeRoot';
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
import { navigationRef, registerAndroidBackHandler } from './utils/androidBackNavigation';

const Stack = createNativeStackNavigator();

const MainTabScreen = ({ navigation, route }) => (
  <CustomBottomTabs navigation={navigation} route={route}>
    <HomeScreen />
    <ProductsScreen />
    <OrdersScreen />
    <ProfileScreen />
  </CustomBottomTabs>
);

function AppNavigation() {
  const { premium, isDarkMode } = useTheme();

  useEffect(() => {
    const sub = registerAndroidBackHandler();
    return () => sub.remove();
  }, []);

  const navTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      primary: premium.indigo,
      background: premium.background,
      card: premium.surface,
      text: premium.text,
      border: premium.border,
    },
  };

  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: premium.background },
        }}
      >
        <Stack.Screen name="Main" component={MainTabScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Wishlist" component={WishlistScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppThemeRoot>
          <AlertProvider>
            <CartProvider>
              <AppNavigation />
            </CartProvider>
          </AlertProvider>
        </AppThemeRoot>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
