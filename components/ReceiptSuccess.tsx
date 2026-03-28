"use client";
// components/ReceiptSuccess.tsx
import { useState } from "react";

interface Props {
  receiptCode: string;
  verifyUrl: string;
  deliveryMethod: string;
  deliveryError: string | null;
  buyerName: string;
  total: number;
  onClose: () => void;
  onNewReceipt: () => void;
}

export function ReceiptSuccess({
  receiptCode,
  verifyUrl,
  buyerName,
  total,
  onNewReceipt,
  onClose,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback for browsers that block clipboard
      const textarea = document.createElement("textarea");
      textarea.value = verifyUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div
      style={s.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={s.modal}>
        {/* Success icon */}
        <div style={s.iconWrap}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="#0d9488" opacity="0.10" />
            <circle cx="24" cy="24" r="18" fill="#0d9488" />
            <path
              d="M15 24l6.5 6.5L33 18"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 style={s.title}>Receipt issued!</h2>
        <p style={s.sub}>
          Share the link below with {buyerName} so they can view and verify
          their receipt.
        </p>

        {/* Receipt code + amount */}
        <div style={s.codeBox}>
          <div>
            <div style={s.codeLabel}>Receipt ID</div>
            <div style={s.code}>{receiptCode}</div>
          </div>
          <div style={s.amount}>₦{Math.round(total).toLocaleString()}</div>
        </div>

        {/* Verify link — the main thing to copy */}
        <div style={s.linkBox}>
          <div style={s.linkLabel}>
            Verification link — share this with the buyer
          </div>
          <div style={s.linkText}>{verifyUrl}</div>
          <button
            style={{ ...s.copyBtn, ...(copied ? s.copyBtnCopied : {}) }}
            onClick={copyLink}
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2.5 7l3 3 6-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect
                    x="5"
                    y="1"
                    width="8"
                    height="8"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M9 9v2.5A1.5 1.5 0 0 1 7.5 13H2.5A1.5 1.5 0 0 1 1 11.5v-5A1.5 1.5 0 0 1 2.5 5H5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
                Copy link
              </>
            )}
          </button>
        </div>

        <div style={s.hint}>
          Send this link via WhatsApp, SMS, or any messaging app. The buyer can
          open it to view their receipt and download a PDF.
        </div>

        {/* Actions */}
        <div style={s.actions}>
          <button style={s.btnPrimary} onClick={onNewReceipt}>
            Issue another receipt
          </button>
          <a
            href={verifyUrl}
            target="_blank"
            rel="noreferrer"
            style={s.btnGhost}
          >
            Preview receipt
          </a>
        </div>
        <div style={s.closeRow}>
          <button style={s.closeBtn} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 3l10 10M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(13,31,30,0.55)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    background: "#fff",
    borderRadius: "20px 20px 0 0",
    padding: "28px 24px 44px",
    width: "100%",
    maxWidth: "540px",
    boxShadow: "0 -8px 40px rgba(13,148,136,0.18)",
  },
  iconWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "16px",
  },
  title: {
    fontSize: "21px",
    fontWeight: 700,
    color: "var(--ink)",
    textAlign: "center",
    marginBottom: "6px",
    letterSpacing: "-0.3px",
  },
  sub: {
    fontSize: "13.5px",
    color: "var(--ink2)",
    textAlign: "center",
    marginBottom: "22px",
    lineHeight: 1.55,
  },
  codeBox: {
    background: "var(--teal-lt)",
    border: "1px solid var(--teal-bdr)",
    borderRadius: "12px",
    padding: "14px 16px",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  codeLabel: {
    fontSize: "10px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    color: "var(--ink3)",
    marginBottom: "4px",
  },
  code: {
    fontFamily: "DM Mono, monospace",
    fontSize: "15px",
    fontWeight: 500,
    color: "var(--teal)",
  },
  amount: {
    fontFamily: "DM Mono, monospace",
    fontSize: "18px",
    fontWeight: 700,
    color: "var(--ink)",
  },
  linkBox: {
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "14px 16px",
    marginBottom: "10px",
  },
  linkLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--ink2)",
    marginBottom: "8px",
  },
  linkText: {
    fontFamily: "DM Mono, monospace",
    fontSize: "11.5px",
    color: "var(--teal)",
    wordBreak: "break-all" as const,
    lineHeight: 1.5,
    marginBottom: "12px",
  },
  copyBtn: {
    width: "100%",
    padding: "12px",
    background: "var(--teal)",
    color: "#fff",
    border: "none",
    borderRadius: "9px",
    fontFamily: "inherit",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    transition: "background 0.2s",
  },
  copyBtnCopied: {
    background: "#15803d",
  },
  hint: {
    fontSize: "12px",
    color: "var(--ink3)",
    textAlign: "center" as const,
    lineHeight: 1.55,
    marginBottom: "18px",
  },
  actions: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  btnPrimary: {
    width: "100%",
    padding: "14px",
    background: "var(--teal)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontFamily: "inherit",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
  },
  btnGhost: {
    width: "100%",
    padding: "13px",
    background: "transparent",
    color: "var(--ink2)",
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: "var(--border2)",
    borderRadius: "12px",
    fontFamily: "inherit",
    fontWeight: 500,
    fontSize: "14px",
    cursor: "pointer",
    textAlign: "center" as const,
    textDecoration: "none",
    display: "block",
  },
};
