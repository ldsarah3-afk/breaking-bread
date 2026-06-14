import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-6">🍞</div>
        <h1 className="text-4xl font-bold text-[#3d2b1f] mb-4">Order received!</h1>
        <p className="text-[#7a5c47] text-lg mb-8 leading-relaxed">
          Thank you for your order. You&apos;ll get a confirmation email shortly.
          We&apos;ll have your bread ready for pickup on your chosen date.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#3d2b1f] text-[#fdf6ec] px-8 py-3.5 rounded-xl font-semibold hover:bg-[#5a3f2e] transition-colors"
        >
          Place another order
        </Link>
      </div>
    </section>
  );
}
