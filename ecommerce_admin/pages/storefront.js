import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import { useNotify } from '../contexts/NotifyContext';
import MetricCardsRow from '../components/ui/MetricCardsRow';
import PageActions from '../components/ui/PageActions';
import { Megaphone, Layout, MessageSquare, Building2, Link2, Plus, Pencil, Trash2 } from 'lucide-react';

const TABS = [
  { id: 'announcements', label: 'Announcement bar', icon: Megaphone },
  { id: 'sections', label: 'Home sections', icon: Layout },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { id: 'brands', label: 'Partner brands', icon: Building2 },
  { id: 'nav', label: 'Navigation', icon: Link2 },
];

const ICON_OPTIONS = ['none', 'truck', 'gift', 'headphones', 'sparkles'];
const SECTION_KEYS = [
  'featured', 'categories', 'flash_sale', 'trending', 'testimonials', 'brands', 'newsletter',
];

export default function StorefrontPage() {
  const router = useRouter();
  const { toast, confirm } = useNotify();
  const [tab, setTab] = useState('announcements');
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [sections, setSections] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [brands, setBrands] = useState([]);
  const [navLinks, setNavLinks] = useState([]);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.is_admin) {
      router.push('/login');
      return;
    }
    loadAll();
  }, [router]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [a, s, t, b, n] = await Promise.all([
        api.get('/storefront/announcements/'),
        api.get('/storefront/sections/'),
        api.get('/storefront/testimonials/'),
        api.get('/storefront/brands/'),
        api.get('/storefront/nav-links/'),
      ]);
      setAnnouncements(a.data);
      setSections(s.data);
      setTestimonials(t.data);
      setBrands(b.data);
      setNavLinks(n.data);
    } catch (e) {
      toast.error('Failed to load storefront content');
    } finally {
      setLoading(false);
    }
  };

  const saveItem = async (endpoint, data, id) => {
    try {
      if (id) await api.put(`${endpoint}${id}/`, data);
      else await api.post(endpoint, data);
      toast.success('Saved');
      setModal(null);
      loadAll();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Save failed');
    }
  };

  const deleteItem = async (endpoint, id) => {
    if (!(await confirm('Delete this item?', { destructive: true, confirmLabel: 'Delete' }))) return;
    try {
      await api.delete(`${endpoint}${id}/`);
      toast.success('Deleted');
      loadAll();
    } catch {
      toast.error('Delete failed');
    }
  };

  const metrics = [
    { label: 'Announcements', value: announcements.filter((x) => x.is_active).length, icon: Megaphone },
    { label: 'Sections', value: sections.filter((x) => x.is_active).length, icon: Layout },
    { label: 'Testimonials', value: testimonials.filter((x) => x.is_active).length, icon: MessageSquare },
    { label: 'Brands', value: brands.filter((x) => x.is_active).length, icon: Building2 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageActions
          title="Storefront content"
          description="Manage the announcement bar, homepage sections, testimonials, brands, and header links shown on the store."
        />
        <MetricCardsRow metrics={metrics} />

        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 dark:border-zinc-700">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                tab === id
                  ? 'bg-gradient-to-r from-brand-600 to-violet-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-slate-500">Loading…</p>
        ) : (
          <>
            {tab === 'announcements' && (
              <CrudPanel
                title="Announcement bar"
                items={announcements}
                onAdd={() => setModal({ type: 'announcement', data: { position: 'promo', icon: 'truck', is_active: true, order: 0 } })}
                onEdit={(item) => setModal({ type: 'announcement', data: item })}
                onDelete={(id) => deleteItem('/storefront/announcements/', id)}
                render={(item) => (
                  <span>
                    <strong className="uppercase text-xs text-brand-600">{item.position}</strong> — {item.text}
                  </span>
                )}
              />
            )}
            {tab === 'sections' && (
              <CrudPanel
                title="Homepage sections"
                items={sections}
                onAdd={null}
                onEdit={(item) => setModal({ type: 'section', data: item })}
                onDelete={null}
                render={(item) => (
                  <span>
                    <strong>{item.section_key}</strong>: {item.title}
                    {item.subtitle && <span className="text-slate-500"> — {item.subtitle}</span>}
                  </span>
                )}
              />
            )}
            {tab === 'testimonials' && (
              <CrudPanel
                title="Customer testimonials"
                items={testimonials}
                onAdd={() => setModal({ type: 'testimonial', data: { rating: 5, is_active: true, order: 0 } })}
                onEdit={(item) => setModal({ type: 'testimonial', data: item })}
                onDelete={(id) => deleteItem('/storefront/testimonials/', id)}
                render={(item) => (
                  <span>
                    <strong>{item.name}</strong> — {item.text.slice(0, 60)}…
                  </span>
                )}
              />
            )}
            {tab === 'brands' && (
              <CrudPanel
                title="Partner brands"
                items={brands}
                onAdd={() => setModal({ type: 'brand', data: { is_active: true, order: 0 } })}
                onEdit={(item) => setModal({ type: 'brand', data: item })}
                onDelete={(id) => deleteItem('/storefront/brands/', id)}
                render={(item) => <span>{item.name}</span>}
              />
            )}
            {tab === 'nav' && (
              <CrudPanel
                title="Header navigation links"
                items={navLinks}
                onAdd={() => setModal({ type: 'nav', data: { location: 'header', is_active: true, order: 0 } })}
                onEdit={(item) => setModal({ type: 'nav', data: item })}
                onDelete={(id) => deleteItem('/storefront/nav-links/', id)}
                render={(item) => (
                  <span>
                    {item.label} → {item.href}
                  </span>
                )}
              />
            )}
          </>
        )}
      </div>

      {modal && (
        <StorefrontModal
          modal={modal}
          onClose={() => setModal(null)}
          onSave={async (payload) => {
            const map = {
              announcement: ['/storefront/announcements/', modal.data.id],
              section: ['/storefront/sections/', modal.data.section_key],
              testimonial: ['/storefront/testimonials/', modal.data.id],
              brand: ['/storefront/brands/', modal.data.id],
              nav: ['/storefront/nav-links/', modal.data.id],
            };
            const [endpoint, id] = map[modal.type];
            if (modal.type === 'section') {
              await api.patch(`${endpoint}${id}/`, payload);
              toast.success('Section updated');
              setModal(null);
              loadAll();
            } else {
              await saveItem(endpoint, payload, id);
            }
          }}
        />
      )}
    </AdminLayout>
  );
}

function CrudPanel({ title, items, onAdd, onEdit, onDelete, render }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-zinc-800">
        <h3 className="font-semibold">{title}</h3>
        {onAdd && (
          <button type="button" onClick={onAdd} className="flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-sm text-white">
            <Plus className="h-4 w-4" /> Add
          </button>
        )}
      </div>
      <ul className="divide-y divide-slate-100 dark:divide-zinc-800">
        {items.map((item) => (
          <li key={item.id || item.section_key} className="flex items-center justify-between gap-4 px-6 py-3">
            <div className="min-w-0 flex-1">{render(item)}</div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => onEdit(item)} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-zinc-800">
                <Pencil className="h-4 w-4" />
              </button>
              {onDelete && (
                <button type="button" onClick={() => onDelete(item.id)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StorefrontModal({ modal, onClose, onSave }) {
  const [form, setForm] = useState(modal.data);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 dark:bg-zinc-900">
        <h3 className="text-lg font-bold capitalize">{modal.type}</h3>
        <div className="mt-4 space-y-3">
          {modal.type === 'announcement' && (
            <>
              <Field label="Position" select value={form.position} onChange={(v) => set('position', v)} options={['primary', 'promo']} />
              <Field label="Badge (primary only)" value={form.badge_text || ''} onChange={(v) => set('badge_text', v)} />
              <Field label="Text" value={form.text || ''} onChange={(v) => set('text', v)} required />
              <Field label="Icon" select value={form.icon || 'none'} onChange={(v) => set('icon', v)} options={ICON_OPTIONS} />
              <Field label="Link" value={form.link || ''} onChange={(v) => set('link', v)} />
              <Field label="Order" type="number" value={form.order ?? 0} onChange={(v) => set('order', Number(v))} />
            </>
          )}
          {modal.type === 'section' && (
            <>
              <p className="text-sm text-slate-500">Section: {form.section_key}</p>
              <Field label="Title" value={form.title || ''} onChange={(v) => set('title', v)} required />
              <Field label="Subtitle" value={form.subtitle || ''} onChange={(v) => set('subtitle', v)} />
              <Field label="Badge" value={form.badge_text || ''} onChange={(v) => set('badge_text', v)} />
              <Field label="View all link" value={form.view_all_href || ''} onChange={(v) => set('view_all_href', v)} />
              {form.section_key === 'flash_sale' && (
                <Field
                  label="Sale ends at (ISO datetime)"
                  value={form.config?.end_at || ''}
                  onChange={(v) => set('config', { ...form.config, end_at: v })}
                />
              )}
            </>
          )}
          {modal.type === 'testimonial' && (
            <>
              <Field label="Name" value={form.name || ''} onChange={(v) => set('name', v)} required />
              <Field label="Role" value={form.role || ''} onChange={(v) => set('role', v)} />
              <Field label="Quote" textarea value={form.text || ''} onChange={(v) => set('text', v)} required />
              <Field label="Order" type="number" value={form.order ?? 0} onChange={(v) => set('order', Number(v))} />
            </>
          )}
          {modal.type === 'brand' && (
            <>
              <Field label="Brand name" value={form.name || ''} onChange={(v) => set('name', v)} required />
              <Field label="Website" value={form.link || ''} onChange={(v) => set('link', v)} />
              <Field label="Order" type="number" value={form.order ?? 0} onChange={(v) => set('order', Number(v))} />
            </>
          )}
          {modal.type === 'nav' && (
            <>
              <Field label="Label" value={form.label || ''} onChange={(v) => set('label', v)} required />
              <Field label="URL" value={form.href || ''} onChange={(v) => set('href', v)} required />
              <Field label="Order" type="number" value={form.order ?? 0} onChange={(v) => set('order', Number(v))} />
            </>
          )}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active !== false} onChange={(e) => set('is_active', e.target.checked)} />
            Active (visible on store)
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm hover:bg-slate-100">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm text-white">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', select, options, textarea, required }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-700 dark:text-zinc-300">{label}</span>
      {select ? (
        <select className="mt-1 w-full rounded-lg border px-3 py-2 dark:bg-zinc-800" value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : textarea ? (
        <textarea className="mt-1 w-full rounded-lg border px-3 py-2 dark:bg-zinc-800" rows={3} value={value} onChange={(e) => onChange(e.target.value)} required={required} />
      ) : (
        <input className="mt-1 w-full rounded-lg border px-3 py-2 dark:bg-zinc-800" type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} />
      )}
    </label>
  );
}
