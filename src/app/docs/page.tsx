"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function DocsHome() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // simple check: cookie-তে session আছে কিনা দেখা
    const hasSession =
      document.cookie.includes("laravel_session") ||
      document.cookie.includes("XSRF-TOKEN");
    setIsLoggedIn(hasSession);
  }, []);

  const getStartedHref = isLoggedIn ? "/dashboard" : "/login";

  return (
    <div>
      <div
        style={{
          marginBottom: "10px",
          fontSize: "13px",
          color: "#00B39B",
          fontWeight: 700,
        }}
      >
        DOCUMENTATION
      </div>
      <h1 style={{ fontSize: "40px", fontWeight: 800, marginBottom: "16px" }}>
        Getting started with HeyBazz
      </h1>
      <p
        style={{
          fontSize: "17px",
          color: "#666",
          marginBottom: "30px",
          maxWidth: "640px",
        }}
      >
        Connect your page, run an AI audit, and publish your first AI-generated
        post — in three steps.
      </p>

      <Link
        href={getStartedHref}
        className="btn btn-primary"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          borderRadius: "10px",
          marginBottom: "50px",
        }}
      >
        {isLoggedIn ? "Go to dashboard →" : "Get started →"}
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "20px",
        }}
      >
        <Link
          href="/docs/getting-started"
          style={{
            border: "1px solid #eee",
            borderRadius: "14px",
            padding: "20px",
            display: "block",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "6px" }}>
            Getting Started
          </div>
          <div style={{ fontSize: "13px", color: "#888" }}>
            Connect your first page and publish your first post
          </div>
        </Link>
        <Link
          href="/docs/features"
          style={{
            border: "1px solid #eee",
            borderRadius: "14px",
            padding: "20px",
            display: "block",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "6px" }}>Features</div>
          <div style={{ fontSize: "13px", color: "#888" }}>
            AI Audit, Smart Post Creator, and scheduling
          </div>
        </Link>
        <Link
          href="/docs/billing"
          style={{
            border: "1px solid #eee",
            borderRadius: "14px",
            padding: "20px",
            display: "block",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "6px" }}>Billing</div>
          <div style={{ fontSize: "13px", color: "#888" }}>
            Plans, limits, and upgrading
          </div>
        </Link>
      </div>
    </div>
  );
}
