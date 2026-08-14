import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  try {
    const { data } = await apiFetch(`/admin/users/lookup?query=${encodeURIComponent(query)}`);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: err.status || 500 });
  }
}
