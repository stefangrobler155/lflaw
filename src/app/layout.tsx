import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { DM_Serif_Display, Inter, Montserrat } from "next/font/google";
import { CartProvider } from "@/context/CartContext";

const headingFont = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const accentFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-accent",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LF Attorneys",
  description: "All your legal needs in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable} ${accentFont.variable} antialiased`}>
        
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
