import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/requireAuth";

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const { vendorId } = auth;

  const [receipts, verifications] = await Promise.all([
    prisma.receipt.aggregate({
      where: { vendorId },
      _count: { id: true },
      _sum: { total: true },
    }),
    prisma.verification.count({
      where: { receipt: { vendorId } },
    }),
  ]);

  return NextResponse.json({
    issued: receipts._count.id,
    secured: receipts._sum.total ?? 0,
    verified: verifications,
  });
}
