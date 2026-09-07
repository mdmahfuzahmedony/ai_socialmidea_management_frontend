import type { Metadata } from "next";
import "./globals.css"; // স্ক্রিনশট অনুযায়ী globals.css এখানে আছে
import Navbar from "@/components/ui/Navbar";
import Fotter from "@/components/ui/Fotter";

export const metadata: Metadata = {
  title: "HeyBazz — AI social media management",
  description:
    "Connect your social pages and let HeyBazz write, design and publish your posts automatically.",
};

// src/app/layout.tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
