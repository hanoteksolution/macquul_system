'use client';

import StoreLayout from './StoreLayout';
import HeroSection from './home/HeroSection';
import {
  FeaturedSection,
  FlashSaleSection,
  TrendingSection,
  TestimonialsSection,
} from './home/HomeSections';
import { useProducts, useCategories, useCarouselSlides, useFeaturedProducts } from '@/hooks/use-catalog';
import { ProductCardSkeleton } from '@/components/ui/skeleton';

export default function StoreHomePage() {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: slides = [] } = useCarouselSlides();
  const featured = useFeaturedProducts(products, 8);

  return (
    <StoreLayout categories={categories} products={products}>
      <HeroSection slides={slides} products={products} />
      <div id="products">
        <FeaturedSection products={featured} loading={productsLoading} />
      </div>
      <FlashSaleSection products={products} />
      <TrendingSection products={products} />
      <TestimonialsSection />
    </StoreLayout>
  );
}
