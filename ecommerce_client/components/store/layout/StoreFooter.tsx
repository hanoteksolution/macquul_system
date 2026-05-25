'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  Headphones,
  CreditCard,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
const linkGroups = {
  Shop: [
    { label: 'All products', href: '/shop' },
    { label: 'Featured', href: '/#featured' },
    { label: 'New arrivals', href: '/shop?sort=new' },
    { label: 'Wishlist', href: '/wishlist' },
  ],
  Account: [
    { label: 'Sign in', href: '/login' },
    { label: 'Create account', href: '/register' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Order history', href: '/dashboard?tab=orders' },
  ],
  Support: [
    { label: 'Contact us', href: '#' },
    { label: 'Shipping & delivery', href: '#' },
    { label: 'Returns & refunds', href: '#' },
    { label: 'FAQs', href: '#' },
  ],
};

const trustItems = [
  { icon: ShieldCheck, label: 'Secure checkout', desc: '256-bit SSL encryption' },
  { icon: Truck, label: 'Fast delivery', desc: 'Tracked nationwide shipping' },
  { icon: Headphones, label: 'Expert support', desc: 'Dedicated care team' },
];

const paymentLabels = ['Visa', 'Mastercard', 'PayPal', 'Mobile money'];

export default function StoreFooter() {
  const { settings } = useSettings();
  const siteName = settings?.siteName || 'Safari Ecommerce';
  const tagline =
    settings?.siteDescription ||
    'Premium curated commerce — exceptional products, trusted delivery, and a world-class shopping experience.';
  const email = settings?.contactEmail || 'hello@safaritechno.com';
  const phone = settings?.contactPhone || '+252 61 000 0000';
  const address = settings?.address || 'Mogadishu, Somalia';

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-emerald-900/30 bg-[#071210] text-emerald-50/90">
      {/* Ambient glow */}
      <motion.div
        className="pointer-events-none absolute -left-32 top-0 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl"
        animate={{ opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Top gradient accent */}
      <motion.div
        className="h-1 w-full bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-500"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        className="container-store relative py-16 lg:py-20"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        {/* Trust strip */}
        <div className="mb-14 grid gap-4 sm:grid-cols-3">
          {trustItems.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-sm transition hover:border-teal-500/30 hover:bg-white/[0.06]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-amber-500/20 text-teal-300 ring-1 ring-white/10 transition group-hover:scale-105">
                <Icon className="h-5 w-5" />
              </span>
              <motion.div whileHover={{ x: 2 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                <p className="font-semibold text-white">{label}</p>
                <p className="text-xs text-emerald-200/60">{desc}</p>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand column */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-600 to-amber-600 text-lg font-bold text-white shadow-lg shadow-teal-900/40 ring-1 ring-white/20 transition group-hover:shadow-teal-500/25">
                <Compass className="h-6 w-6" strokeWidth={2.25} />
              </span>
              <div>
                <span className="block font-display text-2xl font-bold tracking-tight text-white">
                  {siteName}
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-teal-400/80">
                  by Safari Techno
                </span>
              </div>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-emerald-100/70">{tagline}</p>

            <ul className="mt-6 space-y-3 text-sm text-emerald-100/80">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-teal-400" />
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-white transition">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-teal-400" />
                <a href={`mailto:${email}`} className="hover:text-white transition">
                  {email}
                </a>
              </li>
            </ul>

            <div className="mt-8 flex gap-2">
              {[Twitter, Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-emerald-100/70 transition hover:border-teal-400/40 hover:bg-teal-500/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-4">
            {Object.entries(linkGroups).map(([title, items]) => (
              <div key={title}>
                <h4 className="text-xs font-bold uppercase tracking-widest text-teal-400">{title}</h4>
                <ul className="mt-5 space-y-3">
                  {items.map((item) => (
                    <li key={item.href + item.label}>
                      <Link
                        href={item.href}
                        className="group inline-flex items-center gap-1 text-sm text-emerald-100/70 transition hover:text-white"
                      >
                        <span className="h-px w-0 bg-teal-400 transition-all group-hover:w-3" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-teal-400">Stay in the loop</h4>
            <p className="mt-4 text-sm leading-relaxed text-emerald-100/70">
              Get exclusive offers, early access to drops, and curated picks delivered to your inbox.
            </p>
            <form
              className="mt-5 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <Input
                type="email"
                placeholder="you@email.com"
                className="h-11 border-white/10 bg-white/5 text-white placeholder:text-emerald-200/40 focus-visible:ring-teal-500"
              />
              <Button
                type="submit"
                className="h-11 w-full gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 font-semibold text-white hover:from-teal-500 hover:to-emerald-500"
              >
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            <p className="mt-3 text-[11px] text-emerald-200/40">
              By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-emerald-200/50">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>

          <motion.div
            className="flex flex-wrap items-center gap-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
          >
            <CreditCard className="mr-1 h-4 w-4 text-teal-400/60" />
            {paymentLabels.map((label) => (
              <motion.span
                key={label}
                variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-emerald-100/60"
              >
                {label}
              </motion.span>
            ))}
          </motion.div>

          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-emerald-200/60 transition hover:text-white">
              Privacy
            </Link>
            <Link href="#" className="text-emerald-200/60 transition hover:text-white">
              Terms
            </Link>
            <Link href="#" className="text-emerald-200/60 transition hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
