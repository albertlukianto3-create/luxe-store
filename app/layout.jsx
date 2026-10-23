import './globals.css';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import { CartProvider } from '@/lib/cart';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import ChatWidget from '@/components/ChatWidget';

const body = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-body' });
const display = Fraunces({ subsets: ['latin'], variable: '--font-display' });

export const metadata = { title: 'Luxe Store', description: 'Belanja barang pilihan dengan pengalaman yang mulus.' };
export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${body.variable} ${display.variable}`}>
      <body className="font-sans min-h-screen">
        <CartProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 pb-24 pt-6">{children}</main>
          <CartDrawer />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
