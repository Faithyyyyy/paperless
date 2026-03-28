// // src/lib/hash.ts
// import crypto from "crypto";

// interface HashPayload {
//   vendorId: string;
//   buyerName: string;
//   buyerPhone: string;
//   items: Array<{
//     name: string;
//     imei?: string | null;
//     quantity: number;
//     unitPrice: number;
//   }>;
//   subtotal: number;
//   vatRate: number;
//   vatAmount: number;
//   total: number;
//   purchaseDate: string;
//   nonce: string;
// }

// /**
//  * Generates a deterministic SHA-256 hash from receipt data.
//  * If any field is changed after issuance, the hash will not match — tamper-proof.
//  */
// export function generateReceiptHash(payload: HashPayload): string {
//   // Sort items by name so order doesn't affect the hash
//   const normalized = {
//     ...payload,
//     items: [...payload.items].sort((a, b) => a.name.localeCompare(b.name)),
//     subtotal: Number(payload.subtotal.toFixed(2)),
//     vatAmount: Number(payload.vatAmount.toFixed(2)),
//     total: Number(payload.total.toFixed(2)),
//   };

//   const json = JSON.stringify(normalized);
//   return crypto.createHash("sha256").update(json).digest("hex");
// }

// /**
//  * Generates a short human-readable receipt code like RCT-2025-A7F3K2
//  */
// export function generateReceiptCode(): string {
//   const year = new Date().getFullYear();
//   const random = crypto.randomBytes(3).toString("hex").toUpperCase();
//   return `RCT-${year}-${random}`;
// }
// export function generateNonce(): string {
//   return crypto.randomBytes(16).toString("hex");
// }

// /**
//  * Verify that a receipt's stored hash still matches its data.
//  * Returns true if the receipt has not been tampered with.
//  */
// export function verifyReceiptHash(
//   payload: HashPayload,
//   storedHash: string,
// ): boolean {
//   const computed = generateReceiptHash(payload);
//   return crypto.timingSafeEqual(
//     Buffer.from(computed, "hex"),
//     Buffer.from(storedHash, "hex"),
//   );
// }
import crypto from "crypto";

interface HashPayload {
  vendorId: string;
  buyerName: string;
  buyerPhone: string;
  items: Array<{
    name: string;
    imei?: string | null;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  purchaseDate: string;
  nonce: string; // ← add this
}

export function generateReceiptHash(payload: HashPayload): string {
  const normalized = {
    ...payload,
    items: [...payload.items].sort((a, b) => a.name.localeCompare(b.name)),
    subtotal: Number(payload.subtotal.toFixed(2)),
    vatAmount: Number(payload.vatAmount.toFixed(2)),
    total: Number(payload.total.toFixed(2)),
  };

  const json = JSON.stringify(normalized);
  return crypto.createHash("sha256").update(json).digest("hex");
}

export function generateReceiptCode(): string {
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `RCT-${year}-${random}`;
}

// ← add this
export function generateNonce(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function verifyReceiptHash(
  payload: HashPayload,
  storedHash: string,
): boolean {
  const computed = generateReceiptHash(payload);
  return crypto.timingSafeEqual(
    Buffer.from(computed, "hex"),
    Buffer.from(storedHash, "hex"),
  );
}
