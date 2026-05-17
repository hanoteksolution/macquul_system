export interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  icon?: string;
  product_count?: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  stock: number;
  image_url?: string;
  category?: Category;
  created_at?: string;
}

export interface CarouselSlide {
  id: number;
  title: string;
  subtitle?: string;
  image?: string;
  image_url?: string;
  cta_text?: string;
  cta_link?: string;
  background_color?: string;
  text_color?: string;
  order?: number;
  is_active?: boolean;
}

export interface CartItem {
  product: number;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  category_name?: string;
  quantity: number;
}
