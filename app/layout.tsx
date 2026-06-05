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
      <body className="min-h-screen" style={{ backgroundColor: "var(--bone-white)" }}>
        {children}
      </body>
    </html>
  );
}
