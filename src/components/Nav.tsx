"use client";
import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-[#3a1c0e] text-[#fdf2e4] shadow-md">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Desktop: horizontal logo */}
        <Link href="/" aria-label="Breaking Bread home" className="hidden sm:block">
          <Image
            src="/bread/logo-horizontal.png"
            alt="Breaking Bread"
            width={321}
            height={119}
            priority
            unoptimized
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop: nav links */}
        <div className="hidden sm:flex gap-6 text-sm font-medium">
          <Link href="/#order" className="hover:text-[#d98a3d] transition-colors">
            Order
          </Link>
          <Link href="/about" className="hover:text-[#d98a3d] transition-colors">
            Our Story
          </Link>
          <Link href="/contact" className="hover:text-[#d98a3d] transition-colors">
            Contact
          </Link>
        </div>

        {/* Mobile: vertical logo only, centered */}
        <Link
          href="/"
          aria-label="Breaking Bread home"
          className="sm:hidden mx-auto"
        >
          <Image
            src="/bread/logo-vertical.png"
            alt="Breaking Bread"
            width={290}
            height={182}
            priority
            unoptimized
            className="h-16 w-auto"
          />
        </Link>
      </div>
    </nav>
  );
}
