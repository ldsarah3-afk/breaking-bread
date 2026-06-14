export default function Footer() {
  return (
    <footer className="bg-[#3d2b1f] text-[#fdf6ec] py-6 mt-16">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <p>© 2026 Breaking Bread</p>
        <div className="flex gap-5">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#c9a87c] transition-colors"
          >
            Instagram
          </a>
          <a
            href="mailto:orders@breakingbread.com"
            className="hover:text-[#c9a87c] transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
