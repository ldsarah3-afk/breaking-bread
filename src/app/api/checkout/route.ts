import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import Stripe from "stripe";
import type { OrderPayload } from "@/types";

// Set STRIPE_SECRET_KEY to your Stripe secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body: OrderPayload = await req.json();
  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    })),
    mode: "payment",
    customer_email: body.email,
    metadata: {
      first_name: body.first_name,
      last_name: body.last_name,
      phone: body.phone,
      pickup_date: body.pickup_date,
      payment_method: body.payment_method,
      notes: body.notes,
      items: JSON.stringify(body.items),
      total: String(body.total),
    },
    success_url: `${origin}/confirmation`,
    cancel_url: `${origin}/`,
  });

  return NextResponse.json({ url: session.url });
}
