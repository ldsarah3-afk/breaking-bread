import { NextRequest, NextResponse } from "next/server";
import { fulfillOrder } from "@/lib/fulfillOrder";
import type { OrderPayload } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body: OrderPayload = await req.json();
    await fulfillOrder(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Order failed.";
    console.error("Order error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
