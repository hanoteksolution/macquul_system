import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BookGrid from '../../components/BookGrid';
import api from '../../services/api';

export default function POS() {
  const [locations, setLocations] = useState([]);
  const [products, setProducts] = useState([]);

  const load = async () => {
    const [loc, p] = await Promise.all([
      api.get('/pos/books/'),
      api.get('/products/'),
    ]);
    setLocations(loc.data);
    setProducts(p.data);
  };

  useEffect(() => { load(); }, []);

  const updateCell = async (row, column, current) => {
    const productId = prompt('Enter product id to place here (leave empty to clear):');
    if (productId === null) return;
    if (current) {
      await api.put(`/pos/books/${current.id}/`, { product: productId || current.product, row, column });
    } else {
      await api.post('/pos/books/', { product: productId, row, column });
    }
    load();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-8 flex-1">
        <h1 className="text-2xl font-bold mb-4">POS Panel</h1>
        <BookGrid rows={6} cols={10} locations={locations} onSelect={updateCell} />
      </main>
      <Footer />
    </div>
  );
}
