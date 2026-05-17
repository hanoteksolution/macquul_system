import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { StorefrontPublic } from '@/lib/storefront-types';

async function fetchStorefront(): Promise<StorefrontPublic> {
  const res = await api.get<StorefrontPublic>('/storefront/public/');
  return res.data;
}

export function useStorefront() {
  return useQuery({
    queryKey: ['storefront'],
    queryFn: fetchStorefront,
    staleTime: 60_000,
  });
}

export function useHomeSection(
  data: StorefrontPublic | undefined,
  key: string,
  fallback: { title: string; subtitle?: string; view_all_href?: string; badge_text?: string }
) {
  const section = data?.sections?.[key];
  if (!section) return { ...fallback, config: {}, active: true };
  if (section.is_active === false) return { ...fallback, active: false };
  return {
    title: section.title || fallback.title,
    subtitle: section.subtitle ?? fallback.subtitle,
    view_all_href: section.view_all_href || fallback.view_all_href,
    badge_text: section.badge_text || fallback.badge_text,
    config: section.config ?? {},
    active: true,
  };
}
