"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";

type OrderItem = { name: string; qty: number; price: number };
type Order = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  pickup_date: string;
  pickup_time: string;
  location: string;
  payment_method: string;
  notes: string;
  items: OrderItem[];
  total: number;
  status: string;
};

const toYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
const fromYMD = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"active" | "completed">("active");

  const call = async (body: Record<string, unknown>) => {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, ...body }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? "Request failed");
    return data;
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = await call({});
      setOrders(data.orders);
      setBlocked(data.blockedDates);
      setAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const toggleDay = async (day: Date) => {
    const ymd = toYMD(day);
    const isBlocked = blocked.includes(ymd);
    setBusy(true);
    setError("");
    try {
      const data = await call({ action: isBlocked ? "unblock" : "block", date: ymd });
      setBlocked(data.blockedDates);
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const setStatus = async (orderId: string, status: string) => {
    setBusy(true);
    setError("");
    try {
      const data = await call({ action: "setStatus", orderId, status });
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  if (!authed) {
    return (
      <section className="max-w-sm mx-auto px-6 py-24">
        <h1 className="text-3xl font-extrabold text-[#3a1c0e] mb-6 text-center">
          Bakery Admin
        </h1>
        <form onSubmit={login} className="space-y-4">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-[#ddc9b0] rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#d98a3d]"
          />
          {error && <p role="alert" className="text-red-700 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-[#a3471f] text-[#fdf2e4] py-3 rounded-full font-semibold hover:bg-[#863a18] transition-colors disabled:opacity-60"
          >
            {busy ? "Checking…" : "Unlock"}
          </button>
        </form>
      </section>
    );
  }

  const blockedDates = blocked.map(fromYMD);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold text-[#3a1c0e] mb-2">Bakery Admin</h1>
      {error && <p role="alert" className="text-red-700 text-sm mb-4">{error}</p>}

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Block dates */}
        <div>
          <h2 className="text-xl font-bold text-[#3a1c0e] mb-2">
            Block unavailable days
          </h2>
          <p className="text-[#8a5733] text-sm mb-4">
            Tap a day to block it (customers can&apos;t pick it). Tap again to
            reopen. Blocked days are highlighted.
          </p>
          <div className="bg-white border border-[#ecdac4] rounded-2xl p-4 inline-block">
            <DayPicker
              mode="multiple"
              selected={blockedDates}
              onDayClick={toggleDay}
              disabled={{ before: today }}
              modifiersClassNames={{ selected: "rdp-blocked" }}
            />
          </div>
          {blocked.length > 0 && (
            <p className="text-[#8a5733] text-sm mt-3">
              Blocked: {blocked.slice().sort().join(", ")}
            </p>
          )}
        </div>

        {/* Orders */}
        <div>
          {(() => {
            const activeOrders = orders.filter((o) => o.status !== "completed");
            const completedOrders = orders.filter((o) => o.status === "completed");
            const shown = tab === "active" ? activeOrders : completedOrders;
            return (
              <>
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setTab("active")}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                      tab === "active"
                        ? "bg-[#3a1c0e] text-white border-[#3a1c0e]"
                        : "bg-white text-[#3a1c0e] border-[#ddc9b0] hover:border-[#d98a3d]"
                    }`}
                  >
                    Active ({activeOrders.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("completed")}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                      tab === "completed"
                        ? "bg-[#3a1c0e] text-white border-[#3a1c0e]"
                        : "bg-white text-[#3a1c0e] border-[#ddc9b0] hover:border-[#d98a3d]"
                    }`}
                  >
                    Completed ({completedOrders.length})
                  </button>
                </div>
                <div className="space-y-4 max-h-[36rem] overflow-y-auto pr-1">
                  {shown.length === 0 ? (
                    <p className="text-[#8a5733] text-sm">
                      {tab === "active"
                        ? "No active orders."
                        : "No completed orders yet."}
                    </p>
                  ) : (
                    shown.map((o) => (
                <div
                  key={o.id}
                  className={`border rounded-2xl p-4 text-sm ${
                    o.status === "completed"
                      ? "bg-[#f3efe7] border-[#ecdac4] opacity-70"
                      : "bg-white border-[#ecdac4]"
                  }`}
                >
                  <div className="flex justify-between items-start font-bold text-[#3a1c0e]">
                    <span>
                      {o.first_name} {o.last_name}
                    </span>
                    <span>${Number(o.total).toFixed(2)}</span>
                  </div>
                  <div className="mt-1 mb-1">
                    <span
                      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                        o.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {o.status === "completed" ? "Completed" : "Pending"}
                    </span>
                  </div>
                  <p className="text-[#8a5733]">
                    {o.pickup_date} · {o.pickup_time}
                  </p>
                  <p className="text-[#8a5733]">{o.location}</p>
                  <ul className="mt-2 text-[#3a1c0e]">
                    {(o.items ?? []).map((it, i) => (
                      <li key={i}>
                        {it.name} × {it.qty}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[#8a5733] mt-2">
                    {o.payment_method} · {o.phone} · {o.email}
                  </p>
                  {o.notes && (
                    <p className="text-[#3a1c0e] mt-2 italic">“{o.notes}”</p>
                  )}
                  <div className="mt-3">
                    {o.status === "completed" ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setStatus(o.id, "pending")}
                        className="text-sm font-semibold text-[#8a5733] underline disabled:opacity-50"
                      >
                        Reopen
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setStatus(o.id, "completed")}
                        className="bg-[#3a1c0e] text-[#fdf2e4] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#5c3115] transition-colors disabled:opacity-50"
                      >
                        Mark as completed
                      </button>
                    )}
                  </div>
                </div>
                    ))
                  )}
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
