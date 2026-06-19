"use client";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-[#3a1c0e] text-[#fdf2e4] shadow-md">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-wide">
          Breaking Bread
        </Link>
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/#order" className="hover:text-[#d98a3d] transition-colors">
            Order
          </Link>
          <Link href="/about" className="hover:text-[#d98a3d] transition-colors">
            Our Story
          </Link>
          <a href="mailto:ldsarah3@gmail.com?subject=Breaking%20Bread%20Inquiry" className="hover:text-[#d98a3d] transition-colors">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
