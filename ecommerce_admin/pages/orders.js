import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import { useEffect, useState } from 'react';
import React from 'react';
import {
  EyeIcon,
  ClockIcon,
  XCircleIcon,
  TruckIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { 
  ShoppingBagIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/solid';

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Mapping from display values to database values (lowercase for backend, capitalized for display)
  const statusDisplayToDb = {
    'Pending': 'pending',
    'Confirmed': 'confirmed',
    'Processing': 'processing',
    'Packed': 'packed',
    'Shipped': 'shipped',
    'Out for Delivery': 'out_for_delivery',
    'Delivered': 'delivered',
    'Canceled': 'canceled',
    'Returned': 'returned',
    'Refunded': 'refunded'
  };
  const statusDbToDisplay = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'processing': 'Processing',
    'packed': 'Packed',
    'shipped': 'Shipped',
    'out_for_delivery': 'Out for Delivery',
    'delivered': 'Delivered',
    'canceled': 'Canceled',
    'returned': 'Returned',
    'refunded': 'Refunded'
  };

  const statusOptions = [
    'All', 'Pending', 'Confirmed', 'Processing', 'Packed',
    'Shipped', 'Out for Delivery', 'Delivered', 'Canceled', 'Returned', 'Refunded'
  ];

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Confirmed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Processing': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'Packed': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    'Shipped': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Out for Delivery': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Canceled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Returned': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    'Refunded': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
  };

  const statusIcons = {
    'Pending': ClockIcon,
    'Confirmed': CheckCircleIcon,
    'Processing': ShoppingBagIcon,
    'Packed': ShoppingBagIcon,
    'Shipped': TruckIcon,
    'Out for Delivery': TruckIcon,
    'Delivered': CheckCircleIcon,
    'Canceled': XCircleIcon,
    'Returned': XCircleIcon,
    'Refunded': XCircleIcon
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, change, changeType }) => (
    <div className="group relative bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 rounded-2xl shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-100/20 dark:to-gray-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          {change && (
            <div className="flex items-center gap-1 text-xs font-medium">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                changeType === 'increase'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                <ArrowTrendingUpIcon className="h-3 w-3" />
                {change}
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/');
      console.log('Orders loaded:', response.data);

      // Convert database status values to display values
      const ordersWithDisplayStatus = (response.data || []).map(order => ({
        ...order,
        status: statusDbToDisplay[order.status] || order.status // Fallback to original if not found
      }));

      setOrders(ordersWithDisplayStatus);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, displayStatus) => {
    try {
      console.log(`Updating order ${orderId} status to ${displayStatus}`);

      // Convert display value to database value
      const dbStatus = statusDisplayToDb[displayStatus];

      if (!dbStatus) {
        throw new Error(`Invalid status: ${displayStatus}`);
      }

      // Send the database value to the backend
      const response = await api.patch(`/orders/${orderId}/`, { status: dbStatus });
      console.log('Status update response:', response.data);

      // Update local state with the display value (not the database value)
      setOrders(prevOrders => prevOrders.map(order =>
        order.id === orderId ? { ...order, status: displayStatus, updated_at: new Date().toISOString() } : order
      ));

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: displayStatus, updated_at: new Date().toISOString() }));
      }

      // Show success message
      alert(`Order #${orderId} status updated to ${displayStatus}`);
    } catch (error) {
      console.error('Failed to update order status:', error);
      const errorMessage = error.response?.data?.detail || error.message;
      alert(`Failed to update order status: ${errorMessage}`);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // Filter orders based on status (convert display values to database values for filtering)
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading && orders.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Orders Management</h1>
                <p className="text-blue-100 text-lg">Track and manage customer orders efficiently</p>
              </div>
              <button
                onClick={loadOrders}
                className="flex items-center gap-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <ArrowPathIcon className="h-5 w-5" />
                Refresh
              </button>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Orders"
            value={orders.length.toString()}
            icon={ShoppingBagIcon}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            subtitle="All time orders"
            change="+12.5%"
            changeType="increase"
          />
          <StatCard
            title="Pending Orders"
            value={orders.filter(o => o.status === 'Pending').length.toString()}
            icon={ClockIcon}
            color="bg-gradient-to-br from-yellow-500 to-orange-500"
            subtitle="Awaiting processing"
            change="+5.2%"
            changeType="increase"
          />
          <StatCard
            title="Completed Orders"
            value={orders.filter(o => o.status === 'Delivered').length.toString()}
            icon={CheckCircleIcon}
            color="bg-gradient-to-br from-green-500 to-emerald-600"
            subtitle="Successfully delivered"
            change="+18.7%"
            changeType="increase"
          />
          <StatCard
            title="Total Revenue"
            value={`$${orders.reduce((sum, o) => sum + Number(o.total_price || 0), 0).toFixed(2)}`}
            icon={CurrencyDollarIcon}
            color="bg-gradient-to-br from-purple-500 to-pink-600"
            subtitle="From all orders"
            change="+23.1%"
            changeType="increase"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search orders by customer name, email, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm min-w-48"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                <tr>
                  <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-white">Order</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-white">Customer</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-white">Amount</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-white">Status</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-white">Date</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredOrders.map((order) => {
                  const StatusIcon = statusIcons[order.status] || ClockIcon;
                  return (
                    <tr key={order.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">#{order.id}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                              Order #{order.id}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {order.items?.length || 0} items
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {order.customer_name || order.user?.username || 'Unknown Customer'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {order.customer_email || order.user?.email || 'No email'}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-lg text-green-600 dark:text-green-400">
                          ${Number(order.total_price || order.total_amount || 0).toFixed(2)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              order.status === 'Confirmed' ? 'bg-blue-500 animate-pulse' :
                              order.status === 'Processing' ? 'bg-indigo-500' :
                              order.status === 'Shipped' ? 'bg-purple-500' :
                              order.status === 'Delivered' ? 'bg-green-500' :
                              order.status === 'Pending' ? 'bg-yellow-500' :
                              order.status === 'Canceled' ? 'bg-red-500' :
                              'bg-gray-500'
                            }`}></div>
                            <span className={`font-medium ${
                              order.status === 'Confirmed' ? 'text-blue-700 dark:text-blue-300' :
                              order.status === 'Processing' ? 'text-indigo-700 dark:text-indigo-300' :
                              order.status === 'Shipped' ? 'text-purple-700 dark:text-purple-300' :
                              order.status === 'Delivered' ? 'text-green-700 dark:text-green-300' :
                              order.status === 'Pending' ? 'text-yellow-700 dark:text-yellow-300' :
                              order.status === 'Canceled' ? 'text-red-700 dark:text-red-300' :
                              'text-gray-700 dark:text-gray-300'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="appearance-none bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-2 pr-10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:shadow-md text-sm font-medium"
                            >
                              {statusOptions.slice(1).map(status => (
                                <option key={status} value={status} className="bg-white dark:bg-gray-800">
                                  {status}
                                </option>
                              ))}
                            </select>
                            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(order.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 font-medium"
                        >
                          <EyeIcon className="h-4 w-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBagIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No orders found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || statusFilter !== 'All' ? 'Try adjusting your search criteria.' : 'No orders have been placed yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <ShoppingBagIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Order #{selectedOrder.id}
                      </h2>
                      <p className="text-blue-100 text-sm">Order Details & Management</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/20 transition-all duration-200"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="space-y-6">
                  {/* Customer Information */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Name</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedOrder.customer_name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedOrder.customer_email || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Status */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Status</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium border-2 ${
                          selectedOrder.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' :
                          selectedOrder.status === 'Processing' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800' :
                          selectedOrder.status === 'Shipped' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800' :
                          selectedOrder.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' :
                          selectedOrder.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800' :
                          selectedOrder.status === 'Canceled' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800' :
                          'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800'
                        }`}>
                          {(() => {
                            const StatusIcon = statusIcons[selectedOrder.status] || ClockIcon;
                            return <StatusIcon className="h-5 w-5" />;
                          })()}
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="relative">
                        <select
                          value={selectedOrder.status}
                          onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                          className="appearance-none bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-2 pr-10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:shadow-lg text-sm font-medium"
                        >
                          {statusOptions.slice(1).map(status => (
                            <option key={status} value={status} className="bg-white dark:bg-gray-800">
                              {status}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {selectedOrder.items?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white text-lg">{item.product_name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-green-600 dark:text-green-400">${Number(item.price).toFixed(2)}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">per item</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-700/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount:</span>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Order placed on {new Date(selectedOrder.created_at).toLocaleString()}
                        </div>
                      </div>
                      <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                        ${Number(selectedOrder.total_amount || selectedOrder.total_price || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
