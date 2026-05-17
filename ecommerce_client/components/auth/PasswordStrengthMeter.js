import { motion } from 'framer-motion';
import { getPasswordStrength } from '../../lib/passwordStrength';

export default function PasswordStrengthMeter({ password }) {
  const strength = getPasswordStrength(password);

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">Password strength</span>
        <span className="font-medium text-gray-700 dark:text-gray-300">{strength.label}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${strength.percent}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`h-full rounded-full ${strength.color}`}
        />
      </div>
    </motion.div>
  );
}
