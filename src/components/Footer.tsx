import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#3a1c0e] text-[#fdf2e4] py-6 mt-16">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <p>© 2026 Breaking Bread</p>
        <div className="flex gap-5">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#d98a3d] transition-colors"
          >
            Instagram
          </a>
          <Link
            href="/contact"
            className="hover:text-[#d98a3d] transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
