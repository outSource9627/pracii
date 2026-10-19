import type { Metadata, Viewport } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import { Providers } from "@/components/providers";
import "./theme.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pracii — A little robot that remembers",
  description:
    "Meet Pracii. A little robot we're building to remember your conversations, understand your world, and help with the things that matter every day. Made by Pracpoint.",
  openGraph: {
    title: "Pracii — A little robot that remembers",
    description:
      "What if your next conversation didn't start from zero? Pracii is a personal AI companion robot, now at its first physical prototype.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fffbf0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
