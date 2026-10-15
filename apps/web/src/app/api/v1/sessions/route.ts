import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
const MAX_LENGTH = 30_000;
const TARGETS = new Set(["email", "work_messaging", "personal_messaging", "other"]);

async function authenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { response: NextResponse.json({ detail: "Sign in required." }, { status: 401 }) };
  return { supabase, user: data.user };
}

export async function GET() {
  let auth;
  try {
    auth = await authenticatedClient();
  } catch {
    return NextResponse.json({ detail: "Supabase is not configured." }, { status: 503 });
  }
  if ("response" in auth) return auth.response;

  const { data, error } = await auth.supabase
    .from("dictation_sessions")
    .select("id,status,target_app_category,raw_transcript,formatted_transcript,created_at,completed_at")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ detail: "Could not load session history." }, { status: 500 });
  return NextResponse.json({ sessions: data ?? [] });
}

export async function POST(request: Request) {
  let auth;
  try {
    auth = await authenticatedClient();
  } catch {
    return NextResponse.json({ detail: "Supabase is not configured." }, { status: 503 });
  }
  if ("response" in auth) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Request body must be valid JSON." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ detail: "A session payload is required." }, { status: 422 });
  }

  const value = body as Record<string, unknown>;
  const raw = value.raw_transcript;
  const formatted = value.formatted_transcript;
  const target = value.target_app_category ?? "other";
  if (typeof raw !== "string" || typeof formatted !== "string" || !raw.trim() || !formatted.trim()) {
    return NextResponse.json({ detail: "Raw and formatted transcripts are required." }, { status: 422 });
  }
  if (raw.length > MAX_LENGTH || formatted.length > MAX_LENGTH) {
    return NextResponse.json({ detail: "Transcripts must be 30000 characters or fewer." }, { status: 413 });
  }
  if (typeof target !== "string" || !TARGETS.has(target)) {
    return NextResponse.json({ detail: "Unsupported target app category." }, { status: 422 });
  }

  const now = new Date().toISOString();
  const { data, error } = await auth.supabase
    .from("dictation_sessions")
    .insert({
      user_id: auth.user.id,
      status: "completed",
      target_app_category: target,
      raw_transcript: raw,
      formatted_transcript: formatted,
      completed_at: now,
    })
    .select("id,status,target_app_category,raw_transcript,formatted_transcript,created_at,completed_at")
    .single();

  if (error) return NextResponse.json({ detail: "Could not save this session." }, { status: 500 });
  return NextResponse.json({ session: data }, { status: 201 });
}
