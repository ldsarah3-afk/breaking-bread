import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

// Simple shared-password gate. Set ADMIN_PASSWORD in your environment.
function checkPassword(password: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return typeof expected === "string" && expected.length > 0 && password === expected;
}

export async function POST(req: NextRequest) {
  try {
    const { password, action, date, orderId, status } = await req.json();

    if (!checkPassword(password)) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    if (action === "block" && date) {
      const { error } = await supabase
        .from("unavailable_dates")
        .upsert({ date }, { onConflict: "date" });
      if (error) throw new Error(error.message);
    } else if (action === "unblock" && date) {
      const { error } = await supabase
        .from("unavailable_dates")
        .delete()
        .eq("date", date);
      if (error) throw new Error(error.message);
    } else if (action === "setStatus" && orderId && status) {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);
      if (error) throw new Error(error.message);
    }

    // Always return current state (orders + blocked dates)
    const [ordersRes, datesRes] = await Promise.all([
      supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("unavailable_dates").select("date"),
    ]);

    if (ordersRes.error) throw new Error(ordersRes.error.message);
    if (datesRes.error) throw new Error(datesRes.error.message);

    return NextResponse.json({
      orders: ordersRes.data ?? [],
      blockedDates: (datesRes.data ?? []).map((r: { date: string }) => r.date),
    });
  } catch (err) {
    const m = err instanceof Error ? err.message : "Admin request failed.";
    console.error("Admin error:", m);
    return NextResponse.json({ error: m }, { status: 500 });
  }
}
