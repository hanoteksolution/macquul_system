import AuthShell from './auth/AuthShell';

export default function AuthLayout({ variant = 'login', title, subtitle, footerLink, children }) {
  return (
    <AuthShell variant={variant} title={title} subtitle={subtitle} footerLink={footerLink}>
      {children}
    </AuthShell>
  );
}
