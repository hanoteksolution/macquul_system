import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: 0, category_id: '' });

  const load = async () => {
    const [p, c] = await Promise.all([
      api.get('/products/'),
      api.get('/categories/'),
    ]);
    setProducts(p.data);
    setCategories(c.data);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    try {
      await api.post('/products/', form);
      setForm({ name: '', description: '', price: 0, category_id: '' });
      load();
    } catch {}
  };

  const remove = async (id) => {
    if (!confirm('Delete product?')) return;
    await api.delete(`/products/${id}/`);
    load();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-8 flex-1">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <div className="bg-white rounded shadow p-4 space-y-3 mb-6">
          <div className="grid grid-cols-2 gap-2">
            <input className="border rounded p-2" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input className="border rounded p-2" placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
          </div>
          <textarea className="border rounded p-2 w-full" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <select className="border rounded p-2" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={create} className="bg-primary-600 text-white px-4 py-2 rounded">Create</button>
        </div>
        <table className="w-full bg-white rounded shadow overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Category</th>
              <th className="text-left p-2">Price</th>
              <th className="text-left p-2">Stock</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.category?.name}</td>
                <td className="p-2">${p.price}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2">
                  <button onClick={() => remove(p.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <Footer />
    </div>
  );
}
