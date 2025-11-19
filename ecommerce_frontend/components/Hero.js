import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container grid grid-cols-1 lg:grid-cols-2 items-center gap-8 py-10 lg:py-14">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">New season • Best deals</span>
          <h1 className="mt-4 text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">Welcome to Our Electronics & Stationery Store</h1>
          <p className="mt-3 text-gray-600 max-w-xl">Discover amazing products at unbeatable prices. Laptops, smartphones, notebooks, pens, and everything you need to work smarter.</p>
          <div className="mt-6 flex items-center gap-3">
            <Link href="#products" className="px-5 py-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-medium">Shop Now</Link>
            <Link href="#categories" className="px-5 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">Browse Categories</Link>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-primary-100 via-white to-primary-50 border border-primary-100 shadow-lg" />
          {/* Slider dots */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-600"></span>
            <span className="w-2 h-2 rounded-full bg-primary-300"></span>
            <span className="w-2 h-2 rounded-full bg-primary-300"></span>
          </div>
        </div>
      </div>
    </section>
  );
}
