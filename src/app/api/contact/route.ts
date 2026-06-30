import { NextRequest, NextResponse } from "next/server";
import { getResend, FROM_EMAIL, OWNER_EMAIL } from "@/lib/resend";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, company } = await req.json();

    // Honeypot: if this hidden field is filled, it's a bot. Pretend success, drop it.
    if (company) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Please fill in your name, email, and message." },
        { status: 400 }
      );
    }

    const resend = getResend();
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      replyTo: email,
      subject: `New message from ${name} — Breaking Bread`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      console.error("Resend error (contact):", error);
      return NextResponse.json(
        { error: `${error.name}: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const m = err instanceof Error ? err.message : "Failed to send message.";
    console.error("Contact form error:", m);
    return NextResponse.json({ error: m }, { status: 500 });
  }
}
