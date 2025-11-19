import AdminLayout from '../components/AdminLayout';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function FinanceTest() {
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center gap-3">
          <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
          <h1 className="text-2xl font-bold">Finance Management Test</h1>
        </div>
        <p>This is a test page to isolate the component error.</p>
      </div>
    </AdminLayout>
  );
}
