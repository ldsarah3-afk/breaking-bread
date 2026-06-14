import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillOrder } from "@/lib/fulfillOrder";
import type { OrderPayload } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // Set STRIPE_WEBHOOK_SECRET to the signing secret from your Stripe webhook endpoint
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature!, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const m = session.metadata ?? {};

    const order: OrderPayload = {
      first_name: m.first_name ?? "",
      last_name: m.last_name ?? "",
      email: session.customer_email ?? m.email ?? "",
      phone: m.phone ?? "",
      pickup_date: m.pickup_date ?? "",
      payment_method: m.payment_method ?? "Card",
      notes: m.notes ?? "",
      items: m.items ? JSON.parse(m.items) : [],
      total: m.total ? Number(m.total) : 0,
    };

    try {
      await fulfillOrder(order);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Fulfillment failed";
      console.error("Order fulfillment failed:", message);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
