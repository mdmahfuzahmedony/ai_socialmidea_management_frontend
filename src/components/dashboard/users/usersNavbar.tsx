'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UsersNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const title = pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard';

  return (
    <div className="dash-topbar">
      <h1 className="capitalize">{title}</h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* ইউজারদের জন্য কুইক অ্যাকশন বাটন */}
        <Link href="/dashboard/create" className="btn btn-primary btn-sm">
          + New Post
        </Link>

        {/* ইউজারের প্রোফাইল চিপ */}
        <div className="dash-admin-chip" style={{ cursor: 'pointer' }}>
          <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--ink-soft)' }}>marlow.coffee</span>
          <div className="dash-admin-avatar" />
        </div>
      </div>
    </div>
  );
}