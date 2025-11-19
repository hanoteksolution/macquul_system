import { useRouter } from 'next/router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function BackButton({ className = '', children }) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ${className}`}
    >
      <ArrowLeftIcon className="h-4 w-4" />
      {children || 'Back'}
    </button>
  );
}
