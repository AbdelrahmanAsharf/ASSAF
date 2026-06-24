import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const isInternal = req.headers.get("x-internal");
  if (!isInternal) return NextResponse.json({ isAdmin: false });

  const clerkId = req.nextUrl.searchParams.get("clerkId");
  if (!clerkId) return NextResponse.json({ isAdmin: false });

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { role: true },
  });

  return NextResponse.json({ isAdmin: user?.role === "ADMIN" });
}