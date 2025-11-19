import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

export default function Stock() {
  const [movements, setMovements] = useState([]);
  const [form, setForm] = useState({ product: '', quantity_change: 0, type: 'IN' });
  const [products, setProducts] = useState([]);

  const load = async () => {
    const [m, p] = await Promise.all([
      api.get('/stock/'),
      api.get('/products/'),
    ]);
    setMovements(m.data);
    setProducts(p.data);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    await api.post('/stock/', form);
    setForm({ product: '', quantity_change: 0, type: 'IN' });
    load();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-8 flex-1">
        <h1 className="text-2xl font-bold mb-4">Stock Movements</h1>
        <div className="bg-white rounded shadow p-4 space-y-3 mb-6">
          <select className="border rounded p-2" value={form.product} onChange={e => setForm({ ...form, product: e.target.value })}>
            <option value="">Select Product</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input className="border rounded p-2" type="number" placeholder="Quantity" value={form.quantity_change} onChange={e => setForm({ ...form, quantity_change: Number(e.target.value) })} />
          <select className="border rounded p-2" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </select>
          <button onClick={create} className="bg-primary-600 text-white px-4 py-2 rounded">Add Movement</button>
        </div>
        <ul className="bg-white rounded shadow divide-y">
          {movements.map(m => (
            <li key={m.id} className="p-3 flex justify-between">
              <div>
                <div className="font-semibold">{m.product_name}</div>
                <div className="text-sm text-gray-500">{m.type} {m.quantity_change}</div>
              </div>
              <div className="text-sm text-gray-400">{new Date(m.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
