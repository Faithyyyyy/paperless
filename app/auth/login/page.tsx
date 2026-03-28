"use client";
// app/auth/login/page.tsx
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
      return;
    }

    router.push("/dashboard");
    router.refresh();
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

        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.sub}>Sign in to your vendor account</p>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p style={styles.switchText}>
          Don&apos;t have an account?
          <Link href="/auth/register" style={styles.link}>
            Create one
          </Link>
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
    maxWidth: "420px",
    boxShadow: "0 4px 24px rgba(13,148,136,0.08)",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "28px",
  },
  brandName: {
    fontSize: "18px",
    fontWeight: 700,
    color: "var(--ink)",
    letterSpacing: "-0.3px",
  },
  brandTag: {
    fontSize: "11px",
    color: "var(--ink3)",
    marginTop: "2px",
  },
  heading: {
    fontSize: "22px",
    fontWeight: 700,
    color: "var(--ink)",
    letterSpacing: "-0.4px",
    marginBottom: "4px",
  },
  sub: {
    fontSize: "14px",
    color: "var(--ink2)",
    marginBottom: "24px",
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
  field: {
    marginBottom: "14px",
  },
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
    marginTop: "8px",
  },
  switchText: {
    textAlign: "center",
    fontSize: "13.5px",
    color: "var(--ink2)",
    marginTop: "20px",
  },
  link: {
    color: "var(--teal)",
    fontWeight: 600,
    textDecoration: "none",
  },
};
