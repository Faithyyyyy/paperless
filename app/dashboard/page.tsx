"use client";
// app/dashboard/page.tsx  (Issue Receipt — default dashboard page)
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useSession } from "next-auth/react";
import { ReceiptSuccess } from "@/components/ReceiptSuccess";

type Item = {
  name: string;
  imei: string;
  quantity: number;
  unitPrice: number;
};

const DELIVERY_OPTIONS = [
  { value: "LINK", label: "Link only", sub: "Copy & share", ready: true },
  { value: "WHATSAPP", label: "WhatsApp", sub: "Coming soon", ready: false },
  { value: "EMAIL", label: "Email", sub: "Coming soon", ready: false },
  { value: "SMS", label: "SMS", sub: "Coming soon", ready: false },
];

export default function IssuePage() {
  const { data: session } = useSession();

  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [stats, setStats] = useState({ issued: 0, secured: 0, verified: 0 });

  useEffect(() => {
    fetch("/api/receipts/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats({
          issued: data.issued ?? 0,
          secured: data.secured ?? 0,
          verified: data.verified ?? 0,
        });
      })
      .catch(() => {});
  }, []);

  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [vatRate, setVatRate] = useState(7.5);
  const [delivery, setDelivery] = useState("LINK");
  const [items, setItems] = useState<Item[]>([
    { name: "", imei: "", quantity: 1, unitPrice: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    receiptCode: string;
    verifyUrl: string;
    deliveryMethod: string;
    deliveryError: string | null;
    total: number;
  } | null>(null);
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const vatAmount = subtotal * (vatRate / 100);
  const total = subtotal + vatAmount;

  function fmt(n: number) {
    return "₦" + Math.round(n).toLocaleString();
  }

  function updateItem(
    index: number,
    field: keyof Item,
    value: string | number,
  ) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      { name: "", imei: "", quantity: 1, unitPrice: 0 },
    ]);
  }

  function removeItem(index: number) {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  }
  function resetForm() {
    setBuyerName("");
    setBuyerPhone("");
    setBuyerEmail("");
    setPurchaseDate(new Date().toISOString().split("T")[0]);
    setVatRate(7.5);
    setDelivery("LINK");
    setItems([{ name: "", imei: "", quantity: 1, unitPrice: 0 }]);
    setSuccess(null);
    setError("");
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (items.some((i) => !i.name || i.unitPrice <= 0)) {
      setError("Please fill in all item names and prices");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName,
          buyerPhone,
          buyerEmail: buyerEmail || null,
          vatRate,
          deliveryMethod: delivery,
          purchaseDate: new Date(purchaseDate).toISOString(),
          items: items.map((i) => ({
            name: i.name,
            imei: i.imei || null,
            quantity: Number(i.quantity),
            unitPrice: Number(i.unitPrice),
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to issue receipt");
        setLoading(false);
        return;
      }

      setSuccess({
        receiptCode: data.receipt.receiptCode,
        verifyUrl: data.receipt.verifyUrl,
        deliveryMethod: data.receipt.deliveryMethod,
        deliveryError: data.receipt.deliveryError ?? null,
        total: data.receipt.total,
      });
      setLoading(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      {/* Brand header */}
      <div style={s.header}>
        <div style={s.brand}>
          <Logo size={40} />
          <div>
            <div style={s.brandName}>Paperless</div>
            <div style={s.brandTag} className="uppercase">
              {session?.user?.shopName ?? "Digital receipts"}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {/* <div style={s.statsGrid}>
        <div style={s.statBox}>
          <div style={s.statNum}>{stats.issued}</div>
          <div style={s.statLbl}>Issued</div>
        </div>

        <div style={s.statBox}>
          <div style={s.statNum}>
            {stats.issued > 0
              ? `₦${(stats.issued * 500).toLocaleString()}`
              : "—"}
          </div>
          <div style={s.statLbl}>Secured</div>
        </div>

        <div style={s.statBox}>
          <div style={s.statNum}>{stats.verified}</div>
          <div style={s.statLbl}>Verified</div>
        </div>
      </div> */}
      <div style={s.statsGrid}>
        <div style={s.statBox}>
          <div style={s.statNum}>{stats.issued}</div>
          <div style={s.statLbl}>Issued</div>
        </div>
        <div style={s.statBox}>
          <div style={s.statNum}>
            {stats.secured > 0
              ? `₦${Math.round(stats.secured).toLocaleString()}`
              : "₦0"}
          </div>
          <div style={s.statLbl}>Secured</div>
        </div>
        <div style={s.statBox}>
          <div style={s.statNum}>{stats.verified}</div>
          <div style={s.statLbl}>Verified</div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {error && <div style={s.errorBanner}>{error}</div>}

        {/* Buyer details */}
        <div style={s.sectionLabel}>Buyer details</div>
        <div style={s.card}>
          <div style={s.field}>
            <label style={s.label}>Full name</label>
            <input
              style={s.input}
              type="text"
              placeholder="e.g. Chidi Okonkwo"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              required
            />
          </div>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Phone number</label>
              <input
                style={s.input}
                type="tel"
                placeholder="+234 801 000 0000"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                required
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Date</label>
              <input
                style={s.input}
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>
          </div>
          <div style={s.field}>
            <label style={s.label}>Email (optional — for email delivery)</label>
            <input
              style={s.input}
              type="email"
              placeholder="buyer@example.com"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Items */}
        <div style={s.sectionLabel}>Items sold</div>
        <div style={s.card}>
          {items.map((item, index) => (
            <div key={index} style={s.itemRow}>
              <div style={s.itemFields}>
                <input
                  style={s.input}
                  type="text"
                  placeholder="Device name"
                  value={item.name}
                  onChange={(e) => updateItem(index, "name", e.target.value)}
                  required
                />
                <input
                  style={{
                    ...s.input,
                    fontFamily: "DM Mono, monospace",
                    fontSize: "13px",
                  }}
                  type="text"
                  placeholder="IMEI or Serial No."
                  value={item.imei}
                  onChange={(e) => updateItem(index, "imei", e.target.value)}
                />
                <div style={s.itemSubRow}>
                  <input
                    style={s.input}
                    type="number"
                    placeholder="Qty"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", Number(e.target.value))
                    }
                  />
                  <input
                    style={s.input}
                    type="number"
                    placeholder="Unit price (₦)"
                    min={0}
                    value={item.unitPrice || ""}
                    onChange={(e) =>
                      updateItem(index, "unitPrice", Number(e.target.value))
                    }
                  />
                </div>
              </div>
              <button
                type="button"
                style={s.rmBtn}
                onClick={() => removeItem(index)}
              >
                −
              </button>
            </div>
          ))}

          <button type="button" style={s.addItemBtn} onClick={addItem}>
            + Add item
          </button>

          {/* VAT */}
          <div style={s.vatSection}>
            <div style={s.vatHeader}>
              <label style={s.label}>VAT rate</label>
              <div style={s.vatPresets}>
                {[0, 7.5, 10].map((v) => (
                  <button
                    key={v}
                    type="button"
                    style={{
                      ...s.vatPreset,
                      ...(vatRate === v ? s.vatPresetActive : {}),
                    }}
                    onClick={() => setVatRate(v)}
                  >
                    {v}%
                  </button>
                ))}
              </div>
            </div>
            <div style={s.vatWrap}>
              <input
                style={s.vatInput}
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={vatRate}
                onChange={(e) => setVatRate(Number(e.target.value))}
              />
              <span style={s.vatSuffix}>%</span>
            </div>
            <div style={s.vatHint}>
              Set to 0% if VAT doesn&apos;t apply to this sale
            </div>
          </div>

          {/* Totals */}
          <div style={s.totals}>
            <div style={s.trow}>
              <span>Subtotal</span>
              <span style={s.mono}>{fmt(subtotal)}</span>
            </div>
            {vatRate > 0 && (
              <div style={s.trow}>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  VAT <span style={s.vatBadge}>{vatRate}%</span>
                </span>
                <span style={s.mono}>{fmt(vatAmount)}</span>
              </div>
            )}
            <div style={{ ...s.trow, ...s.trowGrand }}>
              <span>Total</span>
              <span
                style={{ ...s.mono, color: "var(--teal)", fontSize: "17px" }}
              >
                {fmt(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div style={s.sectionLabel}>Send via</div>
        <div style={s.card}>
          <div style={s.deliveryGrid}>
            {DELIVERY_OPTIONS.map((opt) => (
              <div
                key={opt.value}
                style={{
                  ...s.dchip,
                  ...(delivery === opt.value ? s.dchipSel : {}),
                  ...(!opt.ready ? s.dchipDisabled : {}),
                  position: "relative" as const,
                }}
                onClick={() => opt.ready && setDelivery(opt.value)}
              >
                {!opt.ready && <div style={s.comingSoonBadge}>Soon</div>}
                <div
                  style={{
                    ...s.dchipIcon,
                    ...(delivery === opt.value ? s.dchipIconSel : {}),
                    ...(!opt.ready ? { opacity: 0.4 } : {}),
                  }}
                >
                  <DeliveryIcon type={opt.value} />
                </div>
                <div style={{ opacity: opt.ready ? 1 : 0.4 }}>
                  <div style={s.dchipLbl}>{opt.label}</div>
                  <div style={s.dchipSub}>{opt.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} style={s.btnPrimary}>
          {loading ? "Issuing receipt..." : "Issue & Send Receipt →"}
        </button>
      </form>
      {success && (
        <ReceiptSuccess
          receiptCode={success.receiptCode}
          verifyUrl={success.verifyUrl}
          deliveryMethod={success.deliveryMethod}
          deliveryError={success.deliveryError}
          buyerName={buyerName}
          total={success.total}
          onClose={() => setSuccess(null)}
          onNewReceipt={resetForm}
        />
      )}
    </div>
  );
}

function DeliveryIcon({ type }: { type: string }) {
  if (type === "WHATSAPP")
    return (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path
          d="M1.5 12.5l1.1-3.2A5 5 0 1 1 7.5 13a5 5 0 0 1-2.5-.7L1.5 12.5Z"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinejoin="round"
        />
        <circle cx="5" cy="7.5" r=".7" fill="currentColor" />
        <circle cx="7.5" cy="7.5" r=".7" fill="currentColor" />
        <circle cx="10" cy="7.5" r=".7" fill="currentColor" />
      </svg>
    );
  if (type === "EMAIL")
    return (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect
          x="1.5"
          y="3"
          width="12"
          height="9"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.35"
        />
        <path
          d="M1.5 5.5l6 4 6-4"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (type === "SMS")
    return (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect
          x="4"
          y="1"
          width="7"
          height="13"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.35"
        />
        <path
          d="M6 11.5h3"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
      </svg>
    );
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M5.5 3.5H3.5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M8.5 1.5h5m0 0v5m0-5L8 8"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { maxWidth: "540px", margin: "0 auto", padding: "28px 18px 20px" },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "28px",
  },
  brand: { display: "flex", alignItems: "center", gap: "10px" },
  brandName: {
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--ink)",
    letterSpacing: "-0.4px",
  },
  brandTag: { fontSize: "11px", color: "var(--ink3)", marginTop: "2px" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "8px",
    marginBottom: "24px",
  },
  statBox: {
    background: "var(--teal-lt)",
    border: "1px solid var(--teal-bdr)",
    borderRadius: "14px",
    padding: "14px 12px",
  },
  statNum: {
    fontSize: "21px",
    fontWeight: 700,
    color: "var(--teal)",
    letterSpacing: "-0.4px",
  },
  statLbl: { fontSize: "11px", color: "var(--ink2)", marginTop: "2px" },
  sectionLabel: {
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    color: "var(--ink3)",
    marginBottom: "8px",
    marginTop: "20px",
  },
  card: {
    background: "#fff",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "18px 16px",
    marginBottom: "12px",
    boxShadow: "0 1px 4px rgba(13,148,136,0.06)",
  },
  field: { marginBottom: "13px" },
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
    padding: "11px 13px",
    fontFamily: "inherit",
    fontSize: "15px",
    color: "var(--ink)",
    outline: "none",
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  itemRow: {
    display: "grid",
    gridTemplateColumns: "1fr 32px",
    gap: "10px",
    alignItems: "start",
    paddingBottom: "12px",
    marginBottom: "12px",
    borderBottom: "1px solid var(--border)",
  },
  itemFields: { display: "flex", flexDirection: "column", gap: "8px" },
  itemSubRow: { display: "grid", gridTemplateColumns: "72px 1fr", gap: "8px" },
  rmBtn: {
    width: "32px",
    height: "32px",
    border: "1px solid var(--border2)",
    background: "var(--bg2)",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    color: "var(--ink3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addItemBtn: {
    width: "100%",
    padding: "10px",
    border: "1.5px dashed var(--teal-bdr)",
    borderRadius: "9px",
    background: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13.5px",
    fontWeight: 500,
    color: "var(--ink3)",
    marginTop: "4px",
  },
  vatSection: {
    marginTop: "16px",
    paddingTop: "14px",
    borderTop: "1px solid var(--border)",
  },
  vatHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  vatPresets: { display: "flex", gap: "6px" },
  vatPreset: {
    padding: "4px 10px",
    border: "1px solid var(--border2)",
    borderRadius: "20px",
    background: "var(--bg2)",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "12px",
    fontWeight: 500,
    color: "var(--ink2)",
  },
  vatPresetActive: {
    background: "var(--teal-lt)",
    borderColor: "var(--teal)",
    color: "var(--teal)",
    fontWeight: 600,
  },
  vatWrap: {
    display: "flex",
    alignItems: "center",
    background: "var(--bg2)",
    borderRadius: "9px",
    overflow: "hidden",
  },
  vatInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    padding: "11px 0 11px 13px",
    fontFamily: "inherit",
    fontSize: "15px",
    color: "var(--ink)",
    outline: "none",
    width: "100%",
  },
  vatSuffix: {
    padding: "11px 13px 11px 4px",
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--ink2)",
  },
  vatHint: { fontSize: "11.5px", color: "var(--ink3)", marginTop: "6px" },
  vatBadge: {
    fontSize: "10px",
    fontWeight: 600,
    padding: "2px 7px",
    borderRadius: "20px",
    background: "var(--teal-lt)",
    border: "1px solid var(--teal-bdr)",
    color: "var(--teal)",
  },
  totals: {
    borderTop: "1px solid var(--border)",
    paddingTop: "14px",
    marginTop: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  trow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13.5px",
    color: "var(--ink2)",
  },
  trowGrand: {
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--ink)",
    borderTop: "1px solid var(--border)",
    paddingTop: "10px",
    marginTop: "2px",
  },
  mono: { fontFamily: "DM Mono, monospace", fontSize: "13px" },
  deliveryGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" },
  dchip: {
    border: "1.5px solid var(--border)",
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: "var(--border)",
    borderRadius: "9px",
    padding: "11px 12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    background: "var(--bg2)",
    transition: "all 0.15s",
  },
  dchipSel: { borderColor: "var(--teal)", background: "var(--teal-lt)" },
  dchipIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "7px",
    background: "#e8f5f4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    color: "var(--ink2)",
  },
  dchipIconSel: { background: "var(--teal)", color: "#fff" },
  dchipLbl: { fontSize: "13px", fontWeight: 600, color: "var(--ink)" },
  dchipSub: { fontSize: "11px", color: "var(--ink3)", marginTop: "1px" },
  btnPrimary: {
    width: "100%",
    padding: "15px",
    background: "var(--teal)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontFamily: "inherit",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "12px",
  },
  errorBanner: {
    background: "#fff0f3",
    border: "1px solid #fda4af",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13.5px",
    color: "var(--red)",
    marginBottom: "16px",
  },
  dchipDisabled: {
    cursor: "not-allowed",
    filter: "grayscale(0.3)",
    background: "var(--bg2)",
  },
  comingSoonBadge: {
    position: "absolute" as const,
    top: "6px",
    right: "6px",
    background: "var(--bg3)",
    color: "var(--ink3)",
    fontSize: "9px",
    fontWeight: 600,
    padding: "2px 6px",
    borderRadius: "20px",
    letterSpacing: "0.3px",
    textTransform: "uppercase" as const,
  },
};
