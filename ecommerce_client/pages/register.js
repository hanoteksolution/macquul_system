import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ email: '', username: '', first_name: '', last_name: '', password: '', password_confirm: '' });
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/auth/register/', form);
      localStorage.setItem('access', res.data.tokens.access);
      localStorage.setItem('refresh', res.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/';
    } catch (e) {
      setError('Registration failed');
    }
  };

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-8 flex-1 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={submit} className="bg-white rounded shadow p-4 space-y-3">
          <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="Email" type="email" className="w-full border rounded p-2" />
          <input value={form.username} onChange={e => set('username', e.target.value)} placeholder="Username" className="w-full border rounded p-2" />
          <div className="grid grid-cols-2 gap-2">
            <input value={form.first_name} onChange={e => set('first_name', e.target.value)} placeholder="First Name" className="w-full border rounded p-2" />
            <input value={form.last_name} onChange={e => set('last_name', e.target.value)} placeholder="Last Name" className="w-full border rounded p-2" />
          </div>
          <input value={form.password} onChange={e => set('password', e.target.value)} placeholder="Password" type="password" className="w-full border rounded p-2" />
          <input value={form.password_confirm} onChange={e => set('password_confirm', e.target.value)} placeholder="Confirm Password" type="password" className="w-full border rounded p-2" />
          <button className="w-full bg-primary-600 text-white py-2 rounded">Register</button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
