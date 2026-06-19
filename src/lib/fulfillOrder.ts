import { getSupabase } from "@/lib/supabase";
import { getResend, FROM_EMAIL, OWNER_EMAIL } from "@/lib/resend";
import type { OrderPayload } from "@/types";

// Saves an order to Supabase and sends confirmation emails.
// Shared by the direct-order route (Venmo/Cash/Check) and the Stripe webhook (Card/Apple Pay).
export async function fulfillOrder(order: OrderPayload) {
  const { error } = await getSupabase().from("orders").insert({
    first_name: order.first_name,
    last_name: order.last_name,
    email: order.email,
    phone: order.phone,
    pickup_date: order.pickup_date,
    payment_method: order.payment_method,
    notes: order.notes,
    items: order.items,
    total: order.total,
    status: "pending",
  });

  if (error) throw new Error(error.message);

  const itemLines = order.items
    .map((i) => `${i.name} × ${i.qty} — $${(i.price * i.qty).toFixed(2)}`)
    .join("\n");

  const resend = getResend();

  const customerEmail = await resend.emails.send({
    from: FROM_EMAIL,
    to: order.email,
    subject: "Your Breaking Bread order is confirmed!",
    text: `Hi ${order.first_name},\n\nYour order is confirmed!\n\n${itemLines}\n\nTotal: $${order.total.toFixed(2)}\nPickup date: ${order.pickup_date}\n\nSee you soon!\n— Breaking Bread`,
  });
  if (customerEmail.error) {
    console.error("Resend error (customer email):", customerEmail.error);
  }

  const ownerEmail = await resend.emails.send({
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    subject: `New order from ${order.first_name} ${order.last_name}`,
    text: `New order received!\n\nName: ${order.first_name} ${order.last_name}\nEmail: ${order.email}\nPhone: ${order.phone}\nPickup: ${order.pickup_date}\nPayment: ${order.payment_method}\nNotes: ${order.notes}\n\n${itemLines}\n\nTotal: $${order.total.toFixed(2)}`,
  });
  if (ownerEmail.error) {
    console.error("Resend error (owner email):", ownerEmail.error);
  }
}
