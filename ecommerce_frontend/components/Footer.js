import { useEffect, useState } from "react";
import api from "../services/api";

export default function Footer() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings/");
        setSettings(response.data);
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <footer className="mt-16 border-t border-gray-100 dark:border-gray-700 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container py-12">
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        </div>
      </footer>
    );
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-gray-100 dark:border-gray-700 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        {/* Company Info */}
        <div>
          <div className="text-2xl font-extrabold text-primary-700 dark:text-primary-400">
            {settings?.site_name || "E-Store"}
          </div>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            {settings?.footer_description ||
              "Your premier online store for Electronics & Stationery. Quality products, fast delivery, and excellent customer service."}
          </p>
          <div className="mt-4 flex items-center gap-4">
            {/* Facebook Icon */}
            <a
              href={settings?.facebook_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* Instagram Icon */}
            <a
              href={settings?.instagram_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281c-.49 0-.875-.385-.875-.875s.385-.875.875-.875.875.385.875.875-.385.875-.875.875zm-7.83 2.448c-1.297 0-2.448 1.151-2.448 2.448s1.151 2.448 2.448 2.448 2.448-1.151 2.448-2.448-1.151-2.448-2.448-2.448z" />
              </svg>
            </a>

            {/* TikTok Icon */}
            <a
              href={settings?.tiktok_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-black hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">
            Quick Links
          </div>
          <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-300">
            <li>
              <a
                className="hover:text-primary-700 dark:hover:text-primary-400"
                href="#products"
              >
                Products
              </a>
            </li>
            <li>
              <a
                className="hover:text-primary-700 dark:hover:text-primary-400"
                href="#categories"
              >
                Categories
              </a>
            </li>
            <li>
              <a
                className="hover:text-primary-700 dark:hover:text-primary-400"
                href="/dashboard"
              >
                My Account
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">
            Contact Us
          </div>
          <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-300">
            <li>{settings?.footer_address || "Online Market, Your City"}</li>
            <li>{settings?.footer_phone || "+000 000 0000"}</li>
            <li>{settings?.footer_email || "support@estore.com"}</li>
          </ul>
        </div>

        {/* Payment Methods */}
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">
            Payment Methods
          </div>
          <div className="mt-3 flex items-center gap-3">
            {/* EVC Payment */}
            <div className="group relative">
              <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-xs">E</span>
                  </div>
                  <span className="text-white font-semibold text-sm">EVC</span>
                </div>
              </div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                EVC Plus
              </div>
            </div>

            {/* Merchant Payment */}
            <div className="group relative">
              <div className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-xs">M</span>
                  </div>
                  <span className="text-white font-semibold text-sm">
                    Merchant
                  </span>
                </div>
              </div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Merchant Services
              </div>
            </div>

            {/* Mstercard Payment */}
            <div className="group relative">
              <div className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-xs">MC</span>
                  </div>
                  <span className="text-white font-semibold text-sm">
                    Mstercard
                  </span>
                </div>
              </div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Mstercard Payment
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-100 dark:border-gray-700">
        <div className="container py-4 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
          <span>
            © {currentYear}{" "}
            {settings?.copyright_text || "E-Store. All rights reserved."}
          </span>
          <div className="flex items-center gap-4">
            {settings?.terms_url && (
              <a
                href={settings.terms_url}
                className="hover:text-primary-600 dark:hover:text-primary-400"
              >
                Terms
              </a>
            )}
            {settings?.privacy_url && (
              <a
                href={settings.privacy_url}
                className="hover:text-primary-600 dark:hover:text-primary-400"
              >
                Privacy
              </a>
            )}
            {!settings?.terms_url && !settings?.privacy_url && (
              <span>Terms • Privacy</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
