import dynamic from 'next/dynamic';

const StoreHomePage = dynamic(() => import('../components/store/StoreHomePage'), { ssr: false });

export default function Home() {
  return <StoreHomePage />;
}
