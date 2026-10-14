import type { Metadata } from "next";
import { Inter, Spectral } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Wisdom of Vidura | Cinematic Experience",
  description: "Explore the psychological depths of leadership and statecraft from 3140 B.C.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spectral.variable} antialiased`} suppressHydrationWarning>
      <body className="bg-[#0b0c10]" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
