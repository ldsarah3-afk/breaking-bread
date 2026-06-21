"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import Image from "next/image";

export function AnimatedHero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["never rushed", "from scratch", "naturally fermented", "made by hand", "worth the wait"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2200);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <Image
        src="/bread/classic-loaf.jpg"
        alt="Freshly baked sourdough"
        fill
        priority
        unoptimized
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[#3a1c0e]/75" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="flex gap-7 py-28 lg:py-40 items-center justify-center flex-col text-center">
          <span className="inline-block bg-[#d98a3d]/25 border border-[#d98a3d] text-[#fdf2e4] text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
            Real sourdough, baked to order
          </span>

          <h1 className="text-5xl md:text-7xl max-w-3xl tracking-tight text-center font-extrabold text-[#fdf2e4]">
            <span className="block">Sourdough that&apos;s</span>
            <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-2 h-[1.2em] md:h-[1.3em]">
              &nbsp;
              {titles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute text-[#d98a3d]"
                  initial={{ opacity: 0, y: -100 }}
                  transition={{ type: "spring", stiffness: 50 }}
                  animate={
                    titleNumber === index
                      ? { y: 0, opacity: 1 }
                      : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                  }
                >
                  {title}
                </motion.span>
              ))}
            </span>
          </h1>

          <p className="text-lg md:text-xl leading-relaxed text-[#fdf2e4]/85 max-w-2xl">
            Naturally leavened with a living starter, slow-fermented for 48 hours,
            and hand-shaped in small batches. This is true sourdough — not the
            store-bought imitation.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <a
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold border border-[#fdf2e4]/40 text-[#fdf2e4] hover:bg-[#fdf2e4]/10 transition-colors"
            >
              Our Story
            </a>
            <a
              href="#order"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold bg-[#a3471f] text-[#fdf2e4] hover:bg-[#863a18] transition-colors"
            >
              Build Your Order <MoveRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
