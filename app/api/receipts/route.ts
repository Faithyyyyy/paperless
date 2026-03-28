// src/app/api/receipts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/requireAuth";
import {
  generateReceiptCode,
  generateReceiptHash,
  generateNonce,
} from "@/lib/hash";
import { sendReceiptEmail } from "@/lib/email";
import { z } from "zod";

// ─── Validation ────────────────────────────────────────────────────────────────

const ItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  imei: z.string().optional().nullable(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Price cannot be negative"),
});

const CreateReceiptSchema = z.object({
  buyerName: z.string().min(1, "Buyer name is required"),
  buyerPhone: z.string().min(1, "Buyer phone is required"),
  buyerEmail: z.string().email().optional().nullable(),
  vatRate: z.number().min(0).max(100).default(7.5),
  deliveryMethod: z
    .enum(["WHATSAPP", "EMAIL", "SMS", "LINK"])
    .default("WHATSAPP"),
  purchaseDate: z.string().datetime().optional(),
  items: z.array(ItemSchema).min(1, "At least one item is required"),
});

// ─── POST /api/receipts — Issue a new receipt ──────────────────────────────────

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const { vendorId } = auth;

  try {
    const body = await req.json();
    const parsed = CreateReceiptSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const {
      buyerName,
      buyerPhone,
      buyerEmail,
      vatRate,
      deliveryMethod,
      purchaseDate,
      items,
    } = parsed.data;

    // ── Calculate totals
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    const vatAmount = Number((subtotal * (vatRate / 100)).toFixed(2));
    const total = Number((subtotal + vatAmount).toFixed(2));
    const purchaseDateObj = purchaseDate ? new Date(purchaseDate) : new Date();

    // ── Generate unique receipt code and tamper-proof hash
    const receiptCode = generateReceiptCode();
    const nonce = generateNonce();
    const hash = generateReceiptHash({
      vendorId,
      buyerName,
      buyerPhone,
      items: items.map((i) => ({
        name: i.name,
        imei: i.imei ?? null,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      subtotal,
      vatRate,
      vatAmount,
      total,
      purchaseDate: purchaseDateObj.toISOString(),
      nonce,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const receipt = await prisma.$transaction(async (tx: any) => {
      const created = await tx.receipt.create({
        data: {
          receiptCode,
          vendorId,
          buyerName,
          buyerPhone,
          buyerEmail: buyerEmail ?? null,
          vatRate,
          subtotal,
          vatAmount,
          total,
          hash,
          nonce,
          deliveryMethod,
          purchaseDate: purchaseDateObj,
          status: "ISSUED",
          items: {
            create: items.map((item) => ({
              name: item.name,
              imei: item.imei ?? null,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              lineTotal: Number((item.quantity * item.unitPrice).toFixed(2)),
            })),
          },
        },
        include: { items: true, vendor: true },
      });

      return created;
    });

    // ── Attempt delivery (non-blocking — don't fail the receipt if delivery fails)
    let sentAt: Date | null = null;
    try {
      if (deliveryMethod === "EMAIL" && buyerEmail) {
        await sendReceiptEmail({ receipt });
        sentAt = new Date();
      }
      // WhatsApp and SMS would use Twilio/Termii here — stubbed for now
      if (deliveryMethod === "WHATSAPP" || deliveryMethod === "SMS") {
        // await sendWhatsApp({ phone: buyerPhone, receiptCode })
        sentAt = new Date(); // mark as sent once integrated
      }

      if (sentAt) {
        await prisma.receipt.update({
          where: { id: receipt.id },
          data: { status: "SENT", sentAt },
        });
      }
    } catch (deliveryError) {
      console.error("[RECEIPT_DELIVERY_FAILED]", deliveryError);
      await prisma.receipt.update({
        where: { id: receipt.id },
        data: { status: "FAILED" },
      });
    }

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${receiptCode}`;

    return NextResponse.json(
      {
        message: "Receipt issued successfully",
        receipt: {
          id: receipt.id,
          receiptCode: receipt.receiptCode,
          total: receipt.total,
          verifyUrl,
          status: sentAt ? "SENT" : "ISSUED",
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[CREATE_RECEIPT]", error);
    return NextResponse.json(
      { error: "Failed to create receipt. Please try again." },
      { status: 500 },
    );
  }
}

// ─── GET /api/receipts — List vendor's receipts ────────────────────────────────

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const { vendorId } = auth;

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
  const search = searchParams.get("search") ?? "";
  const skip = (page - 1) * limit;

  try {
    const where = {
      vendorId,
      ...(search && {
        OR: [
          { buyerName: { contains: search, mode: "insensitive" as const } },
          { receiptCode: { contains: search, mode: "insensitive" as const } },
          { buyerPhone: { contains: search } },
          { items: { some: { imei: { contains: search } } } },
        ],
      }),
    };

    const [receipts, total] = await Promise.all([
      prisma.receipt.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            select: { name: true, imei: true, quantity: true, unitPrice: true },
          },
          _count: { select: { verifications: true } },
        },
      }),
      prisma.receipt.count({ where }),
    ]);

    return NextResponse.json({
      receipts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[LIST_RECEIPTS]", error);
    return NextResponse.json(
      { error: "Failed to fetch receipts." },
      { status: 500 },
    );
  }
}
