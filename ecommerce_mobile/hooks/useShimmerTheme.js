import { useTheme } from '../context/ThemeContext';

export default function useShimmerTheme() {
  const { shimmer } = useTheme();
  return shimmer;
}
