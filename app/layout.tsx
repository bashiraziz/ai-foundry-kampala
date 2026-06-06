import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The AI Foundry Kampala — Build With AI",
  description: "Uganda's AI learning hub. Intensive tracks for developers, professionals, and first-time builders.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen" style={{ backgroundColor: "var(--bone-white)" }}>
        {children}
      </body>
    </html>
  );
}
