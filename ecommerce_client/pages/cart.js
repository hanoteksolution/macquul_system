import dynamic from 'next/dynamic';

const CartPage = dynamic(() => import('../components/store/cart/CartPage'), { ssr: false });

export default function Cart() {
  return <CartPage />;
}
