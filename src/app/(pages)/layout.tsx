import Navbar from '@/components/ui/Navbar';
import Fotter from '@/components/ui/Fotter';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Fotter />
    </>
  );
}