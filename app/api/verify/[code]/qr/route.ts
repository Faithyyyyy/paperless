// app/api/verify/[code]/qr/route.ts
// PUBLIC — no auth required, anyone verifying a receipt can get the QR
import { NextRequest, NextResponse } from "next/server";
import { generateQRCode } from "../../../../../lib/qr";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  try {
    const qrDataUrl = await generateQRCode(code.toUpperCase());
    return NextResponse.json({ qr: qrDataUrl });
  } catch (error) {
    console.error("[PUBLIC_QR]", error);
    return NextResponse.json(
      { error: "Failed to generate QR" },
      { status: 500 },
    );
  }
}
