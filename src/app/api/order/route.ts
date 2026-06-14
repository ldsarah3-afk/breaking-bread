import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getResend, FROM_EMAIL, OWNER_EMAIL } from "@/lib/resend";
import type { OrderPayload } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body: OrderPayload = await req.json();
  const resend = getResend();

  const { error } = await getSupabase().from("orders").insert({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    phone: body.phone,
    pickup_date: body.pickup_date,
    payment_method: body.payment_method,
    notes: body.notes,
    items: body.items,
    total: body.total,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const itemLines = body.items
    .map((i) => `${i.name} × ${i.qty} — $${(i.price * i.qty).toFixed(2)}`)
    .join("\n");

  await resend.emails.send({
    from: FROM_EMAIL,
    to: body.email,
    subject: "Your Breaking Bread order is confirmed!",
    text: `Hi ${body.first_name},\n\nYour order is confirmed!\n\n${itemLines}\n\nTotal: $${body.total.toFixed(2)}\nPickup date: ${body.pickup_date}\n\nSee you soon!\n— Breaking Bread`,
  });

  await resend.emails.send({
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    subject: `New order from ${body.first_name} ${body.last_name}`,
    text: `New order received!\n\nName: ${body.first_name} ${body.last_name}\nEmail: ${body.email}\nPhone: ${body.phone}\nPickup: ${body.pickup_date}\nPayment: ${body.payment_method}\nNotes: ${body.notes}\n\n${itemLines}\n\nTotal: $${body.total.toFixed(2)}`,
  });

  return NextResponse.json({ success: true });
}
