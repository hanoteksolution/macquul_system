import dynamic from 'next/dynamic';

const WishlistPage = dynamic(() => import('../components/store/wishlist/WishlistPage'), { ssr: false });

export default function Wishlist() {
  return <WishlistPage />;
}
