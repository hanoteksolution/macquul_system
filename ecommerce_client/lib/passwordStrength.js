export function getPasswordStrength(password) {
  if (!password) {
    return { score: 0, label: '', percent: 0, color: 'bg-gray-200' };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const normalized = Math.min(4, Math.max(1, Math.ceil(score * 0.8)));

  const levels = [
    { label: 'Weak', percent: 25, color: 'bg-red-500' },
    { label: 'Fair', percent: 50, color: 'bg-amber-500' },
    { label: 'Good', percent: 75, color: 'bg-primary-500' },
    { label: 'Strong', percent: 100, color: 'bg-emerald-500' },
  ];

  const level = levels[normalized - 1] || levels[0];
  return { score: normalized, ...level };
}
