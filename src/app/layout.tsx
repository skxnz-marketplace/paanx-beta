import type { Metadata } from "next";
import { Geist } from "next/font/google";
import AgeGate from "@/components/AgeGate";
import BottomNav from "@/components/BottomNav";
import { CartProvider } from "@/components/CartProvider";
import FloatingCart from "@/components/FloatingCart";
import Header from "@/components/Header";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PAANX Beta",
  description: "Premium paan, mukhwas, ingredients, and essentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body>
        <CartProvider>
          <Header />
          <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-5 md:pb-16">
            {children}
          </main>
          <FloatingCart />
          <BottomNav />
          <AgeGate />
        </CartProvider>
      </body>
    </html>
  );
}
