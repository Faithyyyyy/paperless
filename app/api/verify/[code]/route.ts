// // src/app/api/verify/[code]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { verifyReceiptHash } from "@/lib/hash";

// // This route is PUBLIC — no auth required
// // Anyone with the receipt code can verify authenticity (buyers, resellers, etc.)

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ code: string }> },
// ) {
//   const { code } = await params;
//   try {
//     const receipt = await prisma.receipt.findUnique({
//       where: { receiptCode: code.toUpperCase() },
//       include: {
//         items: true,
//         vendor: {
//           select: {
//             shopName: true,
//             address: true,
//             phone: true,
//             city: true,
//           },
//         },
//       },
//     });

//     if (!receipt) {
//       return NextResponse.json(
//         {
//           verified: false,
//           error: "Receipt not found. This code does not exist.",
//         },
//         { status: 404 },
//       );
//     }

//     // ── Re-compute hash from stored data and compare
//     const hashPayload = {
//       vendorId: receipt.vendorId,
//       buyerName: receipt.buyerName,
//       buyerPhone: receipt.buyerPhone,
//       items: receipt.items.map(
//         (i: {
//           name: string;
//           imei: string | null;
//           quantity: number;
//           unitPrice: number;
//         }) => ({
//           name: i.name,
//           imei: i.imei,
//           quantity: i.quantity,
//           unitPrice: i.unitPrice,
//         }),
//       ),
//       subtotal: receipt.subtotal,
//       vatRate: receipt.vatRate,
//       vatAmount: receipt.vatAmount,
//       total: receipt.total,
//       purchaseDate: receipt.purchaseDate.toISOString(),
//       nonce: receipt.nonce,
//     };
//     // Only log verification if not a prefetch
//     const isPrefetch =
//       req.headers.get("purpose") === "prefetch" ||
//       req.headers.get("next-router-prefetch") === "1";

//     if (!isPrefetch) {
//       await prisma.verification.create({
//         data: {
//           receiptId: receipt.id,
//           ipAddress:
//             req.headers.get("x-forwarded-for") ??
//             req.headers.get("x-real-ip") ??
//             null,
//           userAgent: req.headers.get("user-agent") ?? null,
//           purpose: req.nextUrl.searchParams.get("purpose") ?? null,
//         },
//       });
//     }

//     const isAuthentic = verifyReceiptHash(hashPayload, receipt.hash);

//     // ── Log this verification event
//     await prisma.verification.create({
//       data: {
//         receiptId: receipt.id,
//         ipAddress:
//           req.headers.get("x-forwarded-for") ??
//           req.headers.get("x-real-ip") ??
//           null,
//         userAgent: req.headers.get("user-agent") ?? null,
//         purpose: req.nextUrl.searchParams.get("purpose") ?? null,
//       },
//     });

//     if (!isAuthentic) {
//       return NextResponse.json(
//         {
//           verified: false,
//           error: "This receipt has been tampered with and cannot be trusted.",
//           receiptCode: receipt.receiptCode,
//         },
//         { status: 200 },
//       );
//     }

//     // ── Return the safe public fields only (no internal IDs)
//     return NextResponse.json({
//       verified: true,
//       receipt: {
//         receiptCode: receipt.receiptCode,
//         issuedAt: receipt.createdAt,
//         purchaseDate: receipt.purchaseDate,
//         vendor: {
//           name: receipt.vendor.shopName,
//           address: receipt.vendor.address,
//           phone: receipt.vendor.phone,
//           city: receipt.vendor.city,
//         },
//         buyer: {
//           name: receipt.buyerName,
//           // Phone is partially masked for privacy
//           phone: receipt.buyerPhone.replace(/(\d{4})(\d+)(\d{4})/, "$1****$3"),
//         },
//         items: receipt.items.map(
//           (item: {
//             name: string;
//             imei: string | null;
//             quantity: number;
//             unitPrice: number;
//             lineTotal: number;
//           }) => ({
//             name: item.name,
//             imei: item.imei,
//             quantity: item.quantity,
//             unitPrice: item.unitPrice,
//             lineTotal: item.lineTotal,
//           }),
//         ),
//         vatRate: receipt.vatRate,
//         subtotal: receipt.subtotal,
//         vatAmount: receipt.vatAmount,
//         total: receipt.total,
//         hash: receipt.hash,
//       },
//     });
//   } catch (error) {
//     console.error("[VERIFY_RECEIPT]", error);
//     return NextResponse.json(
//       { error: "Verification failed. Please try again." },
//       { status: 500 },
//     );
//   }
// }
// app/api/verify/[code]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyReceiptHash } from "@/lib/hash";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  try {
    const receipt = await prisma.receipt.findUnique({
      where: { receiptCode: code.toUpperCase() },
      include: {
        items: true,
        vendor: {
          select: { shopName: true, address: true, phone: true, city: true },
        },
      },
    });

    if (!receipt) {
      return NextResponse.json(
        {
          verified: false,
          error: "Receipt not found. This code does not exist.",
        },
        { status: 404 },
      );
    }

    const hashPayload = {
      vendorId: receipt.vendorId,
      buyerName: receipt.buyerName,
      buyerPhone: receipt.buyerPhone,
      items: receipt.items.map(
        (i: {
          name: string;
          imei: string | null;
          quantity: number;
          unitPrice: number;
        }) => ({
          name: i.name,
          imei: i.imei,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        }),
      ),
      subtotal: receipt.subtotal,
      vatRate: receipt.vatRate,
      vatAmount: receipt.vatAmount,
      total: receipt.total,
      purchaseDate: receipt.purchaseDate.toISOString(),
      nonce: receipt.nonce,
    };

    const isAuthentic = verifyReceiptHash(hashPayload, receipt.hash);

    // Only log if authentic and not a prefetch
    const isPrefetch =
      req.headers.get("purpose") === "prefetch" ||
      req.headers.get("next-router-prefetch") === "1";

    // if (isAuthentic && !isPrefetch) {
    //   await prisma.verification.create({
    //     data: {
    //       receiptId: receipt.id,
    //       ipAddress:
    //         req.headers.get("x-forwarded-for") ??
    //         req.headers.get("x-real-ip") ??
    //         null,
    //       userAgent: req.headers.get("user-agent") ?? null,
    //       purpose: req.nextUrl.searchParams.get("purpose") ?? null,
    //     },
    //   });
    // }
    if (isAuthentic && !isPrefetch) {
      const ipAddress =
        req.headers.get("x-forwarded-for") ??
        req.headers.get("x-real-ip") ??
        null;

      // Check if this IP already verified this receipt in the last 60 seconds
      const recentVerification = await prisma.verification.findFirst({
        where: {
          receiptId: receipt.id,
          ipAddress,
          verifiedAt: {
            gte: new Date(Date.now() - 60 * 1000),
          },
        },
      });

      if (!recentVerification) {
        await prisma.verification.create({
          data: {
            receiptId: receipt.id,
            ipAddress,
            userAgent: req.headers.get("user-agent") ?? null,
            purpose: req.nextUrl.searchParams.get("purpose") ?? null,
          },
        });
      }
    }

    if (!isAuthentic) {
      return NextResponse.json(
        {
          verified: false,
          error: "This receipt has been tampered with and cannot be trusted.",
          receiptCode: receipt.receiptCode,
        },
        { status: 200 },
      );
    }

    return NextResponse.json({
      verified: true,
      receipt: {
        receiptCode: receipt.receiptCode,
        issuedAt: receipt.createdAt,
        purchaseDate: receipt.purchaseDate,
        vendor: {
          name: receipt.vendor.shopName,
          address: receipt.vendor.address,
          phone: receipt.vendor.phone,
          city: receipt.vendor.city,
        },
        buyer: {
          name: receipt.buyerName,
          phone: receipt.buyerPhone.replace(/(\d{4})(\d+)(\d{4})/, "$1****$3"),
        },
        items: receipt.items.map(
          (item: {
            name: string;
            imei: string | null;
            quantity: number;
            unitPrice: number;
            lineTotal: number;
          }) => ({
            name: item.name,
            imei: item.imei,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
          }),
        ),
        vatRate: receipt.vatRate,
        subtotal: receipt.subtotal,
        vatAmount: receipt.vatAmount,
        total: receipt.total,
        hash: receipt.hash,
      },
    });
  } catch (error) {
    console.error("[VERIFY_RECEIPT]", error);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 },
    );
  }
}
