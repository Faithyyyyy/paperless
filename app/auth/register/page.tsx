"use client";
// app/auth/register/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    shopName: "",
    phone: "",
    city: "",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto sign in after registration
      const signInRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInRes?.error) {
        setError("Account created but sign in failed. Please log in.");
        router.push("/auth/login");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <Logo size={44} />
          <div>
            <div style={styles.brandName}>Paperless</div>
            <div style={styles.brandTag}>Digital receipts, verified</div>
          </div>
        </div>

        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.sub}>Set up your vendor profile to start issuing receipts</p>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.sectionLabel}>Your details</div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Full name</label>
              <input style={styles.input} type="text" placeholder="Tunde Fashola" required
                value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <input style={styles.input} type="email" placeholder="you@example.com" required
                value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" placeholder="Min 8 characters" required
              value={form.password} onChange={(e) => set("password", e.target.value)} />
          </div>

          <div style={styles.sectionLabel}>Shop details</div>
          <div style={styles.field}>
            <label style={styles.label}>Shop name</label>
            <input style={styles.input} type="text" placeholder="e.g. TechCorner Lagos" required
              value={form.shopName} onChange={(e) => set("shopName", e.target.value)} />
          </div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Phone number</label>
              <input style={styles.input} type="tel" placeholder="+234 801 000 0000"
                value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>City</label>
              <input style={styles.input} type="text" placeholder="Lagos"
                value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <Link href="/auth/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "var(--bg2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    border: "1px solid var(--border)",
    padding: "36px 32px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 4px 24px rgba(13,148,136,0.08)",
  },
  logoWrap: {
    display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px",
  },
  brandName: { fontSize: "18px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.3px" },
  brandTag: { fontSize: "11px", color: "var(--ink3)", marginTop: "2px" },
  heading: { fontSize: "22px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.4px", marginBottom: "4px" },
  sub: { fontSize: "14px", color: "var(--ink2)", marginBottom: "24px" },
  errorBanner: {
    background: "#fff0f3", border: "1px solid #fda4af", borderRadius: "8px",
    padding: "10px 14px", fontSize: "13.5px", color: "var(--red)", marginBottom: "16px",
  },
  sectionLabel: {
    fontSize: "11px", fontWeight: 600, textTransform: "uppercase" as const,
    letterSpacing: "0.7px", color: "var(--ink3)", marginBottom: "10px", marginTop: "20px",
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  field: { marginBottom: "12px" },
  label: { display: "block", fontSize: "12px", fontWeight: 600, color: "var(--ink2)", marginBottom: "6px" },
  input: {
    width: "100%", background: "var(--bg2)", border: "1.5px solid transparent",
    borderRadius: "9px", padding: "11px 13px", fontFamily: "inherit",
    fontSize: "15px", color: "var(--ink)", outline: "none",
  },
  btn: {
    width: "100%", padding: "14px", background: "var(--teal)", color: "#fff",
    border: "none", borderRadius: "12px", fontFamily: "inherit",
    fontWeight: 700, fontSize: "15px", cursor: "pointer", marginTop: "8px",
  },
  switchText: { textAlign: "center" as const, fontSize: "13.5px", color: "var(--ink2)", marginTop: "20px" },
  link: { color: "var(--teal)", fontWeight: 600, textDecoration: "none" },
};
