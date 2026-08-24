import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

export const metadata = {
  title: 'AgriSentinel AI — AI Crop Health & Early Warning Platform',
  description: 'AI-Powered Crop Health Intelligence & Early-Warning Platform for SIH 2026.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-neutral-100 min-h-screen selection:bg-agri-orange selection:text-white antialiased">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
