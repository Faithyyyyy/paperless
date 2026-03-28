// lib/receipt-pdf.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const TEAL = "#0d9488";
const INK = "#0d1f1e";
const INK2 = "#5a7370";
const INK3 = "#9db8b5";
const TEAL_LT = "#f0fdfa";
const BORDER = "#c9ede9";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    padding: 0,
  },

  // Header
  header: {
    backgroundColor: TEAL,
    padding: "28 32",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  shopName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 3,
  },
  shopSub: {
    fontSize: 10,
    color: "rgba(255,255,255,0.65)",
  },
  receiptIdBox: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 14,
    alignSelf: "flex-start",
  },
  receiptIdText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 0.5,
  },

  // Body
  body: {
    padding: "20 32",
  },

  // Meta row
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  metaText: {
    fontSize: 10,
    color: INK3,
  },

  // Buyer
  buyerBox: {
    backgroundColor: TEAL_LT,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    padding: "10 12",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buyerName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: INK,
    marginBottom: 2,
  },
  buyerPhone: {
    fontSize: 10,
    color: INK2,
  },

  // Section label
  sectionLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: INK3,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  // Items table
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom: 6,
    marginBottom: 4,
  },
  tableHeaderText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: INK3,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "flex-start",
  },
  colItem: { flex: 3 },
  colQty: { flex: 1, textAlign: "center" },
  colPrice: { flex: 1.5, textAlign: "right" },
  itemName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: INK,
    marginBottom: 2,
  },
  itemImei: {
    fontSize: 9,
    color: INK3,
    fontFamily: "Helvetica",
  },
  itemQty: {
    fontSize: 11,
    color: INK2,
    textAlign: "center",
  },
  itemPrice: {
    fontSize: 11,
    color: INK,
    textAlign: "right",
    fontFamily: "Helvetica",
  },

  // Totals
  totalsBox: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 11,
    color: INK2,
  },
  totalValue: {
    fontSize: 11,
    color: INK,
    fontFamily: "Helvetica",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1.5,
    borderTopColor: TEAL,
    paddingTop: 8,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: INK,
  },
  grandTotalValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: TEAL,
  },

  // QR + seal section
  qrSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    borderTopStyle: "dashed",
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  qrImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
  },
  qrRight: {
    flex: 1,
  },
  qrTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: INK,
    marginBottom: 4,
  },
  qrUrl: {
    fontSize: 9,
    color: TEAL,
    marginBottom: 8,
    fontFamily: "Helvetica",
  },
  qrHint: {
    fontSize: 9,
    color: INK3,
    lineHeight: 1.4,
  },

  // Tamper proof
  tamperBox: {
    backgroundColor: TEAL_LT,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    padding: "10 12",
    marginTop: 12,
  },
  tamperTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: TEAL,
    marginBottom: 3,
  },
  tamperSub: {
    fontSize: 9,
    color: INK2,
    marginBottom: 3,
  },
  tamperHash: {
    fontSize: 8,
    color: INK3,
    fontFamily: "Helvetica",
  },

  // Footer
  footer: {
    backgroundColor: "#f7fafa",
    padding: "12 32",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    marginTop: 20,
  },
  footerLeft: {
    fontSize: 9,
    color: INK2,
  },
  footerRight: {
    fontSize: 9,
    color: INK3,
  },
});

interface ReceiptPDFProps {
  receipt: {
    receiptCode: string;
    issuedAt: string;
    purchaseDate: string;
    vendor: {
      name: string;
      address: string | null;
      phone: string | null;
      city: string | null;
    };
    buyer: {
      name: string;
      phone: string;
    };
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
  qrDataUrl?: string;
}

function fmt(n: number) {
  return "NGN " + Math.round(n).toLocaleString();
}

export function ReceiptPDF({ receipt, qrDataUrl }: ReceiptPDFProps) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${receipt.receiptCode}`;

  return (
    <Document
      title={`Receipt ${receipt.receiptCode} — ${receipt.vendor.name}`}
      author="Paperless"
      subject="Purchase Receipt"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.shopName}>{receipt.vendor.name}</Text>
              <Text style={styles.shopSub}>
                {[
                  receipt.vendor.city,
                  receipt.vendor.address,
                  receipt.vendor.phone,
                ]
                  .filter(Boolean)
                  .join("  ·  ")}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 9,
                  color: "rgba(255,255,255,0.5)",
                  textAlign: "right",
                  marginBottom: 2,
                }}
              >
                Powered by Paperless
              </Text>
            </View>
          </View>
          <View style={styles.receiptIdBox}>
            <Text style={styles.receiptIdText}>{receipt.receiptCode}</Text>
          </View>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {/* Meta */}
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {new Date(receipt.purchaseDate).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
            <Text style={styles.metaText}>
              Issued: {new Date(receipt.issuedAt).toLocaleDateString("en-NG")}
            </Text>
          </View>

          {/* Buyer */}
          <View style={styles.buyerBox}>
            <View>
              <Text style={styles.buyerName}>{receipt.buyer.name}</Text>
              <Text style={styles.buyerPhone}>{receipt.buyer.phone}</Text>
            </View>
          </View>

          {/* Items */}
          <Text style={styles.sectionLabel}>Items purchased</Text>
          <View style={styles.tableHeader}>
            <View style={styles.colItem}>
              <Text style={styles.tableHeaderText}>Item</Text>
            </View>
            <View style={styles.colQty}>
              <Text style={[styles.tableHeaderText, { textAlign: "center" }]}>
                Qty
              </Text>
            </View>
            <View style={styles.colPrice}>
              <Text style={[styles.tableHeaderText, { textAlign: "right" }]}>
                Amount
              </Text>
            </View>
          </View>

          {receipt.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <View style={styles.colItem}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.imei && (
                  <Text style={styles.itemImei}>IMEI: {item.imei}</Text>
                )}
              </View>
              <View style={styles.colQty}>
                <Text style={styles.itemQty}>{item.quantity}</Text>
              </View>
              <View style={styles.colPrice}>
                <Text style={styles.itemPrice}>{fmt(item.lineTotal)}</Text>
              </View>
            </View>
          ))}

          {/* Totals */}
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{fmt(receipt.subtotal)}</Text>
            </View>
            {receipt.vatRate > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>VAT ({receipt.vatRate}%)</Text>
                <Text style={styles.totalValue}>{fmt(receipt.vatAmount)}</Text>
              </View>
            )}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>{fmt(receipt.total)}</Text>
            </View>
          </View>

          {/* QR Code + verify */}
          <View style={styles.qrSection}>
            {qrDataUrl && (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={qrDataUrl} style={styles.qrImage} />
            )}
            <View style={styles.qrRight}>
              <Text style={styles.qrTitle}>Verify this receipt</Text>
              <Text style={styles.qrUrl}>{verifyUrl}</Text>
              <Text style={styles.qrHint}>
                Scan the QR code or visit the link above to verify this receipt
                is authentic and unmodified.
              </Text>
            </View>
          </View>

          {/* Tamper proof */}
          <View style={styles.tamperBox}>
            <Text style={styles.tamperTitle}>Tamper-proof certificate</Text>
            <Text style={styles.tamperSub}>
              Issued {new Date(receipt.issuedAt).toLocaleDateString()} ·
              Cryptographically sealed · Never modified
            </Text>
            <Text style={styles.tamperHash}>SHA-256: {receipt.hash}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLeft}>
            {receipt.vendor.name}
            {receipt.vendor.city ? `  ·  ${receipt.vendor.city}` : ""}
          </Text>
          <Text style={styles.footerRight}>
            Powered by Paperless · paperless.ng
          </Text>
        </View>
      </Page>
    </Document>
  );
}
