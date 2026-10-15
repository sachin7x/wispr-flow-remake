import { NextResponse } from "next/server";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "flow-remake-web-api",
    asr: "not-configured",
  });
}
