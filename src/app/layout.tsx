import { AuthProvider } from '@/app/components/auth/AuthProvider';
import './globals.css';

export const metadata = {
  title: 'Authentication Demo',
  description: 'Next.js authentication demo with Firebase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}