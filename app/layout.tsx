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

// Absolute URLs for the share image. On Vercel, Next fills this in from the
// production domain by itself; set NEXT_PUBLIC_SITE_URL when hosting elsewhere.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const shareTitle = "Pracii — something is waking up";
const shareDescription =
  "What if your next conversation didn't start from zero? Meet Pracii, the little robot we're building to remember your conversations. First physical prototype built.";

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: "Pracii — A little robot that remembers",
  description:
    "Meet Pracii. A little robot we're building to remember your conversations, understand your world, and help with the things that matter every day. Made by Pracpoint.",
  openGraph: {
    title: shareTitle,
    description: shareDescription,
    siteName: "Pracii",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
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
