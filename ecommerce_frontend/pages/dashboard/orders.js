import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import OrderCard from '../../components/OrderCard';
import api from '../../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    api.get('/orders/').then(res => setOrders(res.data));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-8 flex-1">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        <div className="grid gap-4">
          {orders.map(o => <OrderCard key={o.id} order={o} />)}
        </div>
      </main>
      <Footer />
    </div>
  );
}
