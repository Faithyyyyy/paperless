// "use client";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { useEffect, useRef } from "react";

// export default async function Home() {
//   const session = await getServerSession(authOptions);
//   if (session) redirect("/dashboard");
//   redirect("/landing");
// }
"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LandingPage() {
  const { status } = useSession();
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

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

  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;

    [left, right].forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = `translateY(${i === 0 ? "20px" : "28px"})`;
    });

    setTimeout(() => {
      if (left) {
        left.style.transition = "opacity 0.7s ease, transform 0.7s ease";
        left.style.opacity = "1";
        left.style.transform = "translateY(0)";
      }
    }, 100);

    setTimeout(() => {
      if (right) {
        right.style.transition = "opacity 0.7s ease, transform 0.7s ease";
        right.style.opacity = "1";
        right.style.transform = "translateY(0)";
      }
    }, 280);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
 
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
 
        @keyframes floatA {
          0%,100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-10px) rotate(-3deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0) rotate(3deg); }
          50% { transform: translateY(-7px) rotate(3deg); }
        }
        .tag-a { animation: floatA 4s ease-in-out infinite; }
        .tag-b { animation: floatB 5s ease-in-out infinite 1.2s; }
 
        .nav-login:hover { background: rgba(13,148,136,0.06) !important; }
        .cta-secondary:hover { background: rgba(13,148,136,0.05) !important; }
        .pill-item { transition: border-color 0.15s; }
        .pill-item:hover { border-color: rgba(13,148,136,0.3) !important; }
 
        /* Responsive */
        @media (max-width: 900px) {
          .page-grid {
            grid-template-columns: 1fr !important;
            padding-top: 48px !important;
            padding-bottom: 60px !important;
            gap: 48px !important;
          }
          .left-col {
            max-width: 100% !important;
            text-align: center !important;
            align-items: center !important;
          }
          .headline {
            font-size: 44px !important;
          }
          .cta-row {
            justify-content: center !important;
          }
          .right-col {
            max-width: 420px !important;
            margin: 0 auto !important;
          }
          .trust-row {
            justify-content: center !important;
          }
          .pills-row {
            justify-content: center !important;
          }
        }
 
        @media (max-width: 520px) {
          .headline {
            font-size: 36px !important;
            letter-spacing: -1px !important;
          }
          .subline {
            font-size: 15px !important;
          }
          .cta-row {
            flex-direction: column !important;
            width: 100% !important;
          }
          .cta-primary, .cta-secondary {
            width: 100% !important;
            justify-content: center !important;
          }
          .tag-a, .tag-b {
            display: none !important;
          }
        }
      `}</style>

      <div style={s.root}>
        {/* Grid background */}
        <div style={s.gridBg} aria-hidden />
        {/* Glow */}
        <div style={s.glow1} aria-hidden />
        <div style={s.glow2} aria-hidden />

        {/* ── NAV ── */}
        <nav style={s.nav}>
          <div style={s.navInner}>
            <div style={s.logo}>
              <div style={s.logoMark}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect
                    x="3"
                    y="1"
                    width="10"
                    height="14"
                    rx="2.5"
                    fill="white"
                    opacity="0.2"
                  />
                  <rect
                    x="4.5"
                    y="2.5"
                    width="10"
                    height="14"
                    rx="2.5"
                    fill="white"
                    opacity="0.35"
                  />
                  <rect
                    x="6"
                    y="4"
                    width="10"
                    height="14"
                    rx="2.5"
                    fill="white"
                  />
                  <path
                    d="M9 8h5M9 11h3.5M9 14h4"
                    stroke="#0d9488"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <circle cx="16" cy="16" r="4" fill="#0d9488" />
                  <path
                    d="M14.5 16l1.2 1.2L17.8 14.5"
                    stroke="white"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span style={s.logoText}>Paperless</span>
            </div>

            <div style={s.navRight}>
              {/* <Link href="/auth/login" style={s.navLogin} className="nav-login">
                Sign in
              </Link> */}
              <Link href="/auth/register" style={s.navCta}>
                Get started free
              </Link>
            </div>
          </div>
        </nav>

        {/* ── PAGE GRID ── */}
        <div style={s.pageWrap}>
          <div style={s.grid} className="page-grid">
            {/* LEFT COLUMN */}
            <div ref={leftRef} style={s.left} className="left-col">
              <div style={s.badge}>
                <span style={s.badgePulse} />
                Built for Nigerian gadget vendors
              </div>

              <h1 style={s.headline} className="headline">
                Every sale,
                <br />
                <em style={s.headlineEm}>verified forever.</em>
              </h1>

              <p style={s.subline} className="subline">
                Issue tamper-proof digital receipts for phones and gadgets.
                Buyers verify authenticity during resale — no paperwork, no
                disputes.
              </p>

              <div style={s.ctaRow} className="cta-row">
                <Link
                  href="/auth/register"
                  style={s.ctaPrimary}
                  className="cta-primary"
                >
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
                <Link
                  href="/auth/login"
                  style={s.ctaSecondary}
                  className="cta-secondary"
                >
                  Sign in
                </Link>
              </div>

              <div style={s.trustRow} className="trust-row">
                {[
                  "Free to start",
                  "No hardware needed",
                  "Works on any phone",
                ].map((t, i) => (
                  <div key={t} style={s.trustItem}>
                    {i > 0 && <span style={s.trustSep}>·</span>}
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <circle
                        cx="6.5"
                        cy="6.5"
                        r="6.5"
                        fill="#0d9488"
                        opacity="0.15"
                      />
                      <path
                        d="M4 6.5l1.8 1.8L9.5 4.5"
                        stroke="#0d9488"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span style={s.trustText}>{t}</span>
                  </div>
                ))}
              </div>

              <div style={s.pillsRow} className="pills-row">
                {[
                  "SHA-256 verification",
                  "QR code receipt",
                  "PDF export",
                  "IMEI tracking",
                  "Public verify link",
                ].map((f) => (
                  <span key={f} style={s.pill} className="pill-item">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div ref={rightRef} style={s.right} className="right-col">
              <div style={s.cardOuter}>
                {/* Floating tags */}
                <div style={s.tagA} className="tag-a">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="6" fill="#10b981" />
                    <path
                      d="M3 6l2 2 4-3"
                      stroke="white"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Receipt verified
                </div>
                <div style={s.tagB} className="tag-b">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 1l1.5 3 3.3.5-2.4 2.3.6 3.2L6 8.5 3 10.5l.6-3.2L1.2 5l3.3-.5z"
                      fill="#f59e0b"
                    />
                  </svg>
                  Tamper-proof
                </div>

                {/* Receipt card */}
                <div style={s.card}>
                  {/* Card header */}
                  <div style={s.cardHeader}>
                    <div style={s.cardHeaderLeft}>
                      <div style={s.cardShopName}>TechCorner Lagos</div>
                      <div style={s.cardShopSub}>
                        Ikeja Computer Village · Lagos
                      </div>
                      <div style={s.cardReceiptId}>
                        <div style={s.idDot} />
                        RCT-2026-A7F3K2
                      </div>
                    </div>
                    <div style={s.cardVerified}>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2.5 6l2 2L9.5 3.5"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Verified
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={s.cardBody}>
                    {/* Buyer */}
                    <div style={s.cardBuyer}>
                      <div style={s.buyerAvatar}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <circle
                            cx="7"
                            cy="4.5"
                            r="2.5"
                            stroke="#0d9488"
                            strokeWidth="1.3"
                          />
                          <path
                            d="M2 12c0-2.8 2.2-5 5-5s5 2.2 5 5"
                            stroke="#0d9488"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <div style={s.buyerName}>Chidi Okonkwo</div>
                        <div style={s.buyerPhone}>+234 801 ****5678</div>
                      </div>
                    </div>

                    {/* Item */}
                    <div style={s.cardItem}>
                      <div style={s.cardItemInfo}>
                        <div style={s.cardItemName}>
                          Samsung Galaxy S24 Ultra
                        </div>
                        <div style={s.cardItemImei}>IMEI: 358934012345678</div>
                      </div>
                      <div style={s.cardItemPrice}>₦850,000</div>
                    </div>

                    {/* Totals */}
                    <div style={s.cardTotals}>
                      <div style={s.cardTotalRow}>
                        <span style={s.totalLbl}>Subtotal</span>
                        <span style={s.totalVal}>₦850,000</span>
                      </div>
                      <div style={s.cardTotalRow}>
                        <span style={s.totalLbl}>VAT (7.5%)</span>
                        <span style={s.totalVal}>₦63,750</span>
                      </div>
                      <div style={s.cardGrandRow}>
                        <span style={s.grandLbl}>Total</span>
                        <span style={s.grandVal}>₦913,750</span>
                      </div>
                    </div>

                    {/* QR section */}
                    <div style={s.cardQr}>
                      <svg
                        width="60"
                        height="60"
                        viewBox="0 0 60 60"
                        fill="none"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="18"
                          height="18"
                          rx="2.5"
                          fill="#0d9488"
                        />
                        <rect
                          x="4.5"
                          y="4.5"
                          width="13"
                          height="13"
                          rx="2"
                          fill="white"
                        />
                        <rect
                          x="7"
                          y="7"
                          width="8"
                          height="8"
                          rx="1.5"
                          fill="#0d9488"
                        />
                        <rect
                          x="40"
                          y="2"
                          width="18"
                          height="18"
                          rx="2.5"
                          fill="#0d9488"
                        />
                        <rect
                          x="42.5"
                          y="4.5"
                          width="13"
                          height="13"
                          rx="2"
                          fill="white"
                        />
                        <rect
                          x="45"
                          y="7"
                          width="8"
                          height="8"
                          rx="1.5"
                          fill="#0d9488"
                        />
                        <rect
                          x="2"
                          y="40"
                          width="18"
                          height="18"
                          rx="2.5"
                          fill="#0d9488"
                        />
                        <rect
                          x="4.5"
                          y="42.5"
                          width="13"
                          height="13"
                          rx="2"
                          fill="white"
                        />
                        <rect
                          x="7"
                          y="45"
                          width="8"
                          height="8"
                          rx="1.5"
                          fill="#0d9488"
                        />
                        <rect
                          x="24"
                          y="2"
                          width="7"
                          height="7"
                          rx="1"
                          fill="#0d9488"
                        />
                        <rect
                          x="24"
                          y="12"
                          width="4"
                          height="4"
                          rx="0.5"
                          fill="#0d9488"
                        />
                        <rect
                          x="31"
                          y="12"
                          width="4"
                          height="4"
                          rx="0.5"
                          fill="#99f6e4"
                        />
                        <rect
                          x="40"
                          y="24"
                          width="7"
                          height="7"
                          rx="1"
                          fill="#0d9488"
                        />
                        <rect
                          x="50"
                          y="24"
                          width="4"
                          height="4"
                          rx="0.5"
                          fill="#0d9488"
                        />
                        <rect
                          x="24"
                          y="24"
                          width="4"
                          height="4"
                          rx="0.5"
                          fill="#99f6e4"
                        />
                        <rect
                          x="24"
                          y="32"
                          width="7"
                          height="7"
                          rx="1"
                          fill="#0d9488"
                        />
                        <rect
                          x="35"
                          y="40"
                          width="4"
                          height="4"
                          rx="0.5"
                          fill="#0d9488"
                        />
                        <rect
                          x="42"
                          y="40"
                          width="7"
                          height="7"
                          rx="1"
                          fill="#0d9488"
                        />
                        <rect
                          x="35"
                          y="48"
                          width="9"
                          height="4"
                          rx="0.5"
                          fill="#0d9488"
                        />
                        <rect
                          x="50"
                          y="48"
                          width="7"
                          height="7"
                          rx="1"
                          fill="#99f6e4"
                        />
                        <rect
                          x="50"
                          y="36"
                          width="4"
                          height="4"
                          rx="0.5"
                          fill="#0d9488"
                        />
                      </svg>
                      <div style={s.qrInfo}>
                        <div style={s.qrTitle}>Scan to verify authenticity</div>
                        <div style={s.qrUrl}>
                          paperless.ng/verify/RCT-2026-A7F3K2
                        </div>
                        <div style={s.qrSeal}>
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                          >
                            <circle cx="5" cy="5" r="5" fill="#0d9488" />
                            <path
                              d="M2.5 5l1.8 1.8L7.5 3.2"
                              stroke="white"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Cryptographically sealed · Paperless
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={s.footer}>
          <div style={s.footerInner}>
            <div style={s.footerLogo}>
              <div style={{ ...s.logoMark, width: "22px", height: "22px" }}>
                <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                  <rect
                    x="3"
                    y="1"
                    width="10"
                    height="14"
                    rx="2.5"
                    fill="white"
                    opacity="0.2"
                  />
                  <rect
                    x="4.5"
                    y="2.5"
                    width="10"
                    height="14"
                    rx="2.5"
                    fill="white"
                    opacity="0.35"
                  />
                  <rect
                    x="6"
                    y="4"
                    width="10"
                    height="14"
                    rx="2.5"
                    fill="white"
                  />
                  <path
                    d="M9 8h5M9 11h3.5M9 14h4"
                    stroke="#0d9488"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <circle cx="16" cy="16" r="4" fill="#0d9488" />
                  <path
                    d="M14.5 16l1.2 1.2L17.8 14.5"
                    stroke="white"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span style={s.footerLogoText}>Paperless</span>
            </div>
            <span style={s.footerText}>
              © 2026 · Built for Computer Village vendors
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "#fafffe",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  gridBg: {
    position: "fixed",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(13,148,136,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(13,148,136,0.035) 1px, transparent 1px)
    `,
    backgroundSize: "48px 48px",
    pointerEvents: "none",
    zIndex: 0,
  },
  glow1: {
    position: "fixed",
    top: "-200px",
    right: "-100px",
    width: "700px",
    height: "700px",
    background:
      "radial-gradient(circle, rgba(13,148,136,0.07) 0%, transparent 65%)",
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: 0,
  },
  glow2: {
    position: "fixed",
    bottom: "-200px",
    left: "-100px",
    width: "500px",
    height: "500px",
    background:
      "radial-gradient(circle, rgba(13,148,136,0.05) 0%, transparent 65%)",
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: 0,
  },

  // Nav
  nav: {
    position: "sticky",
    top: 0,
    background: "rgba(250,255,254,0.88)",
    backdropFilter: "blur(14px)",
    borderBottom: "1px solid rgba(13,148,136,0.07)",
    zIndex: 50,
  },
  navInner: {
    maxWidth: "1160px",
    margin: "0 auto",
    padding: "0 40px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { display: "flex", alignItems: "center", gap: "10px" },
  logoMark: {
    width: "34px",
    height: "34px",
    background: "#0d9488",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#0d1f1e",
    letterSpacing: "-0.3px",
  },
  navRight: { display: "flex", alignItems: "center", gap: "8px" },
  navLogin: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#5a7370",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "background 0.15s",
  },
  navCta: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#fff",
    textDecoration: "none",
    background: "#0d9488",
    padding: "9px 20px",
    borderRadius: "9px",
    letterSpacing: "-0.1px",
  },

  // Page layout
  pageWrap: {
    flex: 1,
    position: "relative",
    zIndex: 1,
    maxWidth: "1160px",
    margin: "0 auto",
    width: "100%",
    padding: "0 40px",
    overflow: "hidden",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "64px",
    alignItems: "center",
    paddingTop: "80px",
    paddingBottom: "80px",
    height: "100%",
  },

  // Left column
  left: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "0",
    maxWidth: "520px",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#f0fdfa",
    border: "1px solid rgba(13,148,136,0.18)",
    borderRadius: "20px",
    padding: "7px 16px",
    fontSize: "12.5px",
    fontWeight: 600,
    color: "#0d9488",
    marginBottom: "24px",
    letterSpacing: "-0.1px",
  },
  badgePulse: {
    display: "inline-block",
    width: "7px",
    height: "7px",
    background: "#0d9488",
    borderRadius: "50%",
    boxShadow: "0 0 0 0 rgba(13,148,136,0.4)",
    animation: "pulse 2s infinite",
  },
  headline: {
    fontFamily: "'Instrument Serif', serif",
    fontSize: "48px",
    fontWeight: 400,
    lineHeight: 1.08,
    color: "#0d1f1e",
    letterSpacing: "-1.5px",
    marginBottom: "18px",
  },
  headlineEm: {
    color: "#0d9488",
    fontStyle: "italic",
  },
  subline: {
    fontSize: "16px",
    lineHeight: 1.7,
    color: "#5a7370",
    marginBottom: "28px",
    fontWeight: 400,
    maxWidth: "440px",
  },
  ctaRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  ctaPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#0d9488",
    color: "#fff",
    textDecoration: "none",
    padding: "14px 26px",
    borderRadius: "12px",
    fontWeight: 700,
    fontSize: "15px",
    letterSpacing: "-0.1px",
    boxShadow: "0 4px 16px rgba(13,148,136,0.25)",
  },
  ctaSecondary: {
    display: "inline-flex",
    alignItems: "center",
    color: "#5a7370",
    textDecoration: "none",
    padding: "14px 24px",
    borderRadius: "12px",
    fontWeight: 500,
    fontSize: "15px",
    border: "1.5px solid rgba(13,148,136,0.18)",
    background: "transparent",
  },
  trustRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexWrap: "wrap",
    marginBottom: "22px",
  },
  trustItem: { display: "flex", alignItems: "center", gap: "5px" },
  trustSep: { fontSize: "13px", color: "#c5dedd", marginRight: "2px" },
  trustText: { fontSize: "12.5px", color: "#7a9e9b", fontWeight: 500 },
  pillsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "7px",
  },
  pill: {
    background: "#fff",
    border: "1px solid rgba(13,148,136,0.12)",
    borderRadius: "20px",
    padding: "5px 12px",
    fontSize: "12px",
    color: "#5a7370",
    fontWeight: 500,
    cursor: "default",
  },

  // Right column
  right: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cardOuter: { position: "relative", width: "100%", maxWidth: "400px" },

  // Floating tags
  tagA: {
    position: "absolute",
    top: "-16px",
    // top: "24px",
    left: "-28px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#fff",
    border: "1px solid rgba(13,148,136,0.14)",
    borderRadius: "20px",
    padding: "7px 14px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#0d1f1e",
    boxShadow: "0 4px 20px rgba(13,148,136,0.12)",
    whiteSpace: "nowrap",
    zIndex: 2,
  },
  tagB: {
    position: "absolute",
    bottom: "0px",
    right: "-28px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#fff",
    border: "1px solid rgba(13,148,136,0.14)",
    borderRadius: "20px",
    padding: "7px 14px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#0d1f1e",
    boxShadow: "0 4px 20px rgba(13,148,136,0.12)",
    whiteSpace: "nowrap",
    zIndex: 2,
  },

  // Receipt card
  card: {
    background: "#ffffff",
    border: "1px solid rgba(13,148,136,0.10)",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(13,148,136,0.12), 0 4px 16px rgba(0,0,0,0.04)",
  },
  cardHeader: {
    background: "#0d9488",
    padding: "22px 22px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardHeaderLeft: { flex: 1 },
  cardShopName: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#fff",
    marginBottom: "2px",
  },
  cardShopSub: { fontSize: "11.5px", color: "rgba(255,255,255,0.6)" },
  cardReceiptId: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    marginTop: "12px",
    background: "rgba(255,255,255,0.14)",
    borderRadius: "20px",
    padding: "4px 11px",
    fontFamily: "'DM Mono', monospace",
    fontSize: "10.5px",
    color: "rgba(255,255,255,0.9)",
  },
  idDot: {
    width: "5px",
    height: "5px",
    background: "#fff",
    borderRadius: "50%",
    opacity: 0.7,
  },
  cardVerified: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    background: "rgba(255,255,255,0.15)",
    borderRadius: "20px",
    padding: "5px 11px",
    fontSize: "11.5px",
    fontWeight: 600,
    color: "#fff",
    flexShrink: 0,
  },
  cardBody: { padding: "18px 22px" },
  cardBuyer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#f0fdfa",
    borderRadius: "9px",
    padding: "10px 12px",
    border: "1px solid rgba(13,148,136,0.10)",
    marginBottom: "14px",
  },
  buyerAvatar: {
    width: "30px",
    height: "30px",
    borderRadius: "7px",
    background: "rgba(13,148,136,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  buyerName: { fontSize: "13px", fontWeight: 600, color: "#0d1f1e" },
  buyerPhone: {
    fontSize: "11px",
    color: "#9db8b5",
    marginTop: "1px",
    fontFamily: "'DM Mono', monospace",
  },
  cardItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    paddingBottom: "14px",
    borderBottom: "1px dashed rgba(13,148,136,0.10)",
  },
  cardItemInfo: { flex: 1 },
  cardItemName: {
    fontSize: "13.5px",
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
    fontSize: "13.5px",
    fontWeight: 700,
    color: "#0d1f1e",
    fontFamily: "'DM Mono', monospace",
    flexShrink: 0,
  },
  cardTotals: {
    paddingTop: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "14px",
  },
  cardTotalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#9db8b5",
  },
  totalLbl: {},
  totalVal: { fontFamily: "'DM Mono', monospace" },
  cardGrandRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "16px",
    fontWeight: 700,
    borderTop: "1.5px solid #0d9488",
    paddingTop: "10px",
    marginTop: "2px",
  },
  grandLbl: { color: "#0d1f1e" },
  grandVal: { color: "#0d9488", fontFamily: "'DM Mono', monospace" },
  cardQr: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "#f0fdfa",
    borderRadius: "10px",
    padding: "14px",
    border: "1px solid rgba(13,148,136,0.10)",
  },
  qrInfo: { flex: 1, minWidth: 0 },
  qrTitle: {
    fontSize: "11.5px",
    fontWeight: 700,
    color: "#0d1f1e",
    marginBottom: "3px",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  qrUrl: {
    fontSize: "10px",
    color: "#0d9488",
    fontFamily: "'DM Mono', monospace",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginBottom: "6px",
  },
  qrSeal: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "10px",
    color: "#9db8b5",
  },

  // Footer
  footer: {
    position: "relative",
    zIndex: 1,
    borderTop: "1px solid rgba(13,148,136,0.07)",
    padding: "20px 40px",
  },
  footerInner: {
    maxWidth: "1160px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
  },
  footerLogo: { display: "flex", alignItems: "center", gap: "8px" },
  footerLogoText: { fontSize: "14px", fontWeight: 600, color: "#5a7370" },
  footerText: { fontSize: "12.5px", color: "#9db8b5" },
};
