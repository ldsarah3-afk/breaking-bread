import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Returns the list of dates Sarah has marked unavailable (YYYY-MM-DD strings).
export async function GET() {
  try {
    const { data, error } = await getSupabase()
      .from("unavailable_dates")
      .select("date");

    if (error) {
      console.error("Availability fetch error:", error.message);
      return NextResponse.json({ dates: [] });
    }

    const dates = (data ?? []).map((row: { date: string }) => row.date);
    return NextResponse.json({ dates });
  } catch (err) {
    console.error("Availability error:", err);
    return NextResponse.json({ dates: [] });
  }
}
