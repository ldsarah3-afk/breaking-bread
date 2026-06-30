import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getResend, FROM_EMAIL, OWNER_EMAIL } from "@/lib/resend";

export const dynamic = "force-dynamic";

// Simple shared-password gate. Set ADMIN_PASSWORD in your environment.
function checkPassword(password: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return typeof expected === "string" && expected.length > 0 && password === expected;
}

export async function POST(req: NextRequest) {
  try {
    const { password, action, date, orderId, status, time } = await req.json();

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
      const { data: updated, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select()
        .single();
      if (error) throw new Error(error.message);

      // When an order is marked completed, send the customer a "ready" follow-up email.
      if (status === "completed" && updated?.email) {
        try {
          const { error: emailErr } = await getResend().emails.send({
            from: FROM_EMAIL,
            to: updated.email,
            subject: "Your Breaking Bread order is baked & ready 🍞",
            text: `Hi ${updated.first_name},\n\nYour bread is baked and set aside for your scheduled pickup!\n\nPlease meet us at your chosen time:\n\nLocation: ${updated.location}\nDate: ${updated.pickup_date}\nTime window: ${updated.pickup_time}\n\nPlease come during your scheduled window so we can be there to hand it off. See you then!\n— Sarah`,
          });
          if (emailErr) console.error("Follow-up email error:", emailErr);
        } catch (e) {
          console.error("Follow-up email failed:", e);
        }
      }
    } else if (action === "proposeTime" && orderId && time) {
      const { data: order, error } = await supabase
        .from("orders")
        .select("first_name, email, pickup_date, pickup_time, location")
        .eq("id", orderId)
        .single();
      if (error) throw new Error(error.message);

      if (order?.email) {
        const { error: emailErr } = await getResend().emails.send({
          from: FROM_EMAIL,
          to: order.email,
          replyTo: OWNER_EMAIL,
          subject: "A pickup time for your Breaking Bread order",
          text: `Hi ${order.first_name},\n\nThanks again for your order! For your pickup on ${order.pickup_date} at ${order.location} (${order.pickup_time} window), could you do ${time}?\n\nJust reply to this email to confirm — or let me know a time that works better and we'll sort it out.\n\n— Sarah, Breaking Bread`,
        });
        if (emailErr) throw new Error(emailErr.message);
      }
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
