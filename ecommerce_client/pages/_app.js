import '../styles/globals.css';
import AppProviders from '../components/AppProviders';

export default function MyApp({ Component, pageProps }) {
  return (
    <AppProviders>
      <Component {...pageProps} />
    </AppProviders>
  );
}
