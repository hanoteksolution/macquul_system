import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: '', first_name: '', last_name: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/users/profile').then(res => {
      setUser(res.data);
      setForm({ username: res.data.username, first_name: res.data.first_name, last_name: res.data.last_name });
    });
  }, []);

  const save = async () => {
    try {
      const res = await api.put('/users/profile', form);
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMessage('Profile updated');
    } catch {
      setMessage('Update failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-8 flex-1 max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        {user && (
          <div className="bg-white rounded shadow p-4 space-y-3">
            <input className="w-full border rounded p-2" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <input className="w-full border rounded p-2" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
              <input className="w-full border rounded p-2" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
            </div>
            <button onClick={save} className="bg-primary-600 text-white px-4 py-2 rounded">Save</button>
            {message && <div className="text-sm text-gray-600">{message}</div>}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
