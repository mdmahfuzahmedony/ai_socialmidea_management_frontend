"use client";

import { useRouter, usePathname } from "next/navigation";

const MENU_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard/overview",
    d: "M3 3v18h18M7 15l4-6 3 4 5-8",
  },
  {
    label: "Connected pages",
    href: "/dashboard/all-pages",
    d: "M12 3l8 4.5v9L12 21l-8-4.5v-9z",
  },
  { label: "Posts", href: "/dashboard/posts", d: "M3 4h18M3 4v16h18V4M8 4v16" },
  { label: "Create post", href: "/dashboard/create", d: "M12 5v14M5 12h14" },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    d: "M3 3v18h18M7 15l4-6 3 4 5-8",
  },
  { label: "Billing", href: "/dashboard/billing", d: "M3 4h18v16H3zM3 9h18" },
  { label: "Gallery", href: "/dashboard/gallery", d: "M3 4h18v16H3zM3 9h18" },
];

export default function UsersSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="dash-sidebar">
      <div className="logo">
        <div className="logo-mark" />
        HeyBazz
      </div>

      <nav className="dash-nav">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.href}
            className={pathname === item.href ? "active" : ""}
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

      <div className="dash-sidebar-foot">marlow.coffee</div>
    </aside>
  );
}
