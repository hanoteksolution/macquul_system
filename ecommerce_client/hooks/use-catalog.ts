import { useQuery } from '@tanstack/react-query';
import api, { ensureValidAccessToken } from '../services/api';
import type { CarouselSlide, Category, Product } from '@/lib/types';

async function fetchProducts() {
  await ensureValidAccessToken();
  const res = await api.get<Product[]>('/products/');
  return res.data;
}

async function fetchCategories() {
  await ensureValidAccessToken();
  const res = await api.get<Category[]>('/categories/');
  return res.data;
}

async function fetchSlides() {
  const res = await api.get<CarouselSlide[]>('/carousel/slides/active/');
  return res.data;
}

async function fetchProduct(id: string) {
  await ensureValidAccessToken();
  const res = await api.get<Product>(`/products/${id}/`);
  return res.data;
}

export function useProducts() {
  return useQuery({ queryKey: ['products'], queryFn: fetchProducts, staleTime: 60_000 });
}

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: fetchCategories, staleTime: 120_000 });
}

export function useCarouselSlides() {
  return useQuery({ queryKey: ['carousel'], queryFn: fetchSlides, staleTime: 120_000 });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),
    enabled: Boolean(id),
  });
}

export function useFeaturedProducts(products: Product[] | undefined, limit = 8) {
  return products?.slice(0, limit) ?? [];
}
