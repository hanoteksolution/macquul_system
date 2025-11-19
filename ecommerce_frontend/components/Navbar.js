import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { count as cartCount } from "../services/cart";
import { useTheme } from "../contexts/ThemeContext";
import EnhancedCategories from "./EnhancedCategories";
import api from "../services/api";

export default function Navbar({ onCategorySelect, selectedCategory }) {
  const [user, setUser] = useState(null);
  const [badge, setBadge] = useState(0);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    // Update cart badge on load and when storage changes
    const update = () => setBadge(cartCount());
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  useEffect(() => {
    // Fetch categories and settings
    const fetchData = async () => {
      try {
        const [categoriesResponse, settingsResponse] = await Promise.all([
          api.get("/categories/"),
          api.get("/settings/"),
        ]);
        setCategories(categoriesResponse.data);
        setSettings(settingsResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 shadow-sm">
      {/* Topbar */}
      <div className="w-full bg-primary-700 dark:bg-primary-800 text-white text-xs">
        <div className="container flex items-center justify-between py-2">
          <div className="flex items-center gap-4 opacity-90">
            <span>{settings?.header_email || "support@estore.com"}</span>
            <span>{settings?.header_phone || "+000 000 0000"}</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="opacity-90 hover:opacity-100">
              {settings?.follow_us_text || "Follow us"}
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container flex items-center gap-4 py-3">
        <Link
          href="/"
          className="text-primary-700 dark:text-primary-400 font-extrabold text-2xl tracking-tight"
        >
          {settings?.site_name || "E-Store"}
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              placeholder="Search for products..."
              className="w-full rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/"
            className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400"
          >
            Home
          </Link>
          <button
            onClick={() => {
              if (user) {
                window.location.href = "/dashboard";
              } else {
                localStorage.setItem("redirectAfterLogin", "/dashboard");
                window.location.href = "/login";
              }
            }}
            className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400"
          >
            Dashboard
          </button>
          {user?.is_admin && (
            <Link
              href="/admin"
              className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400"
            >
              Admin
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {user ? (
            <button
              onClick={logout}
              className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-full px-4 py-2"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Login"
              >
                <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-full px-4 py-2"
              >
                Register
              </Link>
            </>
          )}
          <Link
            href="/cart"
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Cart"
          >
            <ShoppingCartIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            {badge > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] leading-none px-1.5 py-0.5 rounded-full bg-primary-600 text-white">
                {badge}
              </span>
            )}
          </Link>
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
            title="Menu"
          >
            <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </nav>

      {/* Enhanced Categories Row */}
      <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="container py-3">
          <EnhancedCategories
            categories={categories}
            onSelect={onCategorySelect}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </header>
  );
}
