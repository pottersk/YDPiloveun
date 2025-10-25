import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import ClientMusicPlayer from "@/components/ClientMusicPlayer";

export const metadata = {
  title: "YDP-SHOP",
  description: "How to create website?",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CartProvider>
          <WishlistProvider>
            <Header />
            {children}
            <Footer />
            <ClientMusicPlayer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}