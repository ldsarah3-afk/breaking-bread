import { Resend } from "resend";

// Set RESEND_API_KEY to your Resend API key
export function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

// Set OWNER_EMAIL to the bakery owner's email address
export const OWNER_EMAIL = process.env.OWNER_EMAIL ?? "owner@breakingbread.com";
// Resend's shared test domain — works with no domain setup.
// Swap to "orders@yourdomain.com" once you verify your own domain in Resend.
export const FROM_EMAIL = "Breaking Bread <onboarding@resend.dev>";
