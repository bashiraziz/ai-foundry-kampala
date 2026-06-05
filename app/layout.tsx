import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mshauri — The AI Foundry Kampala",
  description: "Your AI advisor at The AI Foundry Kampala",
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
