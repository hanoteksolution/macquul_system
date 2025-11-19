import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/auth/login/', { email, password });
      localStorage.setItem('access', res.data.tokens.access);
      localStorage.setItem('refresh', res.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/';
    } catch (e) {
      setError(e.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-8 flex-1 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={submit} className="bg-white rounded shadow p-4 space-y-3">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full border rounded p-2" />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border rounded p-2" />
          <button className="w-full bg-primary-600 text-white py-2 rounded">Login</button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
