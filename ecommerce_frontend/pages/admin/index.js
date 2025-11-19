import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Admin() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-8 flex-1">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid gap-3">
          <Link className="underline text-primary-700" href="/admin/products">Manage Products</Link>
          <Link className="underline text-primary-700" href="/admin/stock">Stock Movements</Link>
          <Link className="underline text-primary-700" href="/admin/pos">POS Panel</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
