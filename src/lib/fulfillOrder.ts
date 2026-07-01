import { getSupabase } from "@/lib/supabase";
import { getResend, FROM_EMAIL, OWNER_EMAIL } from "@/lib/resend";
import type { OrderPayload } from "@/types";

const ADMIN_URL = "https://breaking-bread.net/admin";

// Saves an order to Supabase and sends confirmation emails.
// Shared by the direct-order route (Venmo/Cash/Check) and the Stripe webhook (Card/Apple Pay).
export async function fulfillOrder(order: OrderPayload) {
  const isDelivery = order.fulfillment === "delivery";

  const { error } = await getSupabase().from("orders").insert({
    first_name: order.first_name,
    last_name: order.last_name,
    email: order.email,
    phone: order.phone,
    fulfillment: order.fulfillment,
    pickup_date: order.pickup_date,
    pickup_time: order.pickup_time,
    location: order.location,
    delivery_address: order.delivery_address,
    delivery_fee: order.delivery_fee,
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

  const whereLine = isDelivery
    ? `Delivery to: ${order.delivery_address}`
    : `Pickup: ${order.location}`;
  const feeLine =
    isDelivery && order.delivery_fee > 0
      ? `\nDelivery fee: $${order.delivery_fee.toFixed(2)}`
      : "";

  const resend = getResend();

  const customerEmail = await resend.emails.send({
    from: FROM_EMAIL,
    to: order.email,
    subject: "Your Breaking Bread order is confirmed!",
    text: `Hi ${order.first_name},\n\nYour order is confirmed!\n\n${itemLines}${feeLine}\n\nTotal: $${order.total.toFixed(2)}\n\n${whereLine}\nDate: ${order.pickup_date} (${order.pickup_time})\n\nWe'll follow up with a specific time. See you soon!\n— Breaking Bread`,
  });
  if (customerEmail.error) {
    console.error("Resend error (customer email):", customerEmail.error);
  }

  const ownerEmail = await resend.emails.send({
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    subject: `New ${isDelivery ? "DELIVERY" : "pickup"} order from ${order.first_name} ${order.last_name}`,
    text: `New order received!\n\nName: ${order.first_name} ${order.last_name}\nEmail: ${order.email}\nPhone: ${order.phone}\n\n${whereLine}\nDate: ${order.pickup_date} (${order.pickup_time})\n\nPayment: ${order.payment_method}\nNotes: ${order.notes}\n\n${itemLines}${feeLine}\n\nTotal: $${order.total.toFixed(2)}\n\n👉 REMINDER: Log in to send this customer a specific ${isDelivery ? "delivery" : "pickup"} time:\n${ADMIN_URL}`,
  });
  if (ownerEmail.error) {
    console.error("Resend error (owner email):", ownerEmail.error);
  }
}
