'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, Loader2, Sparkles } from 'lucide-react';
import PremiumModal from '../ui/PremiumModal';

const inputClass =
  'mt-1.5 w-full rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500';

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-slate-500 dark:text-zinc-500">{hint}</span>}
      {children}
    </label>
  );
}

export default function CarouselSlideModal({
  open,
  onClose,
  editingSlide,
  formData,
  setFormData,
  imagePreview,
  onImageChange,
  onSubmit,
  saving,
}) {
  const fileRef = useRef(null);

  return (
    <PremiumModal
      open={open}
      onClose={onClose}
      title={editingSlide ? 'Edit carousel slide' : 'Create new slide'}
      description="Design a homepage hero banner with image, copy, and call-to-action."
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="carousel-slide-form"
            disabled={saving}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-violet-600 to-brand-600 bg-[length:200%_100%] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-[position:100%_0] hover:shadow-brand-500/40 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : editingSlide ? (
              'Save changes'
            ) : (
              'Create slide'
            )}
          </button>
        </>
      }
    >
      <form id="carousel-slide-form" onSubmit={onSubmit} className="space-y-6">
        {/* Live preview */}
        <motion.div
          className="relative overflow-hidden rounded-2xl border border-slate-200/80 shadow-glass dark:border-white/10"
          style={{ backgroundColor: formData.background_color }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
          <div className="relative flex min-h-[140px] items-stretch gap-4 p-5 sm:min-h-[160px]">
            <div className="flex flex-1 flex-col justify-center" style={{ color: formData.text_color }}>
              <span className="mb-1 inline-flex w-fit items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                <Sparkles className="h-3 w-3" />
                Preview
              </span>
              <p className="text-lg font-bold sm:text-xl">{formData.title || 'Slide title'}</p>
              <p className="mt-1 max-w-xs text-sm opacity-90 line-clamp-2">
                {formData.subtitle || 'Subtitle appears here'}
              </p>
              <span className="mt-3 inline-flex w-fit rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                {formData.cta_text || 'Shop Now'}
              </span>
            </div>
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
                alt="Preview"
                className="h-24 w-36 shrink-0 rounded-xl object-cover shadow-lg ring-2 ring-white/20 sm:h-28 sm:w-44"
              />
            ) : (
              <div className="flex h-24 w-36 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-white/30 bg-white/10 sm:h-28 sm:w-44">
                <ImagePlus className="h-8 w-8 text-white/50" />
              </div>
            )}
          </div>
        </motion.div>

        <Field label="Slide image" hint="Recommended 1920×800px · JPG or PNG">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="sr-only"
            id="carousel-image-input"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-1.5 flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center transition hover:border-brand-400 hover:bg-brand-50/50 dark:border-white/10 dark:bg-zinc-900/50 dark:hover:border-brand-500/50"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
              <ImagePlus className="h-6 w-6" />
            </span>
            <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">Click to upload image</span>
            <span className="text-xs text-slate-500">or drag and drop</span>
          </button>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Title">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={inputClass}
              placeholder="e.g. Summer Collection"
              required
            />
          </Field>
          <Field label="Display order">
            <input
              type="number"
              min={0}
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Subtitle">
          <textarea
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className={`${inputClass} min-h-[80px] resize-y`}
            rows={2}
            placeholder="Short supporting line for the hero"
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="CTA button text">
            <input
              type="text"
              value={formData.cta_text}
              onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
              className={inputClass}
              placeholder="Shop Now"
            />
          </Field>
          <Field label="CTA link" hint="URL or anchor (#products)">
            <input
              type="text"
              value={formData.cta_link}
              onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
              className={inputClass}
              placeholder="#products"
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Background color">
            <div className="mt-1.5 flex items-center gap-3">
              <input
                type="color"
                value={formData.background_color}
                onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                className="h-11 w-14 cursor-pointer rounded-xl border border-slate-200 bg-transparent p-1 dark:border-white/10"
              />
              <input
                type="text"
                value={formData.background_color}
                onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                className={`${inputClass} mt-0 flex-1 font-mono text-xs`}
              />
            </div>
          </Field>
          <Field label="Text color">
            <div className="mt-1.5 flex items-center gap-3">
              <input
                type="color"
                value={formData.text_color}
                onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                className="h-11 w-14 cursor-pointer rounded-xl border border-slate-200 bg-transparent p-1 dark:border-white/10"
              />
              <input
                type="text"
                value={formData.text_color}
                onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                className={`${inputClass} mt-0 flex-1 font-mono text-xs`}
              />
            </div>
          </Field>
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 px-4 py-3.5 transition hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-900/40">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <span>
            <span className="block text-sm font-semibold text-slate-800 dark:text-zinc-200">Active on storefront</span>
            <span className="text-xs text-slate-500 dark:text-zinc-500">Visible in the homepage carousel</span>
          </span>
        </label>
      </form>
    </PremiumModal>
  );
}
