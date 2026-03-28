"use client";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Receipt = {
  id: string;
  receiptCode: string;
  buyerName: string;
  buyerPhone: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{ name: string; imei: string | null }>;
  _count: { verifications: number };
};

export default function ReceiptsPage() {
  const searchParams = useSearchParams();
  const issuedCode = searchParams.get("issued");

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/receipts")
      .then((r) => r.json())
      .then((data) => {
        setReceipts(data.receipts ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const searched = useMemo(() => {
    if (!search.trim()) return receipts;
    const q = search.toLowerCase();
    return receipts.filter(
      (r) =>
        r.buyerName.toLowerCase().includes(q) ||
        r.receiptCode.toLowerCase().includes(q) ||
        r.buyerPhone.includes(q) ||
        r.items.some(
          (i) => i.imei?.includes(q) || i.name.toLowerCase().includes(q),
        ),
    );
  }, [search, receipts]);

  const statusStyle: Record<string, React.CSSProperties> = {
    SENT: {
      background: "#f0fdf4",
      color: "#15803d",
      border: "1px solid #bbf7d0",
    },
    ISSUED: {
      background: "var(--teal-lt)",
      color: "var(--teal)",
      border: "1px solid var(--teal-bdr)",
    },
    PENDING: {
      background: "#fffbeb",
      color: "#b45309",
      border: "1px solid #fde68a",
    },
    FAILED: {
      background: "#fff0f3",
      color: "var(--red)",
      border: "1px solid #fda4af",
    },
  };

  return (
    <div style={s.page}>
      <div style={s.headRow}>
        <div>
          <h1 style={s.heading}>All Receipts</h1>
          <p style={s.sub}>{receipts.length} receipts issued</p>
        </div>
      </div>

      {issuedCode && (
        <div style={s.successBanner}>
          Receipt <strong>{issuedCode}</strong> issued successfully!
          <Link href={`/verify/${issuedCode}`} style={s.verifyLink}>
            Verify it →
          </Link>
        </div>
      )}

      <div style={s.searchWrap}>
        <svg
          style={s.searchIcon}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <circle
            cx="7"
            cy="7"
            r="4.5"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M10.5 10.5L14 14"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        <input
          style={s.searchInput}
          type="text"
          placeholder="Search by name, IMEI, receipt ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={s.empty}>Loading receipts...</div>
      ) : searched.length === 0 ? (
        <div style={s.empty}>
          {search
            ? "No receipts match your search."
            : "No receipts yet. Issue your first one!"}
        </div>
      ) : (
        searched.map((r) => (
          <div key={r.id} style={s.item}>
            <div style={s.itemIcon}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect
                  x="3"
                  y="1"
                  width="12"
                  height="16"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M6 6h6M6 9.5h4M6 13h3"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div style={s.itemBody}>
              <div style={s.itemName}>{r.buyerName}</div>
              <div
                style={{
                  ...s.itemSub,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "3px",
                }}
              >
                <span>
                  {r.items[0]?.name}
                  {r.items.length > 1 ? ` +${r.items.length - 1} more` : ""}
                </span>
                <span
                  style={{
                    width: "3px",
                    height: "3px",
                    borderRadius: "50%",
                    background: "#9db8b5",
                    flexShrink: 0,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontFamily: "DM Mono, monospace",
                    fontSize: "11px",
                    color: "#9db8b5",
                  }}
                >
                  {r.receiptCode}
                </span>
              </div>
              <span style={{ ...s.badge, ...statusStyle[r.status] }}>
                {r.status === "SENT"
                  ? "Sent"
                  : r.status === "ISSUED"
                    ? "Issued"
                    : r.status}
              </span>
              {r._count.verifications > 0 && (
                <span
                  style={{
                    ...s.badge,
                    ...statusStyle.ISSUED,
                    marginLeft: "6px",
                  }}
                >
                  {r._count.verifications}× verified
                </span>
              )}
            </div>
            <div style={s.itemRight}>
              <div style={s.itemAmt}>
                ₦{Math.round(r.total).toLocaleString()}
              </div>
              <div style={s.itemDate}>
                {new Date(r.createdAt).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                })}
              </div>
              <Link href={`/verify/${r.receiptCode}`} style={s.itemVerify}>
                Verify
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { maxWidth: "540px", margin: "0 auto", padding: "28px 18px 20px" },
  headRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: 700,
    color: "var(--ink)",
    letterSpacing: "-0.5px",
  },
  sub: { fontSize: "13.5px", color: "var(--ink2)", marginTop: "2px" },
  successBanner: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "13.5px",
    color: "#15803d",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  verifyLink: {
    color: "var(--teal)",
    fontWeight: 600,
    textDecoration: "none",
    fontSize: "13px",
  },
  searchWrap: { position: "relative", marginBottom: "16px" },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--ink3)",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    background: "#fff",
    border: "1px solid var(--border)",
    borderRadius: "9px",
    padding: "11px 13px 11px 40px",
    fontFamily: "inherit",
    fontSize: "14px",
    color: "var(--ink)",
    outline: "none",
  },
  empty: {
    textAlign: "center",
    padding: "40px 20px",
    fontSize: "14px",
    color: "var(--ink3)",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px 15px",
    background: "#fff",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    marginBottom: "16px",
    boxShadow: "0 1px 3px rgba(13,148,136,0.04)",
  },
  itemIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "var(--teal-lt)",
    border: "1px solid var(--teal-bdr)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    color: "var(--teal)",
  },
  itemBody: { flex: 1, minWidth: 0 },
  itemName: { fontSize: "14px", fontWeight: 600, color: "var(--ink)" },
  itemSub: {
    fontSize: "12px",
    color: "var(--ink2)",
    marginTop: "1px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: "10px",
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: "20px",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
    marginTop: "4px",
  },
  itemRight: { textAlign: "right", flexShrink: 0 },
  itemAmt: {
    fontFamily: "DM Mono, monospace",
    fontSize: "13px",
    fontWeight: 500,
    color: "var(--teal)",
  },
  itemDate: { fontSize: "11px", color: "var(--ink3)", marginTop: "2px" },
  itemVerify: {
    fontSize: "11px",
    color: "var(--teal)",
    fontWeight: 600,
    textDecoration: "none",
    marginTop: "4px",
    display: "block",
  },
};
