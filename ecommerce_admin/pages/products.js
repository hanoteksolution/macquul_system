import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import { useEffect, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, MagnifyingGlassIcon, FunnelIcon, ArrowPathIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useNotify } from '../contexts/NotifyContext';
import MetricCardsRow from '../components/ui/MetricCardsRow';
import PageActions from '../components/ui/PageActions';
import DataTable from '../components/ui/DataTable';
import TablePagination from '../components/ui/TablePagination';
import { Card } from '../components/ui/Card';
import { Package, Layers, CheckCircle, XCircle, Plus } from 'lucide-react';


export default function AdminProducts() {
  const { toast, confirm } = useNotify();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: 0, category_id: '', stock: 0, image: null });
  const [imagePreview, setImagePreview] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  const load = async () => {
    try {
      setLoading(true);
      const [p, c] = await Promise.all([api.get('/products/'), api.get('/categories/')]);
      setProducts(p.data);
      setCategories(c.data);
    } catch (err) {
      console.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ name: '', description: '', price: 0, category_id: '', stock: 0, image: null });
    setImagePreview('');
    setEditingId(null);
  };

  const openModal = (product = null) => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: product.category?.id || '',
        stock: product.stock,
        image: null
      });
      setImagePreview(product.image_url || '');
      setEditingId(product.id);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const save = async () => {
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category_id', form.category_id);
      formData.append('stock', form.stock);

      if (form.image) {
        formData.append('image', form.image);
      }

      if (editingId) {
        await api.put(`/products/${editingId}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/products/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      closeModal();
      load();
    } catch (err) {
      toast.error('Failed to save product');
    }
  };

  const remove = async (id) => {
    if (!(await confirm('Are you sure you want to delete this product? This action cannot be undone.', {
      title: 'Delete product',
      destructive: true,
      confirmLabel: 'Delete',
    }))) return;
    try {
      await api.delete(`/products/${id}/`);
      load();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                         (p.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || p.category?.id == categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage) || 1);
  const paginatedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter]);

  const productColumns = [
    {
      key: 'index',
      header: '#',
      render: (_, i) => (currentPage - 1) * itemsPerPage + i + 1,
    },
    {
      key: 'product',
      header: 'Product',
      render: (p) => (
        <div className="flex min-w-[200px] items-center gap-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
            {p.image_url ? (
              <img src={p.image_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <PhotoIcon className="h-5 w-5 text-slate-400" />
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{p.name}</p>
            <p className="line-clamp-1 text-xs text-slate-500">{p.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (p) => (
        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-950 dark:text-brand-300">
          {p.category?.name || 'Uncategorized'}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (p) => <span className="font-semibold">${Number(p.price || 0).toFixed(2)}</span>,
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (p) => (
        <span
          className={
            p.stock > 10
              ? 'text-emerald-600'
              : p.stock > 0
                ? 'text-amber-600'
                : 'text-rose-600'
          }
        >
          {p.stock} units
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            p.stock > 10
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
              : p.stock > 0
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
          }`}
        >
          {p.stock > 10 ? 'In stock' : p.stock > 0 ? 'Low stock' : 'Out of stock'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (p) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => openModal(p)}
            className="rounded-lg p-2 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/50"
            title="Edit"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => remove(p.id)}
            className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading && products.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
          </div>
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
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            Add product
          </button>
        </PageActions>

        <MetricCardsRow
          metrics={[
            {
              label: 'Total products',
              numericValue: products.length,
              value: String(products.length),
              subtitle: 'In catalog',
              icon: Package,
              accent: 'indigo',
            },
            {
              label: 'Categories',
              numericValue: categories.length,
              value: String(categories.length),
              subtitle: 'Product categories',
              icon: Layers,
              accent: 'violet',
            },
            {
              label: 'In stock',
              numericValue: products.filter((p) => p.stock > 0).length,
              value: String(products.filter((p) => p.stock > 0).length),
              subtitle: 'Available to sell',
              icon: CheckCircle,
              accent: 'emerald',
            },
            {
              label: 'Out of stock',
              numericValue: products.filter((p) => p.stock === 0).length,
              value: String(products.filter((p) => p.stock === 0).length),
              subtitle: 'Needs restock',
              icon: XCircle,
              accent: 'rose',
            },
          ]}
        />

        <div className="admin-toolbar">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products by name, description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-input pl-10"
              />
            </div>
            <div className="relative min-w-[12rem]">
              <FunnelIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="admin-input pl-10"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <button type="button" onClick={load} className="admin-input flex w-12 items-center justify-center px-0" title="Refresh">
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <Card className="overflow-hidden p-0">
          <DataTable
            columns={productColumns}
            data={paginatedProducts}
            loading={loading}
            className="border-0 rounded-none"
            emptyMessage="No products match your filters."
            getRowKey={(row) => row.id}
            footer={
              <TablePagination
                page={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                pageSize={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            }
          />
        </Card>

        {/* Enhanced Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      {editingId ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <p className="text-blue-100 text-sm">
                      {editingId ? 'Update product information' : 'Create a new product in your catalog'}
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Enter product name"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Category *
                      </label>
                      <select
                        value={form.category_id}
                        onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Product description"
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* Pricing and Stock */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Price *
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                        <input
                          type="number"
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                        placeholder="0"
                        min="0"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Product Image
                    </label>
                    <div className="space-y-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {imagePreview && (
                        <div className="relative inline-block">
                          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                          <button
                            onClick={() => {
                              setImagePreview('');
                              setForm({ ...form, image: null });
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {editingId ? 'Update existing product' : 'Add new product to catalog'}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={save}
                    className="rounded-xl bg-brand-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    {editingId ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
