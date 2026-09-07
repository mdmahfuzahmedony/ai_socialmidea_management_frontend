"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // e.g. http://localhost:8000

type Step = 1 | 2 | 3 | 4;

interface FbPage {
  id: number;
  platform: string;
  name: string;
  category: string | null;
  color: string;
}

const AVATAR_COLORS = ["#FFD9E4", "#DCD3F9", "#FFE3B0", "#C9EDE6", "#F9D9C9"];

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function CheckDot() {
  return (
    <span
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: "#E7F7F3",
        color: "var(--mint)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: 1,
      }}
    >
      <svg
        width="9"
        height="9"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  );
}

export default function SetupWizard() {
  const params = useSearchParams();
  const [step, setStep] = useState<Step>(1);
  const [loadingPages, setLoadingPages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<FbPage[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  // Laravel /auth/facebook/callback amader eikhane ?step=2 diye ferot pathay,
  // ba error hole ?fb_error=... diye pathay.
  useEffect(() => {
    const fbError = params.get("fb_error");
    const returnedStep = params.get("step");

    if (fbError) {
      setError("Facebook connect kora jayni. Abar try koro.");
      return;
    }

    if (returnedStep === "2") {
      loadPages();
    }
  }, [params]);

  async function loadPages() {
    setLoadingPages(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/pages`, {
        credentials: "include", // Sanctum cookie/session pathanor jonno
      });
      const json = await res.json();
      const fetched: FbPage[] = (json.data || []).map((p: any, i: number) => ({
        id: p.id,
        platform: p.platform,
        name: p.name,
        category: p.category,
        color: AVATAR_COLORS[i % AVATAR_COLORS.length],
      }));

      if (fetched.length === 0) {
        setError(
          "Kono connected page paoa jayni. Age Facebook e ekta Page banao, tarpor abar connect koro.",
        );
        setLoadingPages(false);
        return;
      }

      setPages(fetched);
      setStep(2);
    } catch (e) {
      setError(
        "Page list load kora jayni. Backend chalu ache kina check koro.",
      );
    } finally {
      setLoadingPages(false);
    }
  }

  function connectFacebook() {
    if (!API_URL) {
      setError("NEXT_PUBLIC_API_URL .env.local e set kora nei.");
      return;
    }
    // Full-page redirect — Laravel Socialite eikhane theke Facebook e pathabe,
    // approve korar pore Laravel abar /setup?step=2 e ferot pathabe.
    window.location.href = `${API_URL}/auth/facebook/redirect`;
  }

  function togglePage(id: number) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  async function confirmSelection() {
    try {
      await fetch(`${API_URL}/api/pages/select`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page_ids: selected }),
      });
    } catch {
      // non-blocking — still move forward, backend cha console e log hobe
    }
    setStep(4);
  }

  const selectedPages = pages.filter((p) => selected.includes(p.id));

  return (
    <div className="setup-shell">
      <div className="setup-topbar">
        <div className="logo">
          <div className="logo-mark" />
          HeyBazz
        </div>
      </div>

      <div className="setup-steps">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`setup-step-dot ${step > s ? "done" : step === s ? "active" : ""}`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="setup-card">
          <h2>Connect your Facebook account</h2>
          <p className="setup-sub">
            HeyBazz needs permission to see and post to the pages you manage.
            You&apos;ll approve this on Facebook&apos;s own login screen.
          </p>

          <div className="fb-connect-box">
            <div className="fb-connect-icon">f</div>
            <button
              className="fb-connect-btn"
              onClick={connectFacebook}
              disabled={loadingPages}
            >
              {loadingPages ? "Loading pages…" : "Continue with Facebook"}
            </button>

            {error && (
              <p style={{ color: "#C23558", fontSize: 13, marginTop: 14 }}>
                {error}
              </p>
            )}

            <ul className="setup-permissions">
              <li>
                <CheckDot /> See the Pages you manage
              </li>
              <li>
                <CheckDot /> Publish posts on your behalf
              </li>
              <li>
                <CheckDot /> Read basic engagement data
              </li>
            </ul>
          </div>

          <p className="setup-skip">
            <Link href="/dashboard">Skip for now</Link>
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="setup-card">
          <h2>Select the pages to manage</h2>
          <p className="setup-sub">
            Choose which of your Facebook pages you want HeyBazz&apos;s AI to
            write, design and post for.
          </p>

          <div className="page-select-list">
            {pages.map((p) => {
              const checked = selected.includes(p.id);
              return (
                <div
                  key={p.id}
                  className={`page-select-item${checked ? " checked" : ""}`}
                  onClick={() => togglePage(p.id)}
                >
                  <div
                    className="page-select-avatar"
                    style={{ background: p.color }}
                  />
                  <div>
                    <div className="page-select-name">{p.name}</div>
                    <div className="page-select-meta">
                      {p.category || "Facebook Page"}
                    </div>
                  </div>
                  <div className="page-select-check">
                    {checked && <CheckIcon />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="setup-nav">
            <button
              className="btn btn-ghost"
              onClick={() => setStep(1)}
              style={{ marginRight: 12 }}
            >
              Back
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setStep(3)}
              disabled={selected.length === 0}
            >
              Continue ({selected.length} selected)
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="setup-card">
          <h2>Confirm your setup</h2>
          <p className="setup-sub">
            Double-check before HeyBazz starts managing these pages.
          </p>

          <div className="confirm-summary">
            <div className="confirm-row">
              <span className="lab">Account</span>
              <span>Facebook — connected</span>
            </div>
            <div className="confirm-row">
              <span className="lab">Pages selected</span>
              <span>{selectedPages.length}</span>
            </div>
            {selectedPages.map((p) => (
              <div className="confirm-row" key={p.id}>
                <span className="lab">{p.name}</span>
                <span>{p.category || "Facebook Page"}</span>
              </div>
            ))}
            <div className="confirm-row">
              <span className="lab">Starting plan</span>
              <span>Free trial</span>
            </div>
          </div>

          <div className="setup-nav">
            <button
              className="btn btn-ghost"
              onClick={() => setStep(2)}
              style={{ marginRight: 12 }}
            >
              Back
            </button>
            <button className="btn btn-primary" onClick={confirmSelection}>
              Confirm & finish
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="setup-card">
          <div className="setup-success">
            <div className="setup-success-icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2>You&apos;re all set</h2>
            <p className="setup-sub">
              {selectedPages.length} page{selectedPages.length !== 1 ? "s" : ""}{" "}
              connected. HeyBazz&apos;s AI can start writing, designing and
              posting whenever you are.
            </p>
            <Link
              href="/dashboard"
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
