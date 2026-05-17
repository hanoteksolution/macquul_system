import dynamic from 'next/dynamic';

const ShopPage = dynamic(() => import('../components/store/shop/ShopPage'), { ssr: false });

export default function Shop() {
  return <ShopPage />;
}
