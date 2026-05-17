'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gift, Truck, Headphones, Sparkles, type LucideIcon } from 'lucide-react';
import { useStorefrontData } from '@/contexts/StorefrontContext';
import type { AnnouncementItem } from '@/lib/storefront-types';

const ICONS: Record<string, LucideIcon> = {
  truck: Truck,
  gift: Gift,
  headphones: Headphones,
  sparkles: Sparkles,
};

function PromoLine({ item }: { item: AnnouncementItem }) {
  const Icon = ICONS[item.icon] ?? null;
  const content = (
    <span className="flex items-center gap-1.5 whitespace-nowrap">
      {Icon && <Icon className="h-3.5 w-3.5 opacity-90" />}
      {item.text}
    </span>
  );
  if (item.link) {
    const href = item.link.startsWith('#') ? item.link : item.link;
    if (href.startsWith('#')) {
      return (
        <a
          href={href}
          className="hidden md:flex"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className="hidden md:flex hover:underline">
        {content}
      </Link>
    );
  }
  return <span className="hidden md:flex">{content}</span>;
}

const DEFAULT_PRIMARY = { badge_text: 'NEW', text: 'Spring collection — Shop now' };
const DEFAULT_PROMOS = [
  { icon: 'truck', text: 'Free shipping on orders over $75' },
  { icon: 'gift', text: 'New members get 15% off — code WELCOME15' },
  { icon: 'headphones', text: '24/7 premium support' },
];

export default function AnnouncementBar() {
  const storefront = useStorefrontData();
  const header = storefront?.header;
  const primary = storefront?.announcement_primary;
  const promos = storefront?.announcements?.length
    ? storefront.announcements
    : DEFAULT_PROMOS.map((p, i) => ({ id: i, position: 'promo' as const, ...p }));

  const primaryBadge = primary?.badge_text || DEFAULT_PRIMARY.badge_text;
  const primaryText = primary?.text || DEFAULT_PRIMARY.text;
  const locale = header?.default_locale || 'EN';
  const currency = header?.currency || 'USD';

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-brand-600 via-violet-600 to-cyan-600 text-white"
    >
      <div className="container-store flex h-9 items-center justify-between text-xs font-medium sm:text-sm">
        <p className="hidden items-center gap-2 sm:flex">
          {primaryBadge && (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] uppercase tracking-wider">
              {primaryBadge}
            </span>
          )}
          {primary?.link ? (
            <Link href={primary.link.startsWith('#') ? '/' : primary.link} className="hover:underline">
              {primaryText}
            </Link>
          ) : (
            primaryText
          )}
        </p>
        <div className="flex flex-1 items-center justify-center gap-6 overflow-hidden">
          {promos.map((item) => (
            <PromoLine key={item.id ?? item.text} item={item} />
          ))}
          <span className="md:hidden">{promos[0]?.text}</span>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <button type="button" className="hover:underline">
            {locale}
          </button>
          <span className="opacity-40">|</span>
          <button type="button" className="hover:underline">
            {currency}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
