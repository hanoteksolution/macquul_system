import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import { useEffect, useState } from 'react';
import React from 'react';
import { 
  CubeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { useNotify } from '../contexts/NotifyContext';
import MetricCardsRow from '../components/ui/MetricCardsRow';
import PageActions from '../components/ui/PageActions';
import { Package, AlertTriangle, XCircle, BarChart3, Plus } from 'lucide-react';


export default function InventoryManagement() {
  const { toast } = useNotify();
  const [stats, setStats] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    product: '',
    transaction_type: 'purchase',
    quantity: '',
    unit_cost: '',
    reference_number: '',
    notes: ''
  });

  useEffect(() => {
    loadInventoryData();
  }, []);

  // Separate function to load products if needed
  const loadProducts = async () => {
    try {
      console.log('Loading products separately...');
      const response = await api.get('/products/');
      console.log('Products API response:', response);
      
      const productsData = response.data;
      if (Array.isArray(productsData)) {
        setProducts(productsData);
        console.log('Products loaded directly:', productsData);
      } else if (productsData && Array.isArray(productsData.results)) {
        setProducts(productsData.results);
        console.log('Products loaded from results:', productsData.results);
      } else {
        console.log('No products found in response:', productsData);
        setProducts([]);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    }
  };

  const loadInventoryData = async () => {
    try {
      // Load each endpoint separately to identify which one is failing
      console.log('Loading inventory stats...');
      let statsData = {};
      try {
        const statsRes = await api.get('/inventory/inventory-stats/dashboard/');
        statsData = statsRes.data;
        console.log('Stats loaded successfully:', statsData);
      } catch (statsError) {
        console.error('Failed to load stats:', statsError);
        // Continue with empty stats
      }

      console.log('Loading transactions...');
      let transactionsData = [];
      try {
        const transactionsRes = await api.get('/inventory/transactions/');
        transactionsData = transactionsRes.data || [];
        console.log('Transactions loaded:', transactionsData.length, 'items');
      } catch (transError) {
        console.error('Failed to load transactions:', transError);
        // Continue with empty transactions
      }

      console.log('Loading products...');
      let productsData = [];
      try {
        const productsRes = await api.get('/products/');
        console.log('Products API response:', productsRes.data);
        
        // Handle pagination - products might be in results array
        const rawProductsData = productsRes.data;
        if (Array.isArray(rawProductsData)) {
          productsData = rawProductsData;
        } else if (rawProductsData && Array.isArray(rawProductsData.results)) {
          productsData = rawProductsData.results;
        }
        console.log('Products processed:', productsData.length, 'items');
      } catch (prodError) {
        console.error('Failed to load products:', prodError);
        // Continue with empty products
      }
      
      setStats(statsData);
      setTransactions(transactionsData);
      setProducts(productsData);
      
    } catch (error) {
      console.error('Failed to load inventory data:', error);
      // Set empty arrays on error
      setStats({});
      setTransactions([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await api.post('/inventory/transactions/', newTransaction);
      setShowAddTransaction(false);
      setNewTransaction({
        product: '',
        transaction_type: 'purchase',
        quantity: '',
        unit_cost: '',
        reference_number: '',
        notes: ''
      });
      loadInventoryData();
      toast.success('Transaction added successfully!');
    } catch (error) {
      console.error('Failed to add transaction:', error);
      toast.error('Failed to add transaction');
    }
  };

  const getTransactionIcon = (type) => {
    return type === 'purchase' || type === 'return' ? ArrowUpIcon : ArrowDownIcon;
  };

  const getTransactionColor = (type) => {
    const colors = {
      'purchase': 'text-green-600 bg-green-100',
      'sale': 'text-red-600 bg-red-100',
      'adjustment': 'text-blue-600 bg-blue-100',
      'return': 'text-yellow-600 bg-yellow-100',
      'damage': 'text-red-600 bg-red-100',
      'transfer': 'text-purple-600 bg-purple-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading inventory data...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageActions>
          <button
            type="button"
            onClick={() => {
              setShowAddTransaction(true);
              if (products.length === 0) loadProducts();
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add transaction
          </button>
        </PageActions>

        <MetricCardsRow
          metrics={[
            { label: 'Total products', value: String(stats.total_products || 0), subtitle: 'Tracked in inventory', icon: Package, accent: 'indigo' },
            { label: 'Low stock', value: String(stats.low_stock_products || 0), subtitle: 'Below threshold', icon: AlertTriangle, accent: 'amber' },
            { label: 'Out of stock', value: String(stats.out_of_stock_products || 0), subtitle: 'Needs restock', icon: XCircle, accent: 'rose' },
            { label: 'Inventory value', value: `$${Number(stats.total_inventory_value || 0).toFixed(2)}`, subtitle: 'Total stock value', icon: BarChart3, accent: 'emerald' },
          ]}
        />

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unit Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {transactions.slice(0, 10).map((transaction) => {
                  const Icon = getTransactionIcon(transaction.transaction_type);
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.product_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTransactionColor(transaction.transaction_type)}`}>
                          <Icon className="h-3 w-3" />
                          {transaction.transaction_type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {transaction.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ${Number(transaction.unit_cost).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ${Number(transaction.total_cost).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Transaction Modal */}
        {showAddTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Inventory Transaction</h3>
              
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product</label>
                  <select
                    value={newTransaction.product}
                    onChange={(e) => setNewTransaction({...newTransaction, product: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.length === 0 ? (
                      <option value="" disabled>No products available</option>
                    ) : (
                      products.map(product => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                      ))
                    )}
                  </select>
                  {products.length === 0 && (
                    <div className="mt-1">
                      <p className="text-sm text-red-500">
                        No products found. Products count: {products.length}
                      </p>
                      <button
                        type="button"
                        onClick={loadProducts}
                        className="text-sm text-blue-600 hover:text-blue-700 underline mt-1"
                      >
                        Reload Products
                      </button>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transaction Type</label>
                  <select
                    value={newTransaction.transaction_type}
                    onChange={(e) => setNewTransaction({...newTransaction, transaction_type: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2"
                  >
                    <option value="purchase">Purchase</option>
                    <option value="sale">Sale</option>
                    <option value="adjustment">Adjustment</option>
                    <option value="return">Return</option>
                    <option value="damage">Damage</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newTransaction.quantity}
                    onChange={(e) => setNewTransaction({...newTransaction, quantity: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit Cost</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTransaction.unit_cost}
                    onChange={(e) => setNewTransaction({...newTransaction, unit_cost: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reference Number</label>
                  <input
                    type="text"
                    value={newTransaction.reference_number}
                    onChange={(e) => setNewTransaction({...newTransaction, reference_number: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                  <textarea
                    value={newTransaction.notes}
                    onChange={(e) => setNewTransaction({...newTransaction, notes: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2"
                    rows="3"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                  >
                    Add Transaction
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTransaction(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
