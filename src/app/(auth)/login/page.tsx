"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = (provider: string) => {
    // আপনার লারাভেল যদি localhost:8000 এ চলে, তবে সরাসরি এই লিঙ্কটি দিন
    // এখানে /api যোগ করবেন না
    window.location.href = `http://localhost:8000/auth/${provider}/redirect`;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // ... আপনার আগের ইমেইল লগইন লজিক ...
  }

  return (
    <div className="setup-shell">
      <div className="setup-topbar">
        <Link href="/" className="logo">
          <div className="logo-mark" /> HeyBazz
        </Link>
      </div>

      <div className="setup-card">
        <h2>Welcome Back</h2>
        <p className="setup-sub">লগইন করে আপনার সোশ্যাল মিডিয়া অডিট দেখুন।</p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => handleSocialLogin("google")}
            className="btn btn-ghost"
            style={{ width: "100%", gap: "10px" }}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              width="18"
              alt="google"
            />
            Continue with Google
          </button>
        </div>

        <div
          style={{
            textAlign: "center",
            margin: "15px 0",
            color: "#ccc",
            fontSize: "12px",
          }}
        >
          OR EMAIL
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button
            className="btn btn-primary"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Processing..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
