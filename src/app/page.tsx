"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product, CartItem, OrderPayload } from "@/types";

const PRODUCTS: Product[] = [
  {
    name: "Classic Country Loaf",
    description: "Tangy open crumb, crispy crust. Our signature.",
    price: 9.0,
    image:
      "https://images.unsplash.com/photo-1585478259715-1c195ae2b568?w=400&q=75",
  },
  {
    name: "Whole Wheat Loaf",
    description: "Nutty, hearty, and deeply satisfying.",
    price: 10.0,
    image:
      "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&q=75",
  },
  {
    name: "Rosemary & Sea Salt",
    description: "Fragrant herbs baked into every bite.",
    price: 11.0,
    image:
      "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&q=75",
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
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        throw new Error(data.error ?? "Checkout failed");
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
      <section className="relative h-[70vh] flex items-center justify-center text-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80"
          alt="Sourdough bread"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-[#3d2b1f]/70" />
        <div className="relative z-10 px-6 max-w-2xl mx-auto">
          <span className="inline-block bg-[#c9a87c]/30 border border-[#c9a87c] text-[#fdf6ec] text-xs uppercase tracking-widest px-4 py-1 rounded-full mb-5">
            Handcrafted in small batches
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-4">
            Slow-fermented.<br />Made with love.
          </h1>
          <p className="text-[#fdf6ec]/80 text-lg">
            Pre-order fresh sourdough loaves baked to order, right in your neighborhood.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-[#3d2b1f] mb-10 text-center">
          Choose Your Loaves
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <div
              key={product.name}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e8ddd3]"
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
              <div className="p-5">
                <h3 className="font-bold text-[#3d2b1f] text-lg">{product.name}</h3>
                <p className="text-sm text-[#7a5c47] mt-1 mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#3d2b1f]">
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQty(product.name, -1)}
                      className="w-8 h-8 rounded-full border border-[#c9a87c] text-[#3d2b1f] font-bold hover:bg-[#c9a87c] hover:text-white transition-colors"
                    >
                      −
                    </button>
                    <span className="w-4 text-center font-medium">
                      {cart[product.name] ?? 0}
                    </span>
                    <button
                      onClick={() => updateQty(product.name, 1)}
                      className="w-8 h-8 rounded-full bg-[#c9a87c] text-white font-bold hover:bg-[#b8966a] transition-colors"
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
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold text-[#3d2b1f] mb-10 text-center">
          Your Order
        </h2>
        <div className="grid lg:grid-cols-3 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3d2b1f] mb-1">
                  First name
                </label>
                <input
                  required
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  className="w-full border border-[#d9cdc4] rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a87c]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3d2b1f] mb-1">
                  Last name
                </label>
                <input
                  required
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  className="w-full border border-[#d9cdc4] rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a87c]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2b1f] mb-1">
                Email
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-[#d9cdc4] rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a87c]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2b1f] mb-1">
                Phone
              </label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-[#d9cdc4] rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a87c]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2b1f] mb-1">
                Pickup date
              </label>
              <input
                required
                type="date"
                value={form.pickup_date}
                onChange={(e) => setForm({ ...form, pickup_date: e.target.value })}
                className="w-full border border-[#d9cdc4] rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a87c]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2b1f] mb-2">
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
                        ? "bg-[#3d2b1f] text-white border-[#3d2b1f]"
                        : "bg-white text-[#3d2b1f] border-[#d9cdc4] hover:border-[#c9a87c]"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2b1f] mb-1">
                Notes (optional)
              </label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border border-[#d9cdc4] rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a87c] resize-none"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3d2b1f] text-[#fdf6ec] py-3.5 rounded-xl font-semibold text-lg hover:bg-[#5a3f2e] transition-colors disabled:opacity-60"
            >
              {loading ? "Placing order…" : "Place Pre-Order →"}
            </button>
          </form>

          {/* Order Summary */}
          <div className="bg-white border border-[#e8ddd3] rounded-2xl p-6 h-fit">
            <h3 className="font-bold text-[#3d2b1f] text-lg mb-4">Order Summary</h3>
            {cartItems.length === 0 ? (
              <p className="text-[#a08060] text-sm">No items selected yet.</p>
            ) : (
              <ul className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <li key={item.name} className="flex justify-between text-sm">
                    <span className="text-[#3d2b1f]">
                      {item.name} × {item.qty}
                    </span>
                    <span className="font-medium text-[#3d2b1f]">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="border-t border-[#e8ddd3] pt-3 flex justify-between font-bold text-[#3d2b1f]">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
