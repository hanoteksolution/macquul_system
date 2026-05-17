'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { CarouselSlide, Product } from '@/lib/types';

const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    title: 'Special Offers',
    subtitle: "Limited time deals you don't want to miss",
    cta_text: 'View Deals',
    cta_link: '#products',
    background_color: '#4f46e5',
    text_color: '#ffffff',
  },
  {
    id: 2,
    title: 'New Arrivals',
    subtitle: 'Latest electronics & stationery in stock',
    cta_text: 'Shop Now',
    cta_link: '#products',
    background_color: '#7c3aed',
    text_color: '#ffffff',
  },
  {
    id: 3,
    title: 'Back to School',
    subtitle: 'All essentials for the season',
    cta_text: 'Browse Categories',
    cta_link: '#categories',
    background_color: '#0891b2',
    text_color: '#ffffff',
  },
];

const FALLBACK_BG = ['#4f46e5', '#7c3aed', '#0891b2', '#059669', '#db2777'];

function buildProductSlides(products: Product[]): CarouselSlide[] {
  return products.slice(0, 5).map((p, i) => ({
    id: p.id,
    title: p.name,
    subtitle: p.description || 'Premium quality · Fast delivery',
    cta_text: 'Shop now',
    cta_link: `/product/${p.id}`,
    image_url: p.image_url,
    background_color: FALLBACK_BG[i % FALLBACK_BG.length],
    text_color: '#ffffff',
  }));
}

function normalizeSlides(apiSlides: CarouselSlide[], products: Product[]): CarouselSlide[] {
  if (apiSlides?.length > 0) {
    return [...apiSlides].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
  if (products.length > 0) return buildProductSlides(products);
  return DEFAULT_SLIDES;
}

function resolveCtaHref(link?: string) {
  if (!link || link === '#') return '/shop';
  if (link.startsWith('#')) return link;
  if (link.startsWith('/')) return link;
  return link;
}

interface HeroSectionProps {
  slides: CarouselSlide[];
  products: Product[];
}

export default function HeroSection({ slides: apiSlides, products }: HeroSectionProps) {
  const slides = useMemo(() => normalizeSlides(apiSlides, products), [apiSlides, products]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const slide = slides[index] ?? slides[0];
  const bg = slide?.background_color || '#4f46e5';
  const fg = slide?.text_color || '#ffffff';

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + slides.length) % slides.length);
    },
    [slides.length]
  );

  const goTo = useCallback((i: number) => setIndex(i), []);

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (!playing || slides.length < 2) return;
    const t = setInterval(() => go(1), 5000);
    return () => clearInterval(t);
  }, [playing, slides.length, go]);

  const onCtaClick = (e: React.MouseEvent, link?: string) => {
    if (!link?.startsWith('#')) return;
    e.preventDefault();
    const id = link.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!slide) return null;

  return (
    <section className="relative overflow-hidden">
      <div className="container-store py-6 lg:py-10">
        <div
          className="relative min-h-[320px] overflow-hidden rounded-2xl shadow-float lg:min-h-[380px] lg:rounded-3xl"
          style={{ backgroundColor: bg, color: fg }}
        >
          {/* Slide transition — full banner */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id ?? index}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="grid min-h-[320px] grid-cols-1 items-center gap-6 px-6 py-10 lg:min-h-[380px] lg:grid-cols-2 lg:gap-10 lg:px-12 lg:py-12"
            >
              <div className="relative z-10 text-center lg:text-left">
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{slide.title}</h2>
                {slide.subtitle && (
                  <p className="mt-3 text-base opacity-90 sm:text-lg lg:max-w-lg">{slide.subtitle}</p>
                )}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <Link
                    href={resolveCtaHref(slide.cta_link)}
                    onClick={(e) => onCtaClick(e, slide.cta_link)}
                    className="rounded-full bg-white px-6 py-3 text-sm font-semibold shadow-lg transition hover:scale-105"
                    style={{ color: bg }}
                  >
                    {slide.cta_text || 'Shop now'}
                  </Link>
                  <Link
                    href="#categories"
                    onClick={(e) => onCtaClick(e, '#categories')}
                    className="rounded-full border-2 border-white/50 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
                  >
                    Browse categories
                  </Link>
                </div>
              </div>

              <div className="relative z-10 mx-auto h-44 w-full max-w-md overflow-hidden rounded-2xl border border-white/25 shadow-xl sm:h-52 lg:mx-0 lg:h-56 lg:max-w-none">
                {slide.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide.image_url}
                    alt={slide.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/10">
                    <span className="text-5xl opacity-60">🛍️</span>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Side arrows (on banner) */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-brand-700 shadow-md transition hover:scale-110 hover:bg-white lg:left-5 lg:h-11 lg:w-11"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-brand-700 shadow-md transition hover:scale-110 hover:bg-white lg:right-5 lg:h-11 lg:w-11"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Bottom controls: play/pause + dots */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
                className="grid h-8 w-8 place-items-center rounded-full bg-white/25 backdrop-blur-sm transition hover:bg-white/40"
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <div className="flex items-center gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s.id ?? i}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => goTo(i)}
                    className={`rounded-full transition-all ${
                      i === index ? 'h-2.5 w-8 bg-white' : 'h-2.5 w-2.5 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
