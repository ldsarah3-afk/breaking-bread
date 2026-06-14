import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[55vh] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900&q=80"
          alt="Sourdough baking"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-[#3d2b1f]/60" />
        <div className="relative z-10 text-center text-white px-6">
          <p className="text-[#c9a87c] uppercase tracking-widest text-sm mb-3">
            Our Story
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold">
            Baked with patience,<br />shared with love.
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-[#3d2b1f] text-lg leading-relaxed">
          Breaking Bread started in our home kitchen with a 5-year-old sourdough
          starter and a deep belief that good bread takes time. Every loaf is
          slow-fermented for 48 hours, hand-shaped, and baked in small batches —
          never rushed, always real.
        </p>
      </section>
    </>
  );
}
