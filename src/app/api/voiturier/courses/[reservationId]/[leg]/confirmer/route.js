import { NextResponse } from "next/server";
import { valetApiFetch } from "@/lib/valetApi";

export async function POST(request, { params }) {
  const { reservationId, leg } = await params;
  let body = {};
  try {
    body = await request.json();
  } catch {
    // pas de corps (confirmation simple sans questionnaire)
  }

  try {
    const data = await valetApiFetch(`/me/courses/${reservationId}/${leg}/confirmer`, {
      method: "POST",
      body,
    });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
