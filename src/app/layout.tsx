import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Fotter from "@/components/ui/Fotter";

export const metadata: Metadata = {
  title: "HeyBazz — AI social media management",
  description:
    "Connect your social pages and let HeyBazz write, design and publish your posts automatically.",
};

// ১. 'children' এর জন্য React.ReactNode টাইপ ডিফাইন করা হয়েছে
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {/* আপনি চাইলে Navbar এবং Fotter এখানে রাখতে পারেন যাতে সব পেজে দেখায় */}
      
        {children}
     
      </body>
    </html>
  );
}