import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Foundry Kampala — AI Tutor",
  description: "Your AI tutor for the Kampala Agentic AI Club",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f7f6f2] min-h-screen">{children}</body>
    </html>
  );
}
