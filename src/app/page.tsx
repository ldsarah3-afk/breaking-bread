"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product, CartItem, OrderPayload } from "@/types";

const PRODUCTS: Product[] = [
  {
    name: "Classic Country Loaf",
    description:
      "Our signature naturally-leavened loaf. A 48-hour ferment yields a blistered, crackling crust and a custardy, open crumb.",
    price: 10.0,
    image:
      "https://images.unsplash.com/photo-1585478259715-1c195ae2b568?w=400&q=75",
  },
  {
    name: "Cinnamon Raisin",
    description:
      "Plump raisins and ribbons of cinnamon folded through slow-fermented dough. Toasts beautifully, butter optional.",
    price: 13.0,
    image:
      "https://images.unsplash.com/photo-1568471173242-461f0a730452?w=400&q=75",
  },
  {
    name: "Jalapeño Cheddar",
    description:
      "Sharp cheddar and fresh jalapeño baked through a tangy crumb. Gentle heat, melted pockets, crackling crust.",
    price: 13.0,
    image:
      "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&q=75",
  },
  {
    name: "Garlic, Parmesan & Basil",
    description:
      "Roasted garlic, aged Parmesan, and sweet basil woven into every slice. Deeply savory and aromatic.",
    price: 13.0,
    image:
      "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&q=75",
  },
  {
    name: "Cheddar",
    description:
      "Generous folds of sharp cheddar melted into a golden, open crumb. Pure comfort in loaf form.",
    price: 13.0,
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=75",
  },
  {
    name: "Cheddar Garlic",
    description:
      "Sharp cheddar married with mellow roasted garlic — our most-requested savory loaf.",
    price: 13.0,
    image:
      "https://images.unsplash.com/photo-1585478259715-1c195ae2b568?w=400&q=75",
  },
  {
    name: "Croissant",
    description:
      "Laminated with patience and real butter, leavened with our living starter. Shatteringly flaky, golden through.",
    price: 13.0,
    image:
      "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=400&q=75",
  },
  {
    name: "Pizza Bread",
    description:
      "Tomato, herbs, and melted cheese baked into a pull-apart sourdough. A meal all on its own.",
    price: 13.0,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=75",
  },
];

const PAYMENT_METHODS = ["Card", "Apple Pay", "Venmo", "Cash", "Check"];

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
      <section className="relative h-[78vh] flex items-center justify-center text-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80"
          alt="Sourdough bread"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-[#3a1c0e]/75" />
        <div className="relative z-10 px-6 max-w-3xl mx-auto">
          <span className="inline-block bg-[#d98a3d]/25 border border-[#d98a3d] text-[#fdf2e4] text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6">
            Real sourdough — never rushed
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-5">
            Slow-fermented.<br />From scratch.
          </h1>
          <p className="text-[#fdf2e4]/85 text-lg sm:text-xl leading-relaxed">
            Naturally leavened with a living starter, fermented for 48 hours, and
            hand-shaped in small batches. This is true sourdough — not the
            store-bought imitation.
          </p>
          <a
            href="#order"
            className="inline-block mt-8 bg-[#c0562b] text-[#fdf2e4] px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-[#a3471f] transition-colors"
          >
            Pre-Order Fresh Loaves →
          </a>
        </div>
      </section>

      {/* Why Sourdough */}
      <section className="bg-[#3a1c0e] text-[#fdf2e4] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[#d98a3d] uppercase tracking-[0.2em] text-sm text-center mb-3">
            Why Sourdough
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Bread your body actually understands
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
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
            ].map((item) => (
              <div
                key={item.t}
                className="bg-[#4a2614] border border-[#5c3115] rounded-2xl p-6"
              >
                <h3 className="font-bold text-[#d98a3d] text-lg mb-2">
                  {item.t}
                </h3>
                <p className="text-[#fdf2e4]/80 text-sm leading-relaxed">
                  {item.d}
                </p>
              </div>
            ))}
          </div>

          {/* Store-bought truth callout */}
          <div className="mt-12 bg-[#c0562b]/15 border border-[#c0562b] rounded-2xl p-8 text-center max-w-3xl mx-auto">
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

      {/* Products */}
      <section id="order" className="max-w-5xl mx-auto px-6 py-20 scroll-mt-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#3a1c0e] mb-3 text-center">
          Choose Your Loaves
        </h2>
        <p className="text-center text-[#8a5733] mb-12">
          Plain loaf $10 · Specialty loaves $13 · Baked fresh to order
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <div
              key={product.name}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#ecdac4] flex flex-col"
            >
              <div className="relative h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-[#3a1c0e] text-lg">{product.name}</h3>
                <p className="text-sm text-[#8a5733] mt-1 mb-4 flex-1">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#3a1c0e] text-lg">
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQty(product.name, -1)}
                      className="w-8 h-8 rounded-full border border-[#d98a3d] text-[#3a1c0e] font-bold hover:bg-[#d98a3d] hover:text-white transition-colors"
                    >
                      −
                    </button>
                    <span className="w-4 text-center font-medium">
                      {cart[product.name] ?? 0}
                    </span>
                    <button
                      onClick={() => updateQty(product.name, 1)}
                      className="w-8 h-8 rounded-full bg-[#c0562b] text-white font-bold hover:bg-[#a3471f] transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Order Form */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#3a1c0e] mb-10 text-center">
          Your Order
        </h2>
        <div className="grid lg:grid-cols-3 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3a1c0e] mb-1">
                  First name
                </label>
                <input
                  required
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  className="w-full border border-[#ddc9b0] rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#d98a3d]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3a1c0e] mb-1">
                  Last name
                </label>
                <input
                  required
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  className="w-full border border-[#ddc9b0] rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#d98a3d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3a1c0e] mb-1">
                Email
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-[#ddc9b0] rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#d98a3d]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3a1c0e] mb-1">
                Phone
              </label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-[#ddc9b0] rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#d98a3d]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3a1c0e] mb-1">
                Pickup date
              </label>
              <input
                required
                type="date"
                value={form.pickup_date}
                onChange={(e) => setForm({ ...form, pickup_date: e.target.value })}
                className="w-full border border-[#ddc9b0] rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#d98a3d]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3a1c0e] mb-2">
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
              <label className="block text-sm font-medium text-[#3a1c0e] mb-1">
                Notes (optional)
              </label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border border-[#ddc9b0] rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#d98a3d] resize-none"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c0562b] text-[#fdf2e4] py-3.5 rounded-xl font-semibold text-lg hover:bg-[#a3471f] transition-colors disabled:opacity-60"
            >
              {loading ? "Placing order…" : "Place Pre-Order →"}
            </button>
          </form>

          {/* Order Summary */}
          <div className="bg-white border border-[#ecdac4] rounded-2xl p-6 h-fit">
            <h3 className="font-bold text-[#3a1c0e] text-lg mb-4">Order Summary</h3>
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
            <div className="border-t border-[#ecdac4] pt-3 flex justify-between font-bold text-[#3a1c0e]">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
