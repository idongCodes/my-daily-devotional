import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import BackgroundMusic from "@/components/BackgroundMusic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://my-daily-devotional.vercel.app'),
  title: {
    default: "My Daily Devotional | Scripture, Prayer, & Live Sermons",
    template: "%s | My Daily Devotional"
  },
  description: "Your digital sanctuary for daily Bible verses, AI-guided life application, powerful prayers, and live Sunday sermons. Foster a deeper relationship with God today.",
  keywords: ["Daily Devotional", "Bible Verses", "Christian Web App", "AI Bible Study", "Live Sermons", "Prayer Generator", "Scripture Application", "Faith Journey"],
  authors: [{ name: "idongCodes", url: "https://essien.dev" }],
  creator: "idongCodes",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://my-daily-devotional.vercel.app",
    siteName: "My Daily Devotional",
    title: "My Daily Devotional | Scripture, Prayer, & Live Sermons",
    description: "Start your day with curated Bible verses, AI-guided context, deep life application, and personalized prayers.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "My Daily Devotional preview featuring a serene Bible reading interface",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Daily Devotional | Scripture, Prayer, & Live Sermons",
    description: "Start your day with curated Bible verses, AI-guided context, deep life application, and personalized prayers.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <TopBar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <BackgroundMusic />
      </body>
    </html>
  );
}
