"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product, CartItem, OrderPayload } from "@/types";
import { AnimatedHero } from "@/components/AnimatedHero";

const PRODUCTS: Product[] = [
  {
    name: "Classic Country Loaf",
    description:
      "Our signature naturally-leavened loaf. A 48-hour ferment yields a blistered crust and a custardy, open crumb.",
    price: 10.0,
    image: "/bread/classic-loaf.jpg",
  },
  {
    name: "Cinnamon Raisin",
    description:
      "Plump raisins and ribbons of cinnamon folded through slow-fermented dough. Toasts beautifully.",
    price: 13.0,
    image: "/bread/cinnamon-raisin.jpg",
  },
  {
    name: "Jalapeño Cheddar",
    description:
      "Sharp cheddar and fresh jalapeño baked through a tangy crumb. Gentle heat, melted pockets.",
    price: 13.0,
    image: "/bread/jalapeno-cheddar.jpg",
  },
  {
    name: "Garlic, Parmesan & Basil",
    description:
      "Roasted garlic, aged Parmesan, and sweet basil woven into every slice. Deeply savory.",
    price: 13.0,
    image: "/bread/garlic-parmesan-basil.jpg",
  },
  {
    name: "Cheddar",
    description:
      "Generous folds of sharp cheddar melted into a golden, open crumb. Pure comfort.",
    price: 13.0,
    image: "/bread/cheddar.jpg",
  },
  {
    name: "Cheddar Garlic",
    description:
      "Sharp cheddar married with mellow roasted garlic — our most-requested savory loaf.",
    price: 13.0,
    image: "/bread/cheddar-garlic.jpg",
  },
  {
    name: "Croissant",
    description:
      "Laminated with patience and real butter, leavened with our living starter. Shatteringly flaky.",
    price: 13.0,
    image: "/bread/croissant.jpg",
  },
  {
    name: "Pizza Bread",
    description:
      "Tomato, herbs, and melted cheese baked into a pull-apart sourdough. A meal on its own.",
    price: 13.0,
    image: "/bread/pizza-bread.jpg",
  },
];

const PAYMENT_METHODS = ["Card", "Apple Pay", "Venmo", "Cash", "Check"];

const REASONS = [
  {
    t: "Easier to digest",
    d: "Natural fermentation breaks down gluten and starches before the bread ever reaches you.",
  },
  {
    t: "Gentler on blood sugar",
    d: "A lower glycemic impact than conventional loaves — slow fermentation does the work.",
  },
  {
    t: "Naturally probiotic",
    d: "Living fermentation builds beneficial bacteria and a depth of flavor you can taste.",
  },
  {
    t: "No commercial yeast",
    d: "Leavened entirely by a wild starter — just flour and water, kept alive and fed.",
  },
  {
    t: "Richer flavor & texture",
    d: "Time, not additives, develops the tang, the open crumb, and the crackling crust.",
  },
  {
    t: "Keeps without preservatives",
    d: "True sourdough simply lasts longer — no chemicals, nothing artificial.",
  },
];

const STEPS = [
  { t: "Pick your loaves", d: "Choose from our rotating menu of handcrafted sourdough." },
  { t: "We slow-ferment", d: "Your dough rests and develops for a full 48 hours." },
  { t: "Baked fresh to order", d: "Hand-shaped and baked in small batches the day of pickup." },
  { t: "Pick up & enjoy", d: "Collect your bread, still warm, on your chosen date." },
];

const PROMOS = [
  {
    t: "Savory Loaves",
    d: "Cheddar, garlic, jalapeño & more",
    image: "/bread/jalapeno-cheddar.jpg",
  },
  {
    t: "Sweet & Breakfast",
    d: "Cinnamon raisin & flaky croissants",
    image: "/bread/croissant.jpg",
  },
  {
    t: "The Classic",
    d: "Our signature country sourdough",
    image: "/bread/classic-loaf.jpg",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    pickup_date: "",
    payment_method: "Card",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateQty = (name: string, delta: number) => {
    setCart((prev) => {
      const next = { ...prev, [name]: Math.max(0, (prev[name] ?? 0) + delta) };
      if (next[name] === 0) delete next[name];
      return next;
    });
  };

  const cartItems: CartItem[] = PRODUCTS.filter((p) => cart[p.name]).map(
    (p) => ({ ...p, qty: cart[p.name] })
  );
  const totalItems = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (cartItems.length === 0) {
      setError("Please add at least one item to your order.");
      return;
    }

    const payload: OrderPayload = {
      ...form,
      items: cartItems.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
      total,
    };

    setLoading(true);
    try {
      if (form.payment_method === "Card" || form.payment_method === "Apple Pay") {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        throw new Error(data.error ?? "Checkout failed. Please try again.");
      } else {
        const res = await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Order submission failed");
        router.push("/confirmation");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <AnimatedHero />

      {/* Trust strip */}
      <div className="bg-[#3a1c0e] text-[#fdf2e4] overflow-hidden">
        {/* Desktop: static centered row */}
        <div className="hidden sm:flex max-w-5xl mx-auto px-6 py-5 flex-wrap items-center justify-center gap-x-10 gap-y-2 text-sm font-medium tracking-wide">
          <span>48-hour fermentation</span>
          <span className="text-[#d98a3d]">•</span>
          <span>Made from scratch</span>
          <span className="text-[#d98a3d]">•</span>
          <span>No commercial yeast</span>
          <span className="text-[#d98a3d]">•</span>
          <span>Baked fresh to order</span>
        </div>

        {/* Mobile: continuous scrolling marquee */}
        <div className="sm:hidden py-4">
          <div className="flex w-max animate-marquee whitespace-nowrap text-sm font-medium tracking-wide">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
                <span className="px-5">48-hour fermentation</span>
                <span className="text-[#d98a3d]">•</span>
                <span className="px-5">Made from scratch</span>
                <span className="text-[#d98a3d]">•</span>
                <span className="px-5">No commercial yeast</span>
                <span className="text-[#d98a3d]">•</span>
                <span className="px-5">Baked fresh to order</span>
                <span className="text-[#d98a3d]">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Promo blocks */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {PROMOS.map((promo) => (
            <a
              key={promo.t}
              href="#order"
              className="group relative h-72 rounded-3xl overflow-hidden"
            >
              <Image
                src={promo.image}
                alt={promo.t}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3a1c0e]/85 via-[#3a1c0e]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-2xl font-bold">{promo.t}</h3>
                <p className="text-[#fdf2e4]/85 text-sm mt-1">{promo.d}</p>
                <span className="inline-block mt-3 text-[#f0c088] text-sm font-semibold">
                  Shop now →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Build Your Box — products */}
      <section id="order" className="max-w-6xl mx-auto px-6 pb-8 scroll-mt-20">
        <div className="text-center mb-12">
          <p className="text-[#c0562b] uppercase tracking-[0.2em] text-sm font-semibold mb-2">
            Build Your Order
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#3a1c0e]">
            Choose Your Loaves
          </h2>
          <p className="text-[#8a5733] mt-3 text-lg">
            Plain loaf $10 · Specialty loaves $13 · Baked fresh to order
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((product) => (
            <div
              key={product.name}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#ecdac4] flex flex-col"
            >
              <div className="relative h-44">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-[#3a1c0e] text-lg leading-snug">
                  {product.name}
                </h3>
                <p className="text-sm text-[#8a5733] mt-1.5 mb-4 flex-1 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#3a1c0e] text-lg">
                    ${product.price.toFixed(2)}
                  </span>
                  {cart[product.name] ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQty(product.name, -1)}
                        className="w-9 h-9 rounded-full border border-[#d98a3d] text-[#3a1c0e] font-bold hover:bg-[#d98a3d] hover:text-white transition-colors"
                      >
                        −
                      </button>
                      <span className="w-4 text-center font-semibold">
                        {cart[product.name]}
                      </span>
                      <button
                        onClick={() => updateQty(product.name, 1)}
                        className="w-9 h-9 rounded-full bg-[#c0562b] text-white font-bold hover:bg-[#a3471f] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => updateQty(product.name, 1)}
                      className="bg-[#3a1c0e] text-[#fdf2e4] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#5c3115] transition-colors"
                    >
                      Add +
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6 Reasons (numbered) */}
      <section className="bg-[#3a1c0e] text-[#fdf2e4] py-24 mt-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#d98a3d] uppercase tracking-[0.2em] text-sm font-semibold mb-2">
              Why Sourdough
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold">
              6 reasons to choose real sourdough
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {REASONS.map((item, i) => (
              <div
                key={item.t}
                className="bg-[#4a2614] border border-[#5c3115] rounded-3xl p-7"
              >
                <div className="w-11 h-11 rounded-full bg-[#c0562b] text-white flex items-center justify-center font-extrabold text-lg mb-4">
                  {i + 1}
                </div>
                <h3 className="font-bold text-[#f0c088] text-lg mb-2">{item.t}</h3>
                <p className="text-[#fdf2e4]/80 text-sm leading-relaxed">
                  {item.d}
                </p>
              </div>
            ))}
          </div>

          {/* Store-bought truth callout */}
          <div className="mt-12 bg-[#c0562b]/15 border border-[#c0562b] rounded-3xl p-8 text-center max-w-3xl mx-auto">
            <p className="text-[#d98a3d] uppercase tracking-[0.2em] text-xs mb-3">
              The truth about store-bought
            </p>
            <p className="text-lg sm:text-xl leading-relaxed text-[#fdf2e4]">
              Most grocery-store &ldquo;sourdough&rdquo; isn&apos;t real — it&apos;s
              made with commercial yeast, soured artificially, and skips the long
              fermentation entirely.
            </p>
            <p className="mt-4 text-[#fdf2e4]/85 italic">
              Ours is real sourdough — slow-fermented, made from scratch, and
              never rushed.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-[#c0562b] uppercase tracking-[0.2em] text-sm font-semibold mb-2">
            How It Works
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#3a1c0e]">
            From our starter to your table
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.t} className="text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#c0562b] text-white flex items-center justify-center font-extrabold text-xl mb-5">
                {i + 1}
              </div>
              <h3 className="font-bold text-[#3a1c0e] text-lg mb-2">{step.t}</h3>
              <p className="text-[#8a5733] text-sm leading-relaxed">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-[#fbf1e5]">
        <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 lg:h-[26rem] rounded-3xl overflow-hidden shadow-md">
            <Image
              src="/bread/sarah-baking-16x9.png"
              alt="Sarah baking sourdough by hand"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <p className="text-[#c0562b] uppercase tracking-[0.2em] text-sm font-semibold mb-2">
              Our Story
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#3a1c0e] mb-5">
              Hi, I&apos;m Sarah.
            </h2>
            <p className="text-[#8a5733] text-lg leading-relaxed mb-4">
              I&apos;ll be honest — I fell down the sourdough rabbit hole because
              of TikTok. All those loaves, the gorgeous ones and the gloriously
              ugly ones, and I was hooked. (I still turn the flops into memes, no
              shame.)
            </p>
            <p className="text-[#8a5733] text-lg leading-relaxed mb-4">
              But it became more than a hobby. I needed something that was
              <em> mine</em> — a way to rebuild my strength, work through the hard
              days, and put my whole self into something with my hands.
            </p>
            <p className="text-[#8a5733] text-lg leading-relaxed mb-4">
              It got real last Easter, when I baked loaves for the people I work
              with. They cheered me on and kept telling me how good it was — and
              somewhere in there, this stopped being a project and became
              Breaking Bread.
            </p>
            <p className="text-[#8a5733] text-lg leading-relaxed mb-6">
              Every loaf is made with care, real fermentation, and just a few
              honest ingredients — because bread made that way simply tastes
              different. The imperfect ones? Those are my favorites. They&apos;re
              proof a real person made this, by hand, for you.
            </p>
            <p className="text-[#3a1c0e] text-xl italic font-medium border-l-4 border-[#c0562b] pl-4 mb-7">
              I put my fight into every loaf — and a whole lot of love. You&apos;ll
              taste the difference.
            </p>
            <a
              href="/about"
              className="inline-block bg-[#3a1c0e] text-[#fdf2e4] px-7 py-3 rounded-full font-semibold hover:bg-[#5c3115] transition-colors"
            >
              Read more →
            </a>
          </div>
        </div>
      </section>

      {/* Order Form */}
      <section className="bg-white border-t border-[#ecdac4]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-extrabold text-[#3a1c0e] mb-10 text-center">
            Complete Your Order
          </h2>
          <div className="grid lg:grid-cols-3 gap-10">
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#3a1c0e] mb-1">
                    First name
                  </label>
                  <input
                    required
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="w-full border border-[#ddc9b0] rounded-xl px-4 py-2.5 bg-[#fbf1e5] focus:outline-none focus:ring-2 focus:ring-[#d98a3d]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#3a1c0e] mb-1">
                    Last name
                  </label>
                  <input
                    required
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="w-full border border-[#ddc9b0] rounded-xl px-4 py-2.5 bg-[#fbf1e5] focus:outline-none focus:ring-2 focus:ring-[#d98a3d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3a1c0e] mb-1">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-[#ddc9b0] rounded-xl px-4 py-2.5 bg-[#fbf1e5] focus:outline-none focus:ring-2 focus:ring-[#d98a3d]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3a1c0e] mb-1">
                  Phone
                </label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-[#ddc9b0] rounded-xl px-4 py-2.5 bg-[#fbf1e5] focus:outline-none focus:ring-2 focus:ring-[#d98a3d]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3a1c0e] mb-1">
                  Pickup date
                </label>
                <input
                  required
                  type="date"
                  value={form.pickup_date}
                  onChange={(e) => setForm({ ...form, pickup_date: e.target.value })}
                  className="w-full border border-[#ddc9b0] rounded-xl px-4 py-2.5 bg-[#fbf1e5] focus:outline-none focus:ring-2 focus:ring-[#d98a3d]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3a1c0e] mb-2">
                  Payment method
                </label>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setForm({ ...form, payment_method: method })}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        form.payment_method === method
                          ? "bg-[#3a1c0e] text-white border-[#3a1c0e]"
                          : "bg-white text-[#3a1c0e] border-[#ddc9b0] hover:border-[#d98a3d]"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3a1c0e] mb-1">
                  Notes (optional)
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-[#ddc9b0] rounded-xl px-4 py-2.5 bg-[#fbf1e5] focus:outline-none focus:ring-2 focus:ring-[#d98a3d] resize-none"
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#c0562b] text-[#fdf2e4] py-4 rounded-full font-semibold text-lg hover:bg-[#a3471f] transition-colors disabled:opacity-60 shadow"
              >
                {loading ? "Placing order…" : "Place Pre-Order →"}
              </button>
            </form>

            {/* Order Summary */}
            <div className="bg-[#fbf1e5] border border-[#ecdac4] rounded-3xl p-6 h-fit lg:sticky lg:top-24">
              <h3 className="font-bold text-[#3a1c0e] text-lg mb-4">
                Order Summary
              </h3>
              {cartItems.length === 0 ? (
                <p className="text-[#b08a5f] text-sm">No items selected yet.</p>
              ) : (
                <ul className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <li key={item.name} className="flex justify-between text-sm">
                      <span className="text-[#3a1c0e]">
                        {item.name} × {item.qty}
                      </span>
                      <span className="font-medium text-[#3a1c0e]">
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="border-t border-[#ecdac4] pt-3 flex justify-between font-extrabold text-[#3a1c0e]">
                <span>Total{totalItems ? ` (${totalItems})` : ""}</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
