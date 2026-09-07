"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ব্যাকএন্ড থেকে ইউজার ডাটা চেক করা
  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch(`${API_URL}/api/user`, {
          headers: { Accept: "application/json" },
          credentials: "include",
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  // ড্রপডাউনের বাইরে ক্লিক করলে বন্ধ করা
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
    } catch (e) {}
    setUser(null);
    setShowProfileMenu(false);
    window.location.href = "/login";
  };

  if (loading)
    return (
      <header className="site-header">
        <nav className="wrap" style={{ height: 76 }}></nav>
      </header>
    );

  return (
    <header className="site-header">
      <nav className="wrap">
        <Link href="/" className="logo">
          <div className="logo-mark" /> HeyBazz
        </Link>

        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "active" : ""}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-cta">
          {!user ? (
            <>
              <Link href="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link href="/signup" className="btn btn-primary">
                Start free
              </Link>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {user.role === "admin" && (
                <Link
                  href="/admin/overview"
                  className="btn btn-primary"
                  style={{ fontSize: 13, padding: "8px 16px" }}
                >
                  Admin Panel
                </Link>
              )}

              <div ref={dropdownRef} style={{ position: "relative" }}>
                {/* Avatar Button — তোমার CSS অনুযায়ী */}
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid var(--violet)",
                        display: "block",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        const parent = (e.target as HTMLImageElement)
                          .parentElement;
                        if (parent) {
                          const fallback = document.createElement("div");
                          fallback.style.cssText =
                            "width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--violet),var(--mint));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:16px;border:2px solid var(--violet);";
                          fallback.textContent = user.name
                            .charAt(0)
                            .toUpperCase();
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, var(--violet), var(--mint))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 16,
                        border: "2px solid var(--violet)",
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {/* Dropdown — তোমার globals.css অনুযায়ী */}
                {showProfileMenu && (
                  <div
                    className="profile-dropdown"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 10px)",
                      right: 0,
                      background: "var(--paper-raised)",
                      border: "1px solid var(--line)",
                      borderRadius: 16,
                      padding: 8,
                      minWidth: 200,
                      zIndex: 999,
                      boxShadow: "var(--shadow)",
                    }}
                  >
                    {/* User Info Header */}
                    <div
                      style={{
                        padding: "10px 12px",
                        borderBottom: "1px solid var(--line)",
                        marginBottom: 6,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt=""
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, var(--violet), var(--mint))",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 13,
                          }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "var(--ink)",
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {user.name}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "var(--ink-soft)",
                            margin: 0,
                            textTransform: "capitalize",
                          }}
                        >
                          {user.role} Account
                        </p>
                      </div>
                    </div>

                    {/* Dashboard Link */}
                    <Link
                      href={
                        user.role === "admin"
                          ? "/admin/overview"
                          : "/dashboard/overview"
                      }
                      className="dropdown-item"
                      style={{
                        display: "block",
                        padding: "10px 12px",
                        fontSize: 14,
                        color: "var(--ink)",
                        textDecoration: "none",
                        borderRadius: 10,
                        fontWeight: 500,
                      }}
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Dashboard
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        background: "none",
                        border: "none",
                        padding: "10px 12px",
                        fontSize: 14,
                        color: "var(--flare)",
                        cursor: "pointer",
                        fontWeight: 600,
                        borderRadius: 10,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setOpen(!open)}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${open ? " open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
        {user ? (
          <>
            <Link
              href={
                user.role === "admin"
                  ? "/admin/overview"
                  : "/dashboard/overview"
              }
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              style={{
                textAlign: "left",
                padding: "16px 32px",
                fontSize: 15,
                fontWeight: 500,
                color: "var(--flare)",
                background: "none",
                border: "none",
                borderBottom: "1px solid var(--line)",
                fontFamily: "Inter, sans-serif",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/signup" onClick={() => setOpen(false)}>
            Start free
          </Link>
        )}
      </div>
    </header>
  );
}
