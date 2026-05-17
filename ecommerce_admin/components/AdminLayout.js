import AdminShell from './layout/AdminShell';

/** @deprecated Use AdminShell — kept for backward compatibility with existing pages */
export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
