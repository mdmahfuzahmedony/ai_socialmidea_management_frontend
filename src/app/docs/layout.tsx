import Link from "next/link";

const NAV = [
  { href: "/docs/getting-started", label: "Getting Started" },
  { href: "/docs/features", label: "Features" },
  { href: "/docs/billing", label: "Billing" },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* --- বাম পাশের Sidebar --- */}
      <aside
        style={{
          width: "260px",
          borderRight: "1px solid #eee",
          padding: "30px 20px",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Link
          href="/"
          style={{
            fontWeight: 800,
            fontSize: "18px",
            display: "block",
            marginBottom: "30px",
          }}
        >
          HeyBazz Docs
        </Link>

        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "block",
              padding: "10px 12px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#333",
              marginBottom: "4px",
            }}
          >
            {item.label}
          </Link>
        ))}
      </aside>

      {/* --- ডান পাশে actual content --- */}
      <main style={{ flex: 1, padding: "40px 60px", maxWidth: "900px" }}>
        {children}
      </main>
    </div>
  );
}
