"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = (provider: string) => {
    window.location.href = `${API_URL}/auth/${provider}/redirect`;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: "include" });
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(getCookie("XSRF-TOKEN") || ""),
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Signup failed.");
        setLoading(false);
        return;
      }
      router.push("/setup");
    } catch {
      setError("সার্ভারে কানেক্ট করা যায়নি।");
      setLoading(false);
    }
  }

  return (
    <div className="setup-shell">
      <div className="setup-topbar">
        <Link href="/" className="logo">
          <div className="logo-mark" />
          HeyBazz
        </Link>
      </div>

      <div className="setup-card">
        <h2>Create account</h2>
        <p className="setup-sub">১-ক্লিকে একাউন্ট খুলে কাজ শুরু করুন।</p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => handleSocialLogin("google")}
            className="btn btn-ghost"
            style={{
              width: "100%",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              width="20"
              alt="google"
            />
            Sign up with Google
          </button>
        </div>

        <div style={{ textAlign: "center", margin: "15px 0", color: "#888" }}>
          — OR —
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
            />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="auth-foot">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : undefined;
}
