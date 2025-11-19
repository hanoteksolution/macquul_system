import { useSettings } from '../contexts/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="mt-16 border-t border-gray-100 dark:border-gray-700 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        <div>
          <div className="text-2xl font-extrabold text-primary-700 dark:text-primary-400">{settings.siteName}</div>
          <p className="mt-3 text-gray-600 dark:text-gray-400">{settings.siteDescription}</p>
          <div className="mt-4 flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <span>Twitter</span>
            <span>Instagram</span>
            <span>Facebook</span>
          </div>
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">Quick Links</div>
          <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-400">
            <li><a className="hover:text-primary-700 dark:hover:text-primary-400" href="#products">Products</a></li>
            <li><a className="hover:text-primary-700 dark:hover:text-primary-400" href="#categories">Categories</a></li>
            <li><a className="hover:text-primary-700 dark:hover:text-primary-400" href="/dashboard">My Account</a></li>
            <li><a className="hover:text-primary-700 dark:hover:text-primary-400" href="/admin">Admin</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">Contact Us</div>
          <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-400">
            <li>{settings.address}</li>
            <li>{settings.contactPhone}</li>
            <li>{settings.contactEmail}</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">Payment Methods</div>
          <div className="mt-3 flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <span className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600">Visa</span>
            <span className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600">MasterCard</span>
            <span className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600">PayPal</span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-700">
        <div className="container py-4 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
          <span>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</span>
          <span>Terms • Privacy</span>
        </div>
      </div>
    </footer>
  );
}
