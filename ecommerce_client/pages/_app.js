import '../styles/globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SettingsProvider } from '../contexts/SettingsContext';

export default function MyApp({ Component, pageProps }) {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </SettingsProvider>
  );
}
