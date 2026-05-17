'use client';

import { motion } from 'framer-motion';
import PremiumSectionHeader from './PremiumSectionHeader';
import PremiumCategoryCard, { CATEGORY_THEMES } from './PremiumCategoryCard';
import type { Category } from '@/lib/types';
import { useStorefrontData } from '@/contexts/StorefrontContext';
import { useHomeSection } from '@/hooks/use-storefront';

export default function CategoriesSectionPremium({ categories }: { categories: Category[] }) {
  const storefront = useStorefrontData();
  const section = useHomeSection(storefront, 'categories', {
    title: 'Shop by category',
    subtitle: 'Explore our curated collections — crafted for how you live and work.',
    view_all_href: '/shop',
  });

  if (!section.active || !categories.length) return null;

  const [hero, second, ...rest] = categories;
  const stack = rest.slice(0, 2);

  return (
    <section id="categories" className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />

      <div className="container-store relative">
        <PremiumSectionHeader
          badge="Collections"
          title={section.title}
          subtitle={section.subtitle}
          href={section.view_all_href}
          ctaLabel="Browse all"
        />

        {categories.length === 1 && hero && (
          <PremiumCategoryCard category={hero} theme={CATEGORY_THEMES[0]} variant="hero" index={0} />
        )}

        {categories.length >= 2 && (
          <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
            {hero && (
              <motion.div
                className="lg:col-span-7"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <PremiumCategoryCard category={hero} theme={CATEGORY_THEMES[0]} variant="hero" index={0} />
              </motion.div>
            )}

            <div className="flex flex-col gap-5 lg:col-span-5">
              {second && (
                <PremiumCategoryCard
                  category={second}
                  theme={CATEGORY_THEMES[1]}
                  variant="tall"
                  index={1}
                />
              )}
              {stack.length > 0 && (
                <div className="grid flex-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {stack.map((cat, i) => (
                    <PremiumCategoryCard
                      key={cat.id}
                      category={cat}
                      theme={CATEGORY_THEMES[(i + 2) % CATEGORY_THEMES.length]}
                      variant="compact"
                      index={i + 2}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {categories.length > 4 && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(4).map((cat, i) => (
              <PremiumCategoryCard
                key={cat.id}
                category={cat}
                theme={CATEGORY_THEMES[i % CATEGORY_THEMES.length]}
                variant="compact"
                index={i + 4}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
