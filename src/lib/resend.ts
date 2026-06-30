import { Resend } from "resend";

// Set RESEND_API_KEY to your Resend API key
export function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

// Set OWNER_EMAIL to the bakery owner's email address
export const OWNER_EMAIL = process.env.OWNER_EMAIL ?? "ldsarah3@gmail.com";
// Verified Resend domain — sends to any recipient (customers + owner).
export const FROM_EMAIL = "Breaking Bread <orders@breaking-bread.net>";
