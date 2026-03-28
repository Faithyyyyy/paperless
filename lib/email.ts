// src/lib/email.ts
import { Resend } from "resend";

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

interface SendReceiptEmailParams {
  receipt: {
    receiptCode: string;
    buyerName: string;
    buyerEmail: string | null;
    total: number;
    subtotal: number;
    vatRate: number;
    vatAmount: number;
    purchaseDate: Date;
    items: Array<{
      name: string;
      imei: string | null;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
    }>;
    vendor: {
      shopName: string;
      city: string | null;
      phone: string | null;
    };
  };
}

export async function sendReceiptEmail({ receipt }: SendReceiptEmailParams) {
  if (!receipt.buyerEmail) return;

  const resend = getResend();
  if (!resend) {
    console.log("[EMAIL] Skipping — no RESEND_API_KEY set");
    return;
  }

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${receipt.receiptCode}`;
  const formattedTotal = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(receipt.total);

  const itemsHtml = receipt.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">
          <strong>${item.name}</strong>
          ${item.imei ? `<br><small style="color:#999;">IMEI: ${item.imei}</small>` : ""}
        </td>
        <td style="padding:8px 0; border-bottom:1px solid #f0f0f0; text-align:center;">${item.quantity}</td>
        <td style="padding:8px 0; border-bottom:1px solid #f0f0f0; text-align:right; font-family:monospace;">
          ₦${item.unitPrice.toLocaleString()}
        </td>
      </tr>`,
    )
    .join("");

  const html = `
  <!DOCTYPE html>
  <html>
  <body style="font-family:'Helvetica Neue',sans-serif; background:#f5f5f5; margin:0; padding:20px;">
    <div style="max-width:560px; margin:0 auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">

      <div style="background:#0d9488; padding:28px 32px;">
        <h1 style="color:#fff; margin:0; font-size:22px; font-weight:700;">Paperless</h1>
        <p style="color:rgba(255,255,255,0.7); margin:4px 0 0; font-size:13px;">Your digital receipt</p>
      </div>

      <div style="padding:28px 32px;">
        <p style="font-size:15px; color:#333; margin:0 0 8px;">Hi ${receipt.buyerName},</p>
        <p style="font-size:14px; color:#666; margin:0 0 24px;">
          Here is your receipt from <strong>${receipt.vendor.shopName}</strong>.
          You can verify its authenticity at any time using the link below.
        </p>

        <div style="background:#f0fdfa; border:1px solid #99f6e4; border-radius:8px; padding:14px 18px; margin-bottom:24px;">
          <p style="margin:0; font-size:11px; color:#0d9488; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Receipt ID</p>
          <p style="margin:4px 0 0; font-family:monospace; font-size:16px; color:#0d1f1e; font-weight:600;">${receipt.receiptCode}</p>
        </div>

        <table style="width:100%; border-collapse:collapse; margin-bottom:16px;">
          <thead>
            <tr>
              <th style="text-align:left; font-size:11px; color:#999; text-transform:uppercase; padding-bottom:8px; border-bottom:2px solid #f0f0f0;">Item</th>
              <th style="text-align:center; font-size:11px; color:#999; text-transform:uppercase; padding-bottom:8px; border-bottom:2px solid #f0f0f0;">Qty</th>
              <th style="text-align:right; font-size:11px; color:#999; text-transform:uppercase; padding-bottom:8px; border-bottom:2px solid #f0f0f0;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div style="border-top:2px solid #0d9488; padding-top:12px; text-align:right;">
          ${
            receipt.vatRate > 0
              ? `
          <p style="margin:0 0 4px; font-size:13px; color:#666;">Subtotal: <span style="font-family:monospace;">₦${receipt.subtotal.toLocaleString()}</span></p>
          <p style="margin:0 0 8px; font-size:13px; color:#666;">VAT (${receipt.vatRate}%): <span style="font-family:monospace;">₦${receipt.vatAmount.toLocaleString()}</span></p>
          `
              : ""
          }
          <p style="margin:0; font-size:18px; font-weight:700; color:#0d9488;">Total: ${formattedTotal}</p>
        </div>

        <div style="margin-top:28px; padding-top:20px; border-top:1px solid #f0f0f0; text-align:center;">
          <p style="font-size:13px; color:#666; margin:0 0 14px;">Verify this receipt is authentic:</p>
          <a href="${verifyUrl}"
             style="display:inline-block; background:#0d9488; color:#fff; padding:12px 28px; border-radius:8px; text-decoration:none; font-weight:600; font-size:14px;">
            Verify Receipt
          </a>
          <p style="margin:12px 0 0; font-size:11px; color:#aaa; font-family:monospace;">${verifyUrl}</p>
        </div>
      </div>

      <div style="background:#f9f9f9; padding:16px 32px; text-align:center;">
        <p style="margin:0; font-size:12px; color:#aaa;">
          Issued by ${receipt.vendor.shopName}${receipt.vendor.city ? `, ${receipt.vendor.city}` : ""}
          ${receipt.vendor.phone ? ` · ${receipt.vendor.phone}` : ""}
        </p>
        <p style="margin:4px 0 0; font-size:11px; color:#ccc;">Powered by Paperless · paperless.ng</p>
      </div>

    </div>
  </body>
  </html>`;

  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: receipt.buyerEmail,
    subject: `Your receipt from ${receipt.vendor.shopName} — ${receipt.receiptCode}`,
    html,
  });
}
