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
        <div className="absolute inset-0 bg-[#3a1c0e]/65" />
        <div className="relative z-10 text-center text-white px-6">
          <p className="text-[#d98a3d] uppercase tracking-[0.2em] text-sm mb-3">
            Our Story
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold">
            Baked with patience,<br />shared with love.
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-[#3a1c0e] text-lg leading-relaxed mb-6">
          Breaking Bread began in our home kitchen with a living sourdough
          starter — just flour and water, fed daily and kept alive — and a
          conviction that real bread cannot be hurried.
        </p>
        <p className="text-[#3a1c0e] text-lg leading-relaxed mb-6">
          Every loaf is naturally leavened, slow-fermented for 48 hours,
          hand-shaped, and baked in small batches. No commercial yeast. No
          artificial souring. No shortcuts. The fermentation does the work that
          time was always meant to do — developing flavor, texture, and a crust
          that crackles.
        </p>
        <p className="text-[#8a5733] text-lg leading-relaxed italic">
          This is true sourdough — slow-fermented, made from scratch, and never
          rushed like store-bought bread.
        </p>
      </section>
    </>
  );
}
