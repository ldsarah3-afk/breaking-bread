"use client";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-[#3d2b1f] text-[#fdf6ec] shadow-md">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-wide">
          Breaking Bread
        </Link>
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-[#c9a87c] transition-colors">
            Order
          </Link>
          <Link href="/about" className="hover:text-[#c9a87c] transition-colors">
            Our Story
          </Link>
          <a href="mailto:orders@breakingbread.com" className="hover:text-[#c9a87c] transition-colors">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
