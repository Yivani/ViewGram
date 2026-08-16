// created by Yivani yivani.dev
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "ViewGram - Instagram Profile Previewer",
  description: "The ultimate dashboard for Instagram. Organize your feed with our powerful preview tool. Plan, perfect, and visualize your grid before you post. No login required.",
  keywords: ["Instagram", "profile previewer", "grid planner", "social media", "content planning", "Instagram layout", "profile editor"],
  authors: [{ name: "Yivani", url: "https://yivani.dev" }],
  creator: "Yivani",
  publisher: "ViewGram",
  metadataBase: new URL("https://viewgram.yivani.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://viewgram.yivani.dev",
    siteName: "ViewGram",
    title: "ViewGram - Instagram Profile Previewer",
    description: "The ultimate dashboard for Instagram. Organize your feed with our powerful preview tool. Plan, perfect, and visualize your grid before you post.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "ViewGram Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ViewGram - Instagram Profile Previewer",
    description: "The ultimate dashboard for Instagram. Organize your feed with our powerful preview tool.",
    images: ["/logo.png"],
    creator: "@yivani",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/logo.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

