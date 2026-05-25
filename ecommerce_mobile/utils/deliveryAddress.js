import AsyncStorage from '@react-native-async-storage/async-storage';

const ADDRESS_KEY = 'delivery_address';
const EVC_PHONE_KEY = 'evc_payment_phone';

export function getUserDisplayName(user) {
  if (!user) return '';
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`.trim();
  }
  return user.username || user.email || '';
}

export async function loadDeliveryAddress() {
  try {
    const raw = await AsyncStorage.getItem(ADDRESS_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return {
      line1: data.line1 || '',
      line2: data.line2 || '',
    };
  } catch {
    return null;
  }
}

export async function saveDeliveryAddress(address) {
  await AsyncStorage.setItem(
    ADDRESS_KEY,
    JSON.stringify({ line1: address.line1 || '', line2: address.line2 || '' })
  );
}

export function isAddressComplete(address) {
  return !!(address?.line1?.trim());
}

export async function loadEvcPaymentPhone() {
  try {
    return (await AsyncStorage.getItem(EVC_PHONE_KEY)) || '';
  } catch {
    return '';
  }
}

export async function saveEvcPaymentPhone(phone) {
  await AsyncStorage.setItem(EVC_PHONE_KEY, phone.trim());
}

export function isEvcPhoneValid(phone) {
  const digits = (phone || '').replace(/\D/g, '');
  return digits.length >= 9;
}
