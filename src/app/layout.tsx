import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Crypto Portfolio Advisor | mvirgiawancr",
  description: "AI-powered insights for your crypto portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geistSans.className}>
        {/* wrap everything */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
