"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const PLATFORMS_CONFIG = [
  {
    id: "facebook",
    name: "Facebook",
    icon: "f",
    color: "#1877F2",
    bg: "#E7F3FF",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "IG",
    color: "#E4405F",
    bg: "#FDECEF",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "in",
    color: "#0A66C2",
    bg: "#E6F0F9",
  },
];

function PagesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [activePages, setActivePages] = useState<any[]>([]); // বর্তমানে কানেক্টেড পেজ
  const [newFetchedPages, setNewFetchedPages] = useState<any[]>([]); // ফেসবুক থেকে আসা নতুন লিস্ট
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [step2Loading, setStep2Loading] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadActivePages();
    if (searchParams.get("step") === "2") {
      setStep(2);
      loadNewPagesFromBackend();
    }
    if (searchParams.get("connected") === "1") {
      setSuccessMsg(
        "Page(s) shofolvabe connect hoyeche — AI ekhon post korার jonno ready.",
      );
      setTimeout(() => setSuccessMsg(null), 5000);
    }
  }, [searchParams]);

  async function loadActivePages() {
    try {
      const res = await fetch(`${API_URL}/api/pages`, {
        credentials: "include",
      });
      const json = await res.json();
      setActivePages(json.data?.filter((p: any) => p.is_active) || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function loadNewPagesFromBackend() {
    setStep2Loading(true);
    try {
      const res = await fetch(`${API_URL}/api/facebook/pages`, {
        credentials: "include",
      });
      const json = await res.json();
      setNewFetchedPages(json.pages || []);
    } catch (e) {
      console.error(e);
    }
    setStep2Loading(false);
  }

  const handleConnect = (provider: string) => {
    setConnecting(provider);
    // Instagram Facebook Login er moddhoī আসে, alada OAuth lagে না
    const authProvider = provider === "instagram" ? "facebook" : provider;
    window.location.href = `${API_URL}/auth/${authProvider}/redirect`;
  };

 const confirmSelection = async () => {
  try {
    const res = await fetch(`${API_URL}/api/facebook/pages/connect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ page_ids: selectedIds }),
    });

    const json = await res.json();

    if (res.ok) {
      window.location.href = "/dashboard/all-pages?connected=1";
    } else {
      // Backend theke asha exact message dekhabo (plan limit shoho)
      alert(json.message || "Page save korা jayni, abar try koro.");
    }
  } catch (e) {
    alert("Error saving pages");
  }
};

  return (
    <div className="dash-content">
      <div className="section-head" style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "26px", fontWeight: "800" }}>Connected Pages</h2>
        <p style={{ color: "#6F6B93" }}>
          আপনার সোশ্যাল মিডিয়া অ্যাকাউন্টগুলো এখান থেকে ম্যানেজ করুন।
        </p>
      </div>

      {successMsg && <div className="form-success">✓ {successMsg}</div>}

      {step === 1 ? (
        /* --- ভিউ ১: মেইন ড্যাশবোর্ড কার্ডস --- */
        /* --- ভিউ ১: মেইন ড্যাশবোর্ড কার্ডস (প্রিমিয়াম লুক) --- */
        /* --- ভিউ ১: ড্যাশবোর্ড কার্ডস (অটো-হাইলাইট লজিকসহ) --- */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "28px",
          }}
        >
          {PLATFORMS_CONFIG.map((p) => {
            // এই প্ল্যাটফর্মের কোন কোন পেজ একটিভ আছে তা খুঁজে বের করা
            const connectedList = activePages.filter(
              (cp) => cp.platform === p.id && cp.is_active,
            );
            const isAnyConnected = connectedList.length > 0;

            return (
              <div
                key={p.id}
                className="panel"
                style={{
                  padding: "32px",
                  borderRadius: "35px",
                  // কানেক্টেড হলে বর্ডার নীল হবে এবং একটি সুন্দর শ্যাডো আসবে
                  border: isAnyConnected
                    ? `2px solid ${p.color}`
                    : "1.5px solid #E1DDF0",
                  background: isAnyConnected
                    ? `linear-gradient(145deg, #ffffff, ${p.bg})`
                    : "#fff",
                  boxShadow: isAnyConnected
                    ? `0 20px 40px -15px ${p.color}44`
                    : "none",
                  position: "relative",
                  transition:
                    "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  transform: isAnyConnected ? "translateY(-8px)" : "none",
                }}
              >
                {/* কানেক্টেড হলে ডান কোণায় একটি 'Active' ব্যাজ */}
                {isAnyConnected && (
                  <div
                    style={{
                      position: "absolute",
                      top: "15px",
                      right: "15px",
                      background: "var(--mint)",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "99px",
                      fontSize: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    CONNECTED
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "18px",
                      backgroundColor: isAnyConnected ? p.color : "#F6F4FC",
                      color: isAnyConnected ? "#fff" : p.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    {p.icon}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: "19px",
                        fontWeight: "800",
                        color: "#17162A",
                      }}
                    >
                      {p.name}
                    </h3>
                    <span
                      style={{
                        fontSize: "13px",
                        color: isAnyConnected ? "var(--mint)" : "#6F6B93",
                        fontWeight: "600",
                      }}
                    >
                      {isAnyConnected
                        ? `✓ ${connectedList.length} Page Connected`
                        : "Disconnected"}
                    </span>
                  </div>
                </div>

                {/* কানেক্টেড পেজের নামগুলো কার্ডের ভেতরে দেখাবে */}
                {isAnyConnected && (
                  <div
                    style={{
                      marginBottom: "20px",
                      padding: "10px",
                      background: "rgba(255,255,255,0.5)",
                      borderRadius: "15px",
                    }}
                  >
                    {connectedList.map((cp) => (
                      <div
                        key={cp.id}
                        style={{
                          fontSize: "13px",
                          fontWeight: "700",
                          color: "#3A3852",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: p.color,
                          }}
                        />
                        {cp.name}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => handleConnect(p.id)}
                  className="btn"
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: isAnyConnected ? "#17162A" : p.color,
                    color: "#fff",
                    borderRadius: "14px",
                    fontWeight: "bold",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {isAnyConnected ? "Manage Settings" : `Connect ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* --- ভিউ ২: পেজ ও ইন্সটাগ্রাম সিলেকশন (ফেসবুক থেকে ফিরে আসার পর) --- */
        <div
          className="panel"
          style={{
            padding: "40px",
            borderRadius: "32px",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <h2 style={{ marginBottom: "10px" }}>
            আপনার অ্যাকাউন্টগুলো বেছে নিন
          </h2>
          <p style={{ color: "#6F6B93", marginBottom: "30px" }}>
            ফেসবুক এবং ইন্সটাগ্রামের যেসব পেজ আপনি HeyBazz AI দিয়ে ম্যানেজ করতে
            চান:
          </p>

          {step2Loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: "#6F6B93",
              }}
            >
              Loading pages…
            </div>
          ) : newFetchedPages.length === 0 ? (
            /* Shob page age theke connected thakle ekhane khali dekhaবে না, বরং clear message */
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <p style={{ color: "#6F6B93", marginBottom: "20px" }}>
                Notun kono page paoa jayni — mone hocche tomar shob
                Facebook/Instagram page age theke connected ache. ✓
              </p>
              <button onClick={() => setStep(1)} className="btn btn-ghost">
                Back to pages
              </button>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                }}
              >
                {newFetchedPages.map((page) => {
                  const isActive = selectedIds.includes(page.platform_page_id);
                  return (
                    <div
                      key={page.platform_page_id}
                      onClick={() =>
                        setSelectedIds((prev) =>
                          isActive
                            ? prev.filter((id) => id !== page.platform_page_id)
                            : [...prev, page.platform_page_id],
                        )
                      }
                      style={{
                        padding: "20px",
                        borderRadius: "24px",
                        cursor: "pointer",
                        display: "flex",
                        gap: "15px",
                        alignItems: "center",
                        border: isActive
                          ? "2px solid #6C5CE7"
                          : "1px solid #E1DDF0",
                        backgroundColor: isActive ? "#F6F4FC" : "white",
                        transition: "border-color .15s, background .15s",
                      }}
                    >
                      <img
                        src={
                          page.picture ||
                          `https://ui-avatars.com/api/?name=${page.name}`
                        }
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "12px",
                        }}
                        alt=""
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "700", fontSize: "14px" }}>
                          {page.name}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color:
                              page.platform === "facebook"
                                ? "#1877F2"
                                : "#E4405F",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          {page.platform}
                        </div>
                      </div>
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          border: isActive ? "none" : "1.5px solid #E1DDF0",
                          background: isActive ? "#6C5CE7" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {isActive && (
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
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: "40px", display: "flex", gap: "15px" }}>
                <button
                  onClick={() => setStep(1)}
                  className="btn btn-ghost"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSelection}
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                  disabled={selectedIds.length === 0}
                >
                  Confirm & Connect ({selectedIds.length})
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function ConnectedPages() {
  return (
    <Suspense
      fallback={<div className="p-20 text-center">Loading Pages...</div>}
    >
      <PagesContent />
    </Suspense>
  );
}
