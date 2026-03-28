// app/landing/page.tsx
// Single-section landing page for Paperless
// Place at app/landing/page.tsx and update app/page.tsx to redirect here for unauthenticated users

"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  return (
    <div style={s.root}>
      <div style={s.gridBg} aria-hidden="true" />
      <div style={s.blob} aria-hidden="true" />

      {/* NAV */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <div style={s.navLogo}>
            <div style={s.navLogoIcon}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect
                  x="2"
                  y="1"
                  width="9"
                  height="12"
                  rx="2"
                  fill="white"
                  opacity="0.25"
                />
                <rect
                  x="3.5"
                  y="2.5"
                  width="9"
                  height="12"
                  rx="2"
                  fill="white"
                  opacity="0.4"
                />
                <rect x="5" y="4" width="9" height="12" rx="2" fill="white" />
                <path
                  d="M7.5 7.5h4M7.5 10h3M7.5 12.5h3.5"
                  stroke="#0d9488"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <circle cx="14.5" cy="14.5" r="3.5" fill="#0d9488" />
                <path
                  d="M13 14.5l1.2 1.2L16 12.8"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span style={s.navLogoText}>Paperless</span>
          </div>
          <div style={s.navActions}>
            <Link href="/auth/login" style={s.navLogin}>
              Sign in
            </Link>
            <Link href="/auth/register" style={s.navCta}>
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <main style={s.main}>
        <div ref={heroRef} style={s.hero}>
          <div style={s.badge}>
            <div style={s.badgeDot} />
            Built for Nigerian gadget vendors
          </div>

          <h1 style={s.headline}>
            Every sale,
            <br />
            <span style={s.headlineAccent}>verified forever.</span>
          </h1>

          <p style={s.subline}>
            Issue tamper-proof digital receipts for phones and gadgets. Buyers
            verify authenticity during resale — no paperwork, no disputes.
          </p>

          <div style={s.ctaRow}>
            <Link href="/auth/register" style={s.ctaPrimary}>
              Start issuing receipts
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link href="/auth/login" style={s.ctaSecondary}>
              Sign in to dashboard
            </Link>
          </div>

          <p style={s.trustLine}>
            Free to start · No hardware needed · Works on any phone
          </p>

          {/* Mock receipt card */}
          <div style={s.cardWrap}>
            <div style={s.mockCard}>
              <div style={s.cardHead}>
                <div>
                  <div style={s.cardShop}>TechCorner Lagos</div>
                  <div style={s.cardShopSub}>Ikeja Computer Village</div>
                </div>
                <div style={s.cardVerifiedBadge}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <circle
                      cx="5.5"
                      cy="5.5"
                      r="5.5"
                      fill="white"
                      opacity="0.2"
                    />
                    <path
                      d="M3 5.5l1.8 1.8L8 3.5"
                      stroke="white"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Verified
                </div>
              </div>

              <div style={s.cardBody}>
                <div style={s.cardItem}>
                  <div>
                    <div style={s.cardItemName}>Samsung Galaxy S24 Ultra</div>
                    <div style={s.cardItemImei}>IMEI: 358934012345678</div>
                  </div>
                  <div style={s.cardItemPrice}>₦850,000</div>
                </div>

                <div style={s.cardDivider} />

                <div style={s.cardTotal}>
                  <span style={s.cardTotalLbl}>Total paid</span>
                  <span style={s.cardTotalAmt}>₦913,750</span>
                </div>

                <div style={s.cardQrRow}>
                  <div style={s.cardQrBox}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <rect
                        x="2"
                        y="2"
                        width="14"
                        height="14"
                        rx="2"
                        fill="#0d9488"
                      />
                      <rect
                        x="4"
                        y="4"
                        width="10"
                        height="10"
                        rx="1.5"
                        fill="white"
                      />
                      <rect
                        x="6"
                        y="6"
                        width="6"
                        height="6"
                        rx="1"
                        fill="#0d9488"
                      />
                      <rect
                        x="32"
                        y="2"
                        width="14"
                        height="14"
                        rx="2"
                        fill="#0d9488"
                      />
                      <rect
                        x="34"
                        y="4"
                        width="10"
                        height="10"
                        rx="1.5"
                        fill="white"
                      />
                      <rect
                        x="36"
                        y="6"
                        width="6"
                        height="6"
                        rx="1"
                        fill="#0d9488"
                      />
                      <rect
                        x="2"
                        y="32"
                        width="14"
                        height="14"
                        rx="2"
                        fill="#0d9488"
                      />
                      <rect
                        x="4"
                        y="34"
                        width="10"
                        height="10"
                        rx="1.5"
                        fill="white"
                      />
                      <rect
                        x="6"
                        y="36"
                        width="6"
                        height="6"
                        rx="1"
                        fill="#0d9488"
                      />
                      <rect
                        x="20"
                        y="2"
                        width="5"
                        height="5"
                        rx="1"
                        fill="#0d9488"
                      />
                      <rect
                        x="20"
                        y="9"
                        width="3"
                        height="3"
                        rx="0.5"
                        fill="#0d9488"
                      />
                      <rect
                        x="25"
                        y="9"
                        width="3"
                        height="3"
                        rx="0.5"
                        fill="#99f6e4"
                      />
                      <rect
                        x="32"
                        y="20"
                        width="5"
                        height="5"
                        rx="1"
                        fill="#0d9488"
                      />
                      <rect
                        x="39"
                        y="20"
                        width="3"
                        height="3"
                        rx="0.5"
                        fill="#0d9488"
                      />
                      <rect
                        x="20"
                        y="20"
                        width="3"
                        height="3"
                        rx="0.5"
                        fill="#99f6e4"
                      />
                      <rect
                        x="20"
                        y="26"
                        width="5"
                        height="5"
                        rx="1"
                        fill="#0d9488"
                      />
                      <rect
                        x="27"
                        y="32"
                        width="3"
                        height="3"
                        rx="0.5"
                        fill="#0d9488"
                      />
                      <rect
                        x="32"
                        y="32"
                        width="5"
                        height="5"
                        rx="1"
                        fill="#0d9488"
                      />
                      <rect
                        x="27"
                        y="38"
                        width="7"
                        height="3"
                        rx="0.5"
                        fill="#0d9488"
                      />
                      <rect
                        x="40"
                        y="38"
                        width="5"
                        height="5"
                        rx="1"
                        fill="#99f6e4"
                      />
                      <rect
                        x="40"
                        y="28"
                        width="3"
                        height="3"
                        rx="0.5"
                        fill="#0d9488"
                      />
                    </svg>
                  </div>
                  <div style={s.cardQrText}>
                    <div style={s.cardQrTitle}>Scan to verify</div>
                    <div style={s.cardQrUrl}>
                      paperless.ng/verify/RCT-2026-A7F3K2
                    </div>
                    <div style={s.cardSeal}>
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <circle cx="5" cy="5" r="5" fill="#0d9488" />
                        <path
                          d="M2.5 5l1.8 1.8L7.5 3.5"
                          stroke="white"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Cryptographically sealed
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                ...s.floatTag,
                bottom: "60px",
                left: "-16px",
                transform: "rotate(-2deg)",
              }}
              className="float-a"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="6" fill="#0d9488" />
                <path
                  d="M3 6l2 2 4-3"
                  stroke="white"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Receipt verified
            </div>

            <div
              style={{
                ...s.floatTag,
                top: "40px",
                right: "-16px",
                transform: "rotate(2deg)",
              }}
              className="float-b"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1l1.5 3 3.3.5-2.4 2.3.6 3.2L6 8.5 3 10.5l.6-3.2L1.2 5l3.3-.5z"
                  fill="#f59e0b"
                />
              </svg>
              Tamper-proof
            </div>
          </div>

          {/* Feature pills */}
          <div style={s.pills}>
            {[
              "SHA-256 hash verification",
              "QR code on every receipt",
              "PDF download",
              "Public verify page",
              "IMEI tracking",
            ].map((feat) => (
              <div key={feat} style={s.pill}>
                <div style={s.pillDot} />
                {feat}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer style={s.footer}>
        <span>© 2026 Paperless</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>Built for Computer Village vendors</span>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes floatA {
          0%,100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(-2deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0) rotate(2deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }
        .float-a { animation: floatA 4s ease-in-out infinite; }
        .float-b { animation: floatB 5s ease-in-out infinite 1s; }
        @media (max-width: 600px) {
          .hero-cta-row { flex-direction: column !important; }
          .hero-cta-row a { width: 100% !important; justify-content: center !important; }
        }
      `}</style>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "#ffffff",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    overflowX: "hidden",
    position: "relative",
  },
  gridBg: {
    position: "fixed",
    inset: 0,
    backgroundImage: `linear-gradient(rgba(13,148,136,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(13,148,136,0.04) 1px, transparent 1px)`,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
    zIndex: 0,
  },
  blob: {
    position: "fixed",
    top: "-20%",
    right: "-10%",
    width: "600px",
    height: "600px",
    background:
      "radial-gradient(circle, rgba(13,148,136,0.08) 0%, transparent 70%)",
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: 0,
  },
  nav: {
    position: "sticky",
    top: 0,
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(13,148,136,0.08)",
    zIndex: 50,
  },
  navInner: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "0 24px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navLogo: { display: "flex", alignItems: "center", gap: "9px" },
  navLogoIcon: {
    width: "32px",
    height: "32px",
    background: "#0d9488",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navLogoText: {
    fontSize: "17px",
    fontWeight: 700,
    color: "#0d1f1e",
    letterSpacing: "-0.3px",
  },
  navActions: { display: "flex", alignItems: "center", gap: "8px" },
  navLogin: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#5a7370",
    textDecoration: "none",
    padding: "7px 14px",
    borderRadius: "8px",
  },
  navCta: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#fff",
    textDecoration: "none",
    background: "#0d9488",
    padding: "8px 16px",
    borderRadius: "8px",
  },
  main: { position: "relative", zIndex: 1, padding: "0 24px" },
  hero: {
    maxWidth: "680px",
    margin: "0 auto",
    paddingTop: "72px",
    paddingBottom: "80px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    background: "#f0fdfa",
    border: "1px solid rgba(13,148,136,0.2)",
    borderRadius: "20px",
    padding: "6px 14px",
    fontSize: "12.5px",
    fontWeight: 500,
    color: "#0d9488",
    marginBottom: "28px",
  },
  badgeDot: {
    width: "6px",
    height: "6px",
    background: "#0d9488",
    borderRadius: "50%",
  },
  headline: {
    fontFamily: "'Instrument Serif', serif",
    fontSize: "58px",
    fontWeight: 400,
    lineHeight: 1.1,
    color: "#0d1f1e",
    letterSpacing: "-1.5px",
    marginBottom: "20px",
  },
  headlineAccent: { color: "#0d9488", fontStyle: "italic" },
  subline: {
    fontSize: "17px",
    lineHeight: 1.65,
    color: "#5a7370",
    maxWidth: "480px",
    marginBottom: "36px",
    fontWeight: 400,
  },
  ctaRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "16px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  ctaPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#0d9488",
    color: "#fff",
    textDecoration: "none",
    padding: "14px 24px",
    borderRadius: "12px",
    fontWeight: 700,
    fontSize: "15px",
  },
  ctaSecondary: {
    display: "inline-flex",
    alignItems: "center",
    background: "transparent",
    color: "#5a7370",
    textDecoration: "none",
    padding: "14px 24px",
    borderRadius: "12px",
    fontWeight: 500,
    fontSize: "15px",
    border: "1.5px solid rgba(13,148,136,0.2)",
  },
  trustLine: {
    fontSize: "12px",
    color: "#9db8b5",
    marginBottom: "52px",
    letterSpacing: "0.2px",
  },
  cardWrap: {
    position: "relative",
    width: "100%",
    maxWidth: "380px",
    marginBottom: "44px",
  },
  mockCard: {
    background: "#ffffff",
    border: "1px solid rgba(13,148,136,0.12)",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 8px 40px rgba(13,148,136,0.12), 0 2px 8px rgba(0,0,0,0.04)",
  },
  cardHead: {
    background: "#0d9488",
    padding: "18px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardShop: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#fff",
    marginBottom: "2px",
  },
  cardShopSub: { fontSize: "11px", color: "rgba(255,255,255,0.6)" },
  cardVerifiedBadge: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    background: "rgba(255,255,255,0.15)",
    borderRadius: "20px",
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: 600,
    color: "#fff",
  },
  cardBody: { padding: "16px 20px" },
  cardItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  cardItemName: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#0d1f1e",
    marginBottom: "3px",
  },
  cardItemImei: {
    fontSize: "10.5px",
    color: "#9db8b5",
    fontFamily: "'DM Mono', monospace",
  },
  cardItemPrice: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#0d1f1e",
    fontFamily: "'DM Mono', monospace",
    flexShrink: 0,
  },
  cardDivider: {
    height: "1px",
    background: "rgba(13,148,136,0.08)",
    margin: "12px 0",
  },
  cardTotal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  cardTotalLbl: { fontSize: "12px", color: "#9db8b5" },
  cardTotalAmt: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#0d9488",
    fontFamily: "'DM Mono', monospace",
  },
  cardQrRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#f0fdfa",
    borderRadius: "10px",
    padding: "12px",
    border: "1px solid rgba(13,148,136,0.12)",
  },
  cardQrBox: {
    flexShrink: 0,
    width: "56px",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardQrText: { flex: 1, minWidth: 0 },
  cardQrTitle: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#0d1f1e",
    marginBottom: "2px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  cardQrUrl: {
    fontSize: "9.5px",
    color: "#0d9488",
    fontFamily: "'DM Mono', monospace",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginBottom: "5px",
  },
  cardSeal: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "9.5px",
    color: "#9db8b5",
  },
  floatTag: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    background: "#fff",
    border: "1px solid rgba(13,148,136,0.15)",
    borderRadius: "20px",
    padding: "6px 12px",
    fontSize: "11.5px",
    fontWeight: 600,
    color: "#0d1f1e",
    boxShadow: "0 4px 16px rgba(13,148,136,0.10)",
    whiteSpace: "nowrap",
  },
  pills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: "center",
  },
  pill: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#f7fafa",
    border: "1px solid rgba(13,148,136,0.10)",
    borderRadius: "20px",
    padding: "6px 13px",
    fontSize: "12.5px",
    color: "#5a7370",
    fontWeight: 500,
  },
  pillDot: {
    width: "5px",
    height: "5px",
    background: "#0d9488",
    borderRadius: "50%",
  },
  footer: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    padding: "20px 24px 32px",
    fontSize: "12px",
    color: "#9db8b5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
};
