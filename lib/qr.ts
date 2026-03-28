// lib/qr.ts
import QRCode from "qrcode";

export async function generateQRCode(receiptCode: string): Promise<string> {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${receiptCode}`;

  const dataUrl = await QRCode.toDataURL(verifyUrl, {
    width: 200,
    margin: 2,
    color: {
      dark: "#0d9488",
      light: "#ffffff",
    },
    errorCorrectionLevel: "H",
  });

  return dataUrl;
}

export async function generateQRCodeSVG(receiptCode: string): Promise<string> {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${receiptCode}`;

  const svg = await QRCode.toString(verifyUrl, {
    type: "svg",
    width: 200,
    margin: 2,
    color: {
      dark: "#0d9488",
      light: "#ffffff",
    },
    errorCorrectionLevel: "H",
  });

  return svg;
}
