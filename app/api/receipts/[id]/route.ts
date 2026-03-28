// src/app/api/receipts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/requireAuth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const { vendorId } = auth;

  const { id } = await params;

  try {
    const receipt = await prisma.receipt.findFirst({
      where: {
        id: id,
        vendorId,
      },
      include: {
        items: true,
        vendor: {
          select: { shopName: true, address: true, phone: true, city: true },
        },
        _count: { select: { verifications: true } },
      },
    });

    if (!receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    return NextResponse.json({ receipt });
  } catch (error) {
    console.error("[GET_RECEIPT]", error);
    return NextResponse.json(
      { error: "Failed to fetch receipt" },
      { status: 500 },
    );
  }
}
