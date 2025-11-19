import { useEffect, useState } from 'react';

export default function AdminLogout(){
  const [seconds, setSeconds] = useState(2);
  useEffect(()=>{
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    const t = setInterval(()=> setSeconds(s=>s-1), 1000);
    const r = setTimeout(()=> { window.location.href = '/login'; }, 2000);
    return ()=> { clearInterval(t); clearTimeout(r); };
  },[]);
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-50 to-white p-4">
      <div className="w-full max-w-md bg-white border border-indigo-100 rounded-2xl shadow p-8 text-center">
        <div className="text-2xl font-extrabold text-indigo-700">Signed out</div>
        <p className="mt-2 text-gray-600">You have been securely logged out.</p>
        <p className="mt-2 text-sm text-gray-500">Redirecting to login in {seconds}s</p>
        <a href="/login" className="mt-6 inline-block rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 font-medium">Go to Login</a>
      </div>
    </div>
  );
}
