import { Resend } from "resend";

// Set RESEND_API_KEY to your Resend API key
export const resend = new Resend(process.env.RESEND_API_KEY);

// Set OWNER_EMAIL to the bakery owner's email address
export const OWNER_EMAIL = process.env.OWNER_EMAIL ?? "owner@breakingbread.com";
export const FROM_EMAIL = "orders@breakingbread.com";
