import { NextResponse } from "next/server";

export const runtime = "nodejs";
const MAX_TRANSCRIPT_LENGTH = 30_000;

function formatTranscript(input: string): { text: string; transformations: string[] } {
  let text = input.trim().replace(/\s+/g, " ");
  if (!text) throw new Error("transcript must not be blank");
  const transformations: string[] = [];
  const replacements: Array<[RegExp, string]> = [
    [/\s+comma\s*/gi, ", "],
    [/\s+question mark\s*/gi, "? "],
    [/\s+exclamation mark\s*/gi, "! "],
    [/\s+period\s*/gi, ". "],
    [/\s+colon\s*/gi, ": "],
    [/\s+semicolon\s*/gi, "; "],
  ];
  for (const [pattern, replacement] of replacements) {
    const changed = text.replace(pattern, replacement);
    if (changed !== text) transformations.push("spoken-punctuation");
    text = changed;
  }
  text = text
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/([,.!?;]|(?<!\d):)(?=\S)/g, "$1 ")
    .replace(/\s+/g, " ")
    .trim();
  if (text && !/[.!?]$/.test(text)) {
    text += ".";
    transformations.push("terminal-punctuation");
  }
  return { text, transformations: [...new Set(transformations)].sort() };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "request body must be valid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || !("transcript" in body)) {
    return NextResponse.json({ detail: "transcript is required" }, { status: 422 });
  }
  const { transcript, style = "natural" } = body as { transcript: unknown; style?: unknown };
  if (typeof transcript !== "string" || transcript.trim().length === 0) {
    return NextResponse.json({ detail: "transcript must not be blank" }, { status: 422 });
  }
  if (transcript.length > MAX_TRANSCRIPT_LENGTH) {
    return NextResponse.json({ detail: "transcript exceeds 30000 characters" }, { status: 413 });
  }
  if (style !== "natural") {
    return NextResponse.json({ detail: "only the natural style is implemented" }, { status: 422 });
  }
  const result = formatTranscript(transcript);
  return NextResponse.json({
    ...result,
    style,
    review_required: true,
  });
}
