import AsyncStorage from '@react-native-async-storage/async-storage';

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('access');
    const user = await AsyncStorage.getItem('user');
    return !!(accessToken && user);
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Get current user data
export const getCurrentUser = async () => {
  try {
    const userString = await AsyncStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Get access token
export const getAccessToken = async () => {
  try {
    return await AsyncStorage.getItem('access');
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

// Logout user
export const logout = async () => {
  try {
    await AsyncStorage.multiRemove(['access', 'refresh', 'user']);
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};
