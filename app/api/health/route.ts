import { NextResponse } from "next/server";

interface HealthCheckResponse {
  status: "ok" | "error";
  service: string;
  timestamp: string;
}

export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
  return NextResponse.json({
    status: "ok",
    service: "fasaro-api",
    timestamp: new Date().toISOString(),
  });
}
