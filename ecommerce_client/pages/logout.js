import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Logout() {
  const [seconds, setSeconds] = useState(2);

  useEffect(() => {
    // clear tokens
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    const r = setTimeout(() => {
      window.location.href = '/';
    }, 2000);
    return () => { clearInterval(t); clearTimeout(r); };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-16 flex-1 grid place-items-center">
        <div className="w-full max-w-lg bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center">
          <div className="text-3xl font-extrabold text-primary-700">Signed out</div>
          <p className="mt-2 text-gray-600">You have been logged out successfully.</p>
          <p className="mt-2 text-sm text-gray-500">Redirecting to home in {seconds}s</p>
          <a href="/" className="mt-6 inline-block rounded-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 font-medium">Go Home</a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
