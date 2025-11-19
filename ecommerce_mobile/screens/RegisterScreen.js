import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ email: '', username: '', first_name: '', last_name: '', password: '', password_confirm: '' });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = async () => {
    try {
      setLoading(true);
      const res = await api.post('/auth/register/', form);
      await AsyncStorage.setItem('access', res.data.tokens.access);
      await AsyncStorage.setItem('refresh', res.data.tokens.refresh);
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert('Registration failed', 'Please check fields');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Register</Text>
      <TextInput placeholder="Email" value={form.email} onChangeText={v => set('email', v)} autoCapitalize='none' keyboardType='email-address' style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 10, marginBottom: 8 }} />
      <TextInput placeholder="Username" value={form.username} onChangeText={v => set('username', v)} style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 10, marginBottom: 8 }} />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput placeholder="First Name" value={form.first_name} onChangeText={v => set('first_name', v)} style={{ flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 10, marginBottom: 8 }} />
        <TextInput placeholder="Last Name" value={form.last_name} onChangeText={v => set('last_name', v)} style={{ flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 10, marginBottom: 8 }} />
      </View>
      <TextInput placeholder="Password" value={form.password} onChangeText={v => set('password', v)} secureTextEntry style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 10, marginBottom: 8 }} />
      <TextInput placeholder="Confirm Password" value={form.password_confirm} onChangeText={v => set('password_confirm', v)} secureTextEntry style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 10, marginBottom: 12 }} />
      <Button title={loading ? 'Please wait...' : 'Create Account'} onPress={submit} disabled={loading} />
    </View>
  );
}
