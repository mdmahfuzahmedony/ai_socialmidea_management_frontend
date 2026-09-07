"use client";

import { useRouter, usePathname } from "next/navigation";

const ADMIN_MENU_ITEMS = [
  {
    label: "Overview",
    href: "/admin/overview",
    d: "M3 3v18h18M7 15l4-6 3 4 5-8",
  },
  {
    label: "All Users",
    href: "/admin/all-users",
    d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  },
  // --- নতুন পেমেন্ট রিকোয়েস্ট মেনু ---
  {
    label: "Payment Requests",
    href: "/admin/payments",
    d: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V10h16v8zm0-12H4V6h16v4z",
  },
  { label: "Plans", href: "/admin/plans", d: "M3 3v18h18M3 9h18M3 15h18" },
  {
    label: "Platform status",
    href: "/admin/status",
    d: "M12 2a10 10 0 1 0 10 10M12 2v10l7 3",
  },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="dash-sidebar">
      <div className="logo">
        <div className="logo-mark" />
        HeyBazz
      </div>

   
      <nav className="dash-nav">
        {ADMIN_MENU_ITEMS.map((item) => (
          <button
            key={item.href}
            className={pathname.startsWith(item.href) ? "active" : ""}
            onClick={() => router.push(item.href)}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={item.d} />
            </svg>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="dash-sidebar-foot">Signed in as admin@heybazz.app</div>
    </aside>
  );
}