"use client";
// app/verify/page.tsx — standalone verify page (accessible from tab bar)
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function VerifyIndexPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = code.trim().toUpperCase();
    if (!cleaned) return;
    // If user pasted a full URL, extract just the code
    const match = cleaned.match(/RCT-\d{4}-[A-Z0-9]+/);
    router.push(`/verify/${match ? match[0] : cleaned}`);
  }

  return (
    <div style={s.page}>
      <Link
        href="/dashboard"
        className="border border-[var(--teal)] w-20 flex items-center justify-center rounded-2xl py-5 absolute "
        style={s.backBtn}
      >
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
      <div style={s.top}>
        <Link href="/" style={s.logoLink}>
          <Logo size={40} />
        </Link>
        <div style={s.brandName}>Paperless</div>
        <div style={s.brandTag}>Digital receipts, verified</div>
      </div>

      <div style={s.card}>
        <h1 style={s.heading}>Verify a Receipt</h1>
        <p style={s.sub}>Confirm any receipt is genuine — no account needed</p>

        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>Receipt ID or link</label>
            <input
              style={s.input}
              type="text"
              placeholder="RCT-2025-XXXXXX or paste full link"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={s.btn}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle
                cx="6.5"
                cy="6.5"
                r="4.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M10 10L13.5 13.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Verify Receipt
          </button>
        </form>
      </div>

      <div style={s.hint}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M7 6.5v3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="7" cy="4.5" r="0.6" fill="currentColor" />
        </svg>
        Anyone can verify a Paperless receipt — buyers, resellers, or anyone
        checking authenticity during a resale
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { maxWidth: "440px", margin: "0 auto", padding: "48px 18px 20px" },
  top: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    marginBottom: "32px",
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "13.5px",
    fontWeight: 600,
    color: "var(--teal)",
    textDecoration: "none",
  },
  brandName: {
    fontSize: "22px",
    fontWeight: 700,
    color: "var(--ink)",
    letterSpacing: "-0.4px",
  },
  brandTag: { fontSize: "13px", color: "var(--ink3)" },
  card: {
    background: "#fff",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "28px 24px",
    boxShadow: "0 4px 24px rgba(13,148,136,0.08)",
    marginBottom: "16px",
  },
  heading: {
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--ink)",
    letterSpacing: "-0.4px",
    marginBottom: "4px",
  },
  sub: { fontSize: "13.5px", color: "var(--ink2)", marginBottom: "22px" },
  field: { marginBottom: "12px" },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--ink2)",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    background: "var(--bg2)",
    border: "1.5px solid transparent",
    borderRadius: "9px",
    padding: "12px 13px",
    fontFamily: "inherit",
    fontSize: "15px",
    color: "var(--ink)",
    outline: "none",
  },
  btn: {
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  hint: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    fontSize: "12.5px",
    color: "var(--ink3)",
    lineHeight: 1.5,
  },
};
