// app/api/receipts/[receiptId]/qr/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/requireAuth";
import { generateQRCode } from "../../../../../lib/qr";

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
      where: { id: id, vendorId },
      select: { receiptCode: true },
    });

    if (!receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    const qrDataUrl = await generateQRCode(receipt.receiptCode);

    return NextResponse.json({
      qr: qrDataUrl,
      receiptCode: receipt.receiptCode,
    });
  } catch (error) {
    console.error("[QR_GENERATE]", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 },
    );
  }
}
