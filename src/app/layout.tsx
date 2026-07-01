import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "react-day-picker/style.css";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://breaking-bread.net"),
  title: "Breaking Bread",
  description:
    "Real sourdough — slow-fermented for 48 hours, made from scratch, baked to order in small batches.",
  openGraph: {
    title: "Breaking Bread",
    description:
      "Real sourdough — slow-fermented for 48 hours, made from scratch, baked to order in small batches.",
    url: "https://breaking-bread.net",
    siteName: "Breaking Bread",
    type: "website",
    images: [
      {
        url: "/bread/sarah-baking-16x9.png",
        width: 1376,
        height: 768,
        alt: "Sarah baking sourdough by hand",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Breaking Bread",
    description:
      "Real sourdough — slow-fermented for 48 hours, made from scratch, baked to order in small batches.",
    images: ["/bread/sarah-baking-16x9.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
