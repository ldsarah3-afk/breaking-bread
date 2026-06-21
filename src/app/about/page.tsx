import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[55vh] flex items-center justify-center">
        <Image
          src="/bread/sarah-baking-16x9.png"
          alt="Sarah baking sourdough by hand"
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
      <section className="max-w-2xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-extrabold text-[#3a1c0e] mb-6 text-center">
          Hi, I&apos;m Sarah.
        </h2>
        <p className="text-[#3a1c0e] text-lg leading-relaxed mb-6">
          I&apos;ll be honest — I fell down the sourdough rabbit hole because of
          TikTok. I couldn&apos;t stop watching those loaves, the gorgeous ones
          and the gloriously imperfect ones, and before long I was hooked.
        </p>
        <p className="text-[#3a1c0e] text-lg leading-relaxed mb-6">
          But it became more than a hobby. Living with a disability, I needed
          something that was <em>mine</em> — a way to rebuild my strength, work
          through the hard days, and pour my whole self into something I could
          make with my hands. Kneading dough became my therapy and my workout
          all at once.
        </p>
        <p className="text-[#3a1c0e] text-lg leading-relaxed mb-6">
          It got real last Easter, when I baked loaves for the people I work
          with. They cheered me on and kept telling me how good it was — and
          somewhere in there, this stopped being a project and became Breaking
          Bread.
        </p>
        <p className="text-[#3a1c0e] text-lg leading-relaxed mb-6">
          Every loaf is made with care, real fermentation, and just a few honest
          ingredients — because bread made that way simply tastes different. The
          imperfect ones? Those are my favorites. They&apos;re proof a real
          person made this, by hand, for you.
        </p>
        <p className="text-[#3a1c0e] text-xl italic font-medium border-l-4 border-[#a3471f] pl-4">
          I put my fight into every loaf — and a whole lot of love. You&apos;ll
          taste the difference.
        </p>
      </section>
    </>
  );
}
