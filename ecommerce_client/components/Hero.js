import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const defaultSlides = [
  {
    title: 'Special Offers',
    subtitle: "Limited time deals you don't want to miss",
    cta_text: 'View Deals',
    cta_link: '#products',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Latest electronics & stationery in stock',
    cta_text: 'Shop Now',
    cta_link: '#products',
  },
  {
    title: 'Back to School',
    subtitle: 'All essentials for the season',
    cta_text: 'Browse',
    cta_link: '#categories',
  },
];

export default function Hero() {
  const [slides, setSlides] = useState(defaultSlides);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    // Fetch carousel slides from API
    api.get('/carousel/slides/active/')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setSlides(res.data);
        }
      })
      .catch(() => {
        // Keep default slides if API fails
        console.log('Using default carousel slides');
      });
  }, []);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const next = () => setIdx((i) => (i + 1) % slides.length);
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);

  const s = slides[idx];

  return (
    <section className="relative overflow-hidden">
      <div className="container py-8 lg:py-10">
        <div 
          className="relative rounded-2xl lg:rounded-[22px] px-6 lg:px-10 py-10 shadow-xl"
          style={{ 
            backgroundColor: s.background_color || '#10b981',
            color: s.text_color || '#ffffff'
          }}
        >
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/70 text-primary-700 grid place-items-center hover:bg-white">
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/70 text-primary-700 grid place-items-center hover:bg-white">
            <ChevronRightIcon className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">{s.title}</h2>
              <p className="mt-2 opacity-90">{s.subtitle}</p>
              <div className="mt-6 flex items-center gap-3">
                <Link href={s.cta_link || '#products'} className="px-5 py-3 rounded-full bg-white text-primary-700 font-medium shadow hover:shadow-md">{s.cta_text || s.cta}</Link>
                <Link href="#categories" className="px-5 py-3 rounded-full border border-white/50 font-medium hover:bg-white/10">Browse Categories</Link>
              </div>
            </div>
            <div className="h-40 lg:h-52 rounded-xl lg:rounded-2xl border border-white/20 overflow-hidden">
              {s.image_url ? (
                <img src={s.image_url} alt={s.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/10 flex items-center justify-center">
                  <div className="text-center text-white/60">
                    <div className="text-4xl mb-2">🖼️</div>
                    <div className="text-sm">Slide Image</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {slides.map((_, i) => (
              <span key={i} className={`w-2 h-2 rounded-full ${i===idx ? 'bg-white' : 'bg-white/60'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
