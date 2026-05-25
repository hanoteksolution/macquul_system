import { useTheme } from '../context/ThemeContext';

export default function usePremiumTheme() {
  const { premium } = useTheme();
  return premium;
}
