'use client';
import { usePathname } from 'next/navigation';

export default function AdminNavbar() {
  const pathname = usePathname();
  // ইউআরএল থেকে নাম বের করা (যেমন: /admin/overview -> Overview)
  const title = pathname.split('/').pop()?.replace('-', ' ') || 'Admin';

  return (
    <div className="dash-topbar">
      <h1 className="capitalize">{title}</h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* অ্যাডমিন সার্চ বার */}
        <div className="dash-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          Search users, pages...
        </div>

        {/* অ্যাডমিন প্রোফাইল চিপ */}
        <div className="dash-admin-chip">
          <div className="dash-admin-avatar" style={{ background: '#6C5CE7' }} />
        </div>
      </div>
    </div>
  );
}