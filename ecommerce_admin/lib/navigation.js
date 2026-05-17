import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  CreditCard,
  Warehouse,
  DollarSign,
  Image,
  Settings,
  Shield,
  Boxes,
} from 'lucide-react';

export const MAIN_NAV = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/categories', label: 'Categories', icon: Tags },
  { href: '/orders', label: 'Orders', icon: ShoppingCart, badge: null },
  { href: '/inventory', label: 'Inventory', icon: Warehouse },
  { href: '/finance', label: 'Finance', icon: DollarSign },
  { href: '/stock', label: 'Stock', icon: Boxes },
  { href: '/pos', label: 'POS', icon: CreditCard },
];

export const SECONDARY_NAV = [
  { href: '/carousel', label: 'Hero carousel', icon: Image },
  { href: '/storefront', label: 'Storefront', icon: Image },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/permissions', label: 'Roles & Permissions', icon: Shield },
];

export const PAGE_META = {
  '/': { title: 'Dashboard', description: 'Monitor performance, revenue, and operations in real time.' },
  '/products': { title: 'Products', description: 'Manage catalog, pricing, inventory, and performance.' },
  '/categories': { title: 'Categories', description: 'Organize products with categories and media.' },
  '/orders': { title: 'Orders', description: 'Track fulfillment, payments, and customer orders.' },
  '/inventory': { title: 'Inventory', description: 'Stock levels, movements, and warehouse control.' },
  '/finance': { title: 'Finance', description: 'Revenue, expenses, and financial analytics.' },
  '/stock': { title: 'Stock', description: 'Stock movements and inventory tracking.' },
  '/pos': { title: 'Point of Sale', description: 'Fast checkout and in-store sales.' },
  '/carousel': { title: 'Hero carousel', description: 'Homepage hero slides and banners.' },
  '/storefront': { title: 'Storefront', description: 'Announcement bar, sections, testimonials, brands, and navigation.' },
  '/settings': { title: 'Settings', description: 'System configuration and preferences.' },
  '/permissions': { title: 'Permissions', description: 'Roles, access control, and team security.' },
  '/login': { title: 'Sign in', description: 'Access your admin workspace.' },
};

export function getPageMeta(pathname) {
  return PAGE_META[pathname] || { title: 'Admin', description: 'Manage your business operations.' };
}
