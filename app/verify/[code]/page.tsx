"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ReceiptPDF } from "@/lib/receipt-pdf";
import { pdf } from "@react-pdf/renderer";

type VerifyResult = {
  verified: boolean;
  error?: string;
  receipt?: {
    receiptCode: string;
    issuedAt: string;
    purchaseDate: string;
    vendor: {
      name: string;
      address: string | null;
      phone: string | null;
      city: string | null;
    };
    buyer: { name: string; phone: string };
    items: Array<{
      name: string;
      imei: string | null;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
    }>;
    vatRate: number;
    subtotal: number;
    vatAmount: number;
    total: number;
    hash: string;
  };
};

export default function VerifyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [qr, setQr] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    fetch(`/api/verify/${code}`)
      .then((r) => r.json())
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch(() => {
        setResult({ verified: false, error: "Verification request failed." });
        setLoading(false);
      });
  }, [code]);

  useEffect(() => {
    if (!code) return;
    fetch(`/api/verify/${code}/qr`)
      .then((r) => r.json())
      .then((data) => {
        if (data.qr) setQr(data.qr);
      })
      .catch(() => {});
  }, [code]);

  async function downloadPDF() {
    if (!result?.receipt) return;
    setDownloading(true);
    try {
      const blob = await pdf(
        <ReceiptPDF receipt={result.receipt} qrDataUrl={qr ?? undefined} />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${code}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("PDF downloaded successfully");
    } catch (err) {
      console.error(err);
      showToast("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  function shareReceipt() {
    const url = `${window.location.origin}/verify/${code}`;
    if (navigator.share) {
      navigator
        .share({
          title: `Receipt ${code}`,
          text: `Verify my receipt from ${result?.receipt?.vendor.name}`,
          url,
        })
        .catch(() => {}); // silently ignore cancel/abort
    } else {
      navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard!");
    }
  }

  function fmt(n: number) {
    return "₦" + Math.round(n).toLocaleString();
  }

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <Link href="/dashboard" style={s.backBtn}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 3L5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </Link>
        <div style={s.logoLink}>
          <Logo size={28} />
          <span style={s.logoText}>Paperless</span>
        </div>
        <span style={s.publicTag}>Public</span>
      </div>

      {loading && (
        <div style={s.loadingCard}>
          <div style={s.loadingText}>Verifying receipt...</div>
        </div>
      )}

      {!loading && result && !result.verified && (
        <div style={s.failCard}>
          <div style={s.failIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M8 8l8 8M16 8l-8 8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div style={s.failTitle}>Receipt not verified</div>
          <div style={s.failSub}>
            {result.error ?? "This receipt could not be verified."}
          </div>
        </div>
      )}

      {!loading && result?.verified && result.receipt && (
        <>
          <div style={s.authBanner}>
            <div style={s.authIcon}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8l3.5 3.5L13 4"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <div style={s.authTitle}>Receipt is authentic</div>
              <div style={s.authSub}>
                Unmodified since issue · Hash verified
              </div>
            </div>
          </div>

          {/* ── ACTION BUTTONS ── */}
          <div style={s.actionRow}>
            <button
              style={s.downloadBtn}
              onClick={downloadPDF}
              disabled={downloading}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M7.5 1v9M4 7l3.5 3.5L11 7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12h11"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              {downloading ? "Generating..." : "Download PDF"}
            </button>
            <button style={s.shareBtn} onClick={shareReceipt}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle
                  cx="12"
                  cy="2.5"
                  r="1.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <circle
                  cx="12"
                  cy="12.5"
                  r="1.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <circle
                  cx="3"
                  cy="7.5"
                  r="1.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M4.5 8.3l6 3.4M4.5 6.7l6-3.4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              Share
            </button>
          </div>

          <div style={s.receiptCard}>
            <div style={s.receiptHead}>
              <div style={s.shopName}>{result.receipt.vendor.name}</div>
              <div style={s.shopSub}>
                {[result.receipt.vendor.city, result.receipt.vendor.address]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
              <div style={s.receiptId}>
                <div style={s.idDot}></div>
                {result.receipt.receiptCode}
              </div>
            </div>

            <div style={s.receiptBody}>
              <div style={s.metaRow}>
                <span>
                  {new Date(result.receipt.purchaseDate).toLocaleDateString(
                    "en-NG",
                    { day: "numeric", month: "long", year: "numeric" },
                  )}
                </span>
                <span>WAT</span>
              </div>

              <div style={s.buyerRow}>
                <div style={s.buyerIcon}>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <circle
                      cx="7.5"
                      cy="5"
                      r="2.5"
                      stroke="currentColor"
                      strokeWidth="1.35"
                    />
                    <path
                      d="M2 13c0-3 2.5-5 5.5-5s5.5 2 5.5 5"
                      stroke="currentColor"
                      strokeWidth="1.35"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <div style={s.buyerName}>{result.receipt.buyer.name}</div>
                  <div style={s.buyerPhone}>{result.receipt.buyer.phone}</div>
                </div>
              </div>

              {result.receipt.items.map((item, i) => (
                <div key={i} style={s.itemRow}>
                  <div>
                    <div style={s.itemName}>{item.name}</div>
                    {item.imei && (
                      <div style={s.itemImei}>
                        IMEI: {item.imei} · Qty: {item.quantity}
                      </div>
                    )}
                  </div>
                  <div style={s.itemPrice}>{fmt(item.lineTotal)}</div>
                </div>
              ))}

              <div style={s.totals}>
                <div style={s.trow}>
                  <span>Subtotal</span>
                  <span>{fmt(result.receipt.subtotal)}</span>
                </div>
                {result.receipt.vatRate > 0 && (
                  <div style={s.trow}>
                    <span>VAT ({result.receipt.vatRate}%)</span>
                    <span>{fmt(result.receipt.vatAmount)}</span>
                  </div>
                )}
                <div style={{ ...s.trow, ...s.trowGrand }}>
                  <span>Total</span>
                  <span style={{ color: "var(--teal)" }}>
                    {fmt(result.receipt.total)}
                  </span>
                </div>
              </div>

              <div style={s.qrSection}>
                <div style={s.qrLabel}>Scan to verify authenticity</div>
                {qr ? (
                  <img src={qr} alt="Verify QR Code" style={s.qrImage} />
                ) : (
                  <div style={s.qrPlaceholder}>Loading QR...</div>
                )}
                <div style={s.qrLink}>
                  {`${process.env.NEXT_PUBLIC_APP_URL}/verify/${result.receipt.receiptCode}`}
                </div>
                <div style={s.seal}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" fill="#0d9488" />
                    <path
                      d="M3.5 6l1.8 1.8L8.5 4"
                      stroke="white"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Cryptographically sealed · Paperless
                </div>
              </div>

              <div style={s.tamper}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  style={{ flexShrink: 0, color: "var(--teal)" }}
                >
                  <path
                    d="M10 2l7.5 3.5V11c0 4-3.5 7-7.5 8-4-1-7.5-4-7.5-8V5.5L10 2Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 10l2.5 2.5L14 7"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <div style={s.tamperTitle}>Tamper-proof certificate</div>
                  <div style={s.tamperSub}>
                    Issued{" "}
                    {new Date(result.receipt.issuedAt).toLocaleDateString()} ·
                    Never modified · Vendor verified
                  </div>
                  <div
                    style={{
                      ...s.tamperSub,
                      marginTop: "4px",
                      fontFamily: "DM Mono, monospace",
                      fontSize: "10px",
                      wordBreak: "break-all",
                    }}
                  >
                    {result.receipt.hash.slice(0, 32)}...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div style={s.footer}>
        <span>Powered by </span>
        <Link
          href="/"
          style={{
            color: "var(--teal)",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Paperless
        </Link>
      </div>
      {toast && <div style={s.toast}>{toast}</div>}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { maxWidth: "520px", margin: "0 auto", padding: "24px 18px 60px" },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "13.5px",
    fontWeight: 600,
    color: "var(--teal)",
    textDecoration: "none",
    minWidth: "60px",
  },
  logoLink: { display: "flex", alignItems: "center", gap: "8px" },
  logoText: { fontSize: "16px", fontWeight: 700, color: "var(--ink)" },
  publicTag: {
    fontSize: "11px",
    color: "var(--ink3)",
    background: "var(--bg2)",
    padding: "4px 10px",
    borderRadius: "20px",
    border: "1px solid var(--border)",
    minWidth: "60px",
    textAlign: "center",
  },
  loadingCard: {
    background: "#fff",
    borderRadius: "14px",
    border: "1px solid var(--border)",
    padding: "40px",
    textAlign: "center",
  },
  loadingText: { fontSize: "14px", color: "var(--ink2)" },
  failCard: {
    background: "#fff0f3",
    border: "1px solid #fda4af",
    borderRadius: "14px",
    padding: "32px",
    textAlign: "center",
  },
  failIcon: {
    color: "var(--red)",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "center",
  },
  failTitle: {
    fontSize: "17px",
    fontWeight: 700,
    color: "var(--red)",
    marginBottom: "6px",
  },
  failSub: { fontSize: "13.5px", color: "#9a2040" },
  authBanner: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "12px",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
  },
  authIcon: {
    width: "32px",
    height: "32px",
    background: "#15803d",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  authTitle: { fontSize: "13.5px", fontWeight: 700, color: "#14532d" },
  authSub: { fontSize: "12px", color: "#15803d", marginTop: "2px" },
  actionRow: { display: "flex", gap: "8px", marginBottom: "16px" },
  downloadBtn: {
    flex: 1,
    padding: "12px",
    background: "var(--teal)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontFamily: "inherit",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
  },
  shareBtn: {
    padding: "12px 18px",
    background: "transparent",
    color: "var(--ink2)",
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: "var(--border2)",
    borderRadius: "10px",
    fontFamily: "inherit",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },
  receiptCard: {
    background: "#fff",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 4px 24px rgba(13,148,136,0.10)",
  },
  receiptHead: {
    background: "var(--teal)",
    padding: "22px 20px 18px",
    color: "#fff",
  },
  shopName: { fontSize: "17px", fontWeight: 700, marginBottom: "2px" },
  shopSub: { fontSize: "12px", opacity: 0.65 },
  receiptId: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    marginTop: "14px",
    background: "rgba(255,255,255,0.15)",
    borderRadius: "20px",
    padding: "4px 11px",
    fontFamily: "DM Mono, monospace",
    fontSize: "10.5px",
  },
  idDot: {
    width: "5px",
    height: "5px",
    background: "#fff",
    borderRadius: "50%",
    opacity: 0.7,
  },
  receiptBody: { padding: "16px 20px" },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11.5px",
    color: "var(--ink3)",
    marginBottom: "14px",
  },
  buyerRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    background: "var(--teal-lt)",
    border: "1px solid var(--teal-bdr)",
    borderRadius: "9px",
    marginBottom: "14px",
  },
  buyerIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "7px",
    background: "var(--teal-md)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    color: "var(--teal)",
  },
  buyerName: { fontSize: "13px", fontWeight: 600 },
  buyerPhone: { fontSize: "11.5px", color: "var(--ink2)", marginTop: "1px" },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "8px 0",
    borderBottom: "1px dashed var(--border)",
    gap: "10px",
  },
  itemName: { fontSize: "12.5px", fontWeight: 600 },
  itemImei: { fontSize: "11px", color: "var(--ink3)", marginTop: "2px" },
  itemPrice: {
    fontFamily: "DM Mono, monospace",
    fontSize: "12px",
    flexShrink: 0,
  },
  totals: {
    paddingTop: "10px",
    borderTop: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    marginTop: "10px",
  },
  trow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "var(--ink2)",
    fontFamily: "DM Mono, monospace",
  },
  trowGrand: {
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--ink)",
    borderTop: "1.5px solid var(--teal-bdr)",
    paddingTop: "8px",
    marginTop: "4px",
    fontFamily: "inherit",
  },
  qrSection: {
    borderTop: "1px dashed var(--border)",
    marginTop: "14px",
    paddingTop: "18px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "9px",
  },
  qrLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--ink3)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  qrImage: {
    width: "140px",
    height: "140px",
    borderRadius: "12px",
    border: "1px solid var(--teal-bdr)",
    padding: "8px",
    background: "#fff",
  },
  qrPlaceholder: {
    width: "140px",
    height: "140px",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    color: "var(--ink3)",
  },
  qrLink: {
    fontFamily: "DM Mono, monospace",
    fontSize: "10px",
    color: "var(--teal)",
    background: "var(--teal-lt)",
    padding: "4px 12px",
    borderRadius: "20px",
    border: "1px solid var(--teal-bdr)",
    wordBreak: "break-all",
    textAlign: "center",
  },
  seal: {
    fontSize: "10.5px",
    color: "var(--ink3)",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  tamper: {
    background: "var(--teal-lt)",
    border: "1px solid var(--teal-bdr)",
    borderRadius: "9px",
    padding: "12px 14px",
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginTop: "14px",
  },
  tamperTitle: { fontSize: "12.5px", fontWeight: 600, color: "var(--teal)" },
  tamperSub: { fontSize: "11px", color: "var(--ink2)", marginTop: "2px" },
  footer: {
    textAlign: "center",
    fontSize: "12px",
    color: "var(--ink3)",
    marginTop: "32px",
  },
  toast: {
    position: "fixed",
    bottom: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "var(--ink)",
    color: "#fff",
    padding: "11px 20px",
    borderRadius: "40px",
    fontSize: "13.5px",
    fontWeight: 500,
    whiteSpace: "nowrap",
    zIndex: 100,
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  },
};
