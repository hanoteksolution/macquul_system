export interface StorefrontHeader {
  site_name: string;
  site_description: string;
  logo_url: string | null;
  currency: string;
  default_locale: string;
  search_placeholder: string;
  free_shipping_threshold: number;
  promo_code: string;
  member_discount_percent: number;
  primary_color: string;
  secondary_color: string;
}

export interface AnnouncementItem {
  id: number;
  position: 'primary' | 'promo';
  badge_text?: string;
  text: string;
  icon: string;
  link?: string;
  order?: number;
  is_active?: boolean;
}

export interface NavLinkItem {
  id: number;
  label: string;
  href: string;
  location: string;
  order?: number;
  open_in_new_tab?: boolean;
}

export interface HomeSectionConfig {
  section_key: string;
  title: string;
  subtitle?: string;
  badge_text?: string;
  view_all_href?: string;
  is_active?: boolean;
  config?: Record<string, unknown>;
}

export interface TestimonialItem {
  id: number;
  name: string;
  role?: string;
  text: string;
  rating: number;
  avatar_url?: string | null;
}

export interface PartnerBrandItem {
  id: number;
  name: string;
  logo_url?: string | null;
  link?: string;
}

export interface StorefrontPublic {
  header: StorefrontHeader;
  announcement_primary: AnnouncementItem | null;
  announcements: AnnouncementItem[];
  nav_links: NavLinkItem[];
  footer_links: NavLinkItem[];
  sections: Record<string, HomeSectionConfig>;
  testimonials: TestimonialItem[];
  brands: PartnerBrandItem[];
}
