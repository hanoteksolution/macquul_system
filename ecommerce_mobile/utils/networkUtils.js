import { Platform } from 'react-native';

// Function to get the correct API URL for mobile development
export const getApiUrl = () => {
  // For Android emulator, use 10.0.2.2 to connect to host machine
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }
  
  // For iOS simulator, localhost works
  if (Platform.OS === 'ios') {
    return 'http://localhost:8000';
  }
  
  // Fallback
  return 'http://localhost:8000';
};

// Alternative URLs to try in order
export const getAlternativeUrls = () => [
  getApiUrl(),
  'http://192.168.1.100:8000', // Common router IP
  'http://192.168.0.100:8000', // Another common router IP
  'http://10.161.1.4:8000',    // Your current network IP
  'http://127.0.0.1:8000',     // Localhost
];

// Function to test API connectivity
export const testApiConnection = async (baseUrl) => {
  try {
    const response = await fetch(`${baseUrl}/api/products/`, {
      method: 'GET',
      timeout: 5000,
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Find working API URL
export const findWorkingApiUrl = async () => {
  const urls = getAlternativeUrls();
  
  for (const url of urls) {
    console.log(`Testing API connection to: ${url}`);
    const isWorking = await testApiConnection(url);
    if (isWorking) {
      console.log(`✅ Found working API URL: ${url}`);
      return url;
    }
  }
  
  console.log('❌ No working API URL found');
  return null;
};
