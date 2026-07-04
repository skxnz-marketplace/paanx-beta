import type { Metadata } from "next";
import { Archivo, Geist, Pinyon_Script } from "next/font/google";
import AgeGate from "@/components/AgeGate";
import BottomNav from "@/components/BottomNav";
import { CartProvider } from "@/components/CartProvider";
import FloatingCart from "@/components/FloatingCart";
import Header from "@/components/Header";
import SideOrnament from "@/components/SideOrnament";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

// Sharp grotesk display for headings/wordmark — luxe, not editorial-serif.
const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

// Elegant curvy script — brand signature only.
const pinyon = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "PAANX Beta · Premium Paan-Shop Quick Commerce | Delhi NCR",
  description:
    "PAANX Beta: premium paan-shop essentials, snacks, drinks & local favourites. Curated catalog, fast local ordering, age-aware checkout. Delhi NCR private beta.",
  applicationName: "PAANX",
  keywords: [
    "paan shop online",
    "quick commerce Delhi",
    "mukhwas",
    "cold drinks delivery",
    "snacks delivery Delhi NCR",
  ],
  openGraph: {
    title: "PAANX Beta · Premium Paan-Shop Quick Commerce",
    description:
      "Premium paan-shop essentials, snacks, drinks & local favourites. Delhi NCR private beta.",
    type: "website",
    images: ["/brand/paanx-emblem.png"],
  },
  icons: {
    icon: "/brand/paanx-emblem.png",
    apple: "/brand/paanx-emblem.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${archivo.variable} ${pinyon.variable} antialiased`}
    >
      <body>
        <CartProvider>
          <SideOrnament />
          <Header />
          <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-28 pt-5 md:pb-16">
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
