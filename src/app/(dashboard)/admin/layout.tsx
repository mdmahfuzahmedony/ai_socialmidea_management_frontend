import AdminSidebar from '@/components/dashboard/admin/adminSidebar';
import AdminNavbar from '@/components/dashboard/admin/adminNavbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dash-shell">
      <AdminSidebar />
      <main className="dash-main">
        <AdminNavbar /> {/* আলাদা করা ন্যাভবার */}
        <div className="dash-content">{children}</div>
      </main>
    </div>
  );
}