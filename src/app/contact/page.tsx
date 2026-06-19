"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <section className="max-w-xl mx-auto px-6 py-20">
      <p className="text-[#c0562b] uppercase tracking-[0.2em] text-sm font-semibold mb-2 text-center">
        Get in touch
      </p>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-[#3a1c0e] mb-4 text-center">
        Say hello
      </h1>
      <p className="text-[#8a5733] text-lg text-center mb-10">
        Questions, custom orders, or just want to talk bread? Send a note and
        Sarah will get back to you.
      </p>

      {status === "sent" ? (
        <div className="bg-white border border-[#ecdac4] rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">🍞</div>
          <h2 className="text-2xl font-bold text-[#3a1c0e] mb-2">
            Message sent!
          </h2>
          <p className="text-[#8a5733]">
            Thanks for reaching out — we&apos;ll reply to your email soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#3a1c0e] mb-1">
              Name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-[#ddc9b0] rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#d98a3d]"
            />
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
              className="w-full border border-[#ddc9b0] rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#d98a3d]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3a1c0e] mb-1">
              Message
            </label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-[#ddc9b0] rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#d98a3d] resize-none"
            />
          </div>

          {status === "error" && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-[#c0562b] text-[#fdf2e4] py-3.5 rounded-full font-semibold text-lg hover:bg-[#a3471f] transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "Sending…" : "Send Message"}
          </button>
        </form>
      )}
    </section>
  );
}
