import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import { useEffect, useState } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { useNotify } from '../contexts/NotifyContext';
import MetricCardsRow from '../components/ui/MetricCardsRow';
import PageActions from '../components/ui/PageActions';
import { Tags, Image, FolderOpen, Plus, FolderTree } from 'lucide-react';
import { buildCategoryTree, flattenCategoryTree, parentOptions } from '../lib/categoryUtils';


function CategoryVisual({ category, size = 'lg' }) {
  const dim = size === 'lg' ? 'w-16 h-16 text-2xl' : 'w-10 h-10 text-lg';
  if (category?.image_url) {
    return (
      <img
        src={category.image_url}
        alt={category.name}
        className={`${dim} rounded-xl object-cover border-2 border-gray-200 dark:border-gray-600`}
      />
    );
  }
  if (category?.icon) {
    return (
      <div
        className={`${dim} rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600`}
      >
        <span className="leading-none">{category.icon}</span>
      </div>
    );
  }
  return (
    <div
      className={`${dim} rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-500 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-bold`}
    >
      {category?.name?.substring(0, 2).toUpperCase() || '?'}
    </div>
  );
}

export default function AdminCategories() {
  const { toast, confirm } = useNotify();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', icon: '', image: null, parent_id: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const parseApiError = (err, fallback = 'Request failed') => {
    const data = err.response?.data;
    if (!data) return err.message || fallback;
    if (typeof data === 'string') return data;
    if (data.detail) return data.detail;
    if (data.name) return Array.isArray(data.name) ? data.name[0] : data.name;
    const key = Object.keys(data)[0];
    if (key) {
      const val = data[key];
      return Array.isArray(val) ? val[0] : String(val);
    }
    return fallback;
  };

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories/', { params: { page_size: 500 } });
      setCategories(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({ name: '', description: '', icon: '', image: null, parent_id: '' });
    setImagePreview('');
    setEditingId(null);
  };

  const openModal = (category = null, parentId = null) => {
    if (category) {
      setForm({
        name: category.name,
        description: category.description || '',
        icon: category.icon || '',
        image: null,
        parent_id: category.parent_id ? String(category.parent_id) : '',
      });
      setImagePreview(category.image_url || '');
      setEditingId(category.id);
    } else {
      resetForm();
      if (parentId) {
        setForm((f) => ({ ...f, parent_id: String(parentId) }));
      }
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
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const buildPayload = () => ({
    name: form.name.trim(),
    description: form.description || '',
    icon: form.icon || '',
    parent_id: form.parent_id ? Number(form.parent_id) : null,
  });

  const buildFormData = () => {
    const formData = new FormData();
    const payload = buildPayload();
    formData.append('name', payload.name);
    formData.append('description', payload.description);
    formData.append('icon', payload.icon);
    if (payload.parent_id != null) {
      formData.append('parent_id', String(payload.parent_id));
    }
    if (form.image) {
      formData.append('image', form.image);
    }
    return formData;
  };

  const save = async (e) => {
    e?.preventDefault?.();
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    try {
      setSaving(true);
      const hasNewImage = Boolean(form.image);

      if (hasNewImage) {
        const formData = buildFormData();
        if (editingId) {
          await api.patch(`/categories/${editingId}/`, formData);
        } else {
          await api.post('/categories/', formData);
        }
      } else {
        const payload = buildPayload();
        if (editingId) {
          await api.patch(`/categories/${editingId}/`, payload);
        } else {
          await api.post('/categories/', payload);
        }
      }

      toast.success(editingId ? 'Category updated' : 'Category created');
      closeModal();
      load();
    } catch (err) {
      console.error('Category save failed', err.response?.data || err);
      toast.error(parseApiError(err, 'Failed to save category'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (category) => {
    const count = category.product_count || 0;
    const warning =
      count > 0
        ? `This category has ${count} product(s). Deleting it will also remove those products. Continue?`
        : 'Delete this category?';
    if (!(await confirm(warning, { title: 'Delete category', destructive: true, confirmLabel: 'Delete' }))) return;
    try {
      await api.delete(`/categories/${category.id}/`);
      load();
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.parent_name || '').toLowerCase().includes(search.toLowerCase())
  );
  const categoryTree = buildCategoryTree(filtered);
  const flatRows = flattenCategoryTree(categoryTree);
  const topLevelParents = parentOptions(categories, editingId);

  if (loading && categories.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
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
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add category
          </button>
        </PageActions>

        <MetricCardsRow
          metrics={[
            { label: 'Total categories', value: String(categories.length), subtitle: 'Parents + subcategories', icon: Tags, accent: 'indigo' },
            { label: 'Parent categories', value: String(categories.filter((c) => !c.parent_id).length), subtitle: 'Top-level', icon: FolderTree, accent: 'violet' },
            { label: 'With images', value: String(categories.filter((c) => c.image_url).length), subtitle: 'Visual categories', icon: Image, accent: 'violet' },
            { label: 'With products', value: String(categories.filter((c) => (c.product_count || 0) > 0).length), subtitle: 'Active categories', icon: FolderOpen, accent: 'emerald' },
            { label: 'Empty', value: String(categories.filter((c) => !(c.product_count || 0)).length), subtitle: 'No products yet', icon: FolderOpen, accent: 'cyan' },
          ]}
        />

        <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={() => openModal()}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 hover:scale-105 shrink-0"
            >
              <PlusIcon className="h-5 w-5" />
              Add Category
            </button>
            <button
              type="button"
              onClick={load}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl shrink-0"
              title="Refresh"
            >
              <ArrowPathIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {flatRows.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <TagIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No categories found</p>
            <button
              type="button"
              onClick={() => openModal()}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              <PlusIcon className="h-5 w-5" />
              Add Category
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {flatRows.map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                style={{ marginLeft: c.depth * 24 }}
              >
                <div className="p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4 min-w-0">
                    <CategoryVisual category={c} size={c.depth > 0 ? 'sm' : 'lg'} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{c.name}</h3>
                        {c.depth === 0 ? (
                          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">Parent</span>
                        ) : (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Subcategory</span>
                        )}
                      </div>
                      {c.parent_name && <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">Under {c.parent_name}</p>}
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{c.description || 'No description'}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {c.product_count ?? 0} product(s){(c.children?.length ?? 0) > 0 && ` · ${c.children.length} subcategories`}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {c.depth === 0 && (
                      <button type="button" onClick={() => openModal(null, c.id)} className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300">
                        <Plus className="h-3.5 w-3.5" /> Add subcategory
                      </button>
                    )}
                    <button type="button" onClick={() => openModal(c)} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:border-gray-600 dark:hover:bg-blue-900/20">
                      <PencilIcon className="h-4 w-4" /> Edit
                    </button>
                    <button type="button" onClick={() => remove(c)} className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20">
                      <TrashIcon className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-4 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{editingId ? 'Edit Category' : 'New Category'}</h3>
                  <p className="text-purple-100 text-sm">Upload an image or set an emoji/icon</p>
                </div>
                <button type="button" onClick={closeModal} className="p-2 hover:bg-white/20 rounded-xl">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={save}>
              <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Parent category
                  </label>
                  <select
                    value={form.parent_id}
                    onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                  >
                    <option value="">None (top-level category)</option>
                    {topLevelParents.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Choose a parent to create a subcategory (e.g. Phones under Electronics)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Electronics or Phones"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    placeholder="Short description for this category"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Icon (emoji or text)
                  </label>
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="e.g. 📱 or 📝"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Shown on the store when no image is uploaded
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-50 file:text-blue-700"
                  />
                  {(imagePreview || form.icon) && (
                    <div className="mt-4 flex items-center gap-4">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview('');
                              setForm({ ...form, image: null });
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <CategoryVisual
                          category={{ name: form.name, icon: form.icon }}
                          size="sm"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-semibold disabled:opacity-60"
                >
                  {saving ? 'Saving…' : editingId ? 'Update' : 'Create'}
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
