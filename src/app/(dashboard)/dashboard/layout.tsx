import UsersSidebar from '@/components/dashboard/users/usersSidebar';
import UsersNavbar from '@/components/dashboard/users/usersNavbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dash-shell">
      <UsersSidebar />
      <main className="dash-main">
        <UsersNavbar /> {/* আলাদা করা ন্যাভবার */}
        <div className="dash-content">{children}</div>
      </main>
    </div>
  );
}