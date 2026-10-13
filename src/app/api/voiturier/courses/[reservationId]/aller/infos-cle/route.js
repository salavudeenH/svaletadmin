import { NextResponse } from "next/server";
import { valetApiFetch } from "@/lib/valetApi";

export async function POST(request, { params }) {
  const { reservationId } = await params;
  const body = await request.json().catch(() => ({}));

  try {
    const data = await valetApiFetch(`/me/courses/${reservationId}/aller/infos-cle`, { method: "POST", body });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message, suggestion: err.data?.suggestion }, { status: err.status || 500 });
  }
}
