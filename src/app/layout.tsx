import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/toaster";
import { StructuredData } from "@/components/StructuredData";
import { PageViewTracker } from "@/components/PageViewTracker";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

const APP_URL = "https://remoteworkhub.org";

export const metadata: Metadata = {
  title: {
    default: "Remote Work Hub | 2026 Elite Web Development & SaaS Masterclass",
    template: "%s | Remote Work Hub",
  },
  description:
    "Become a Professional Web Developer in 6 Weeks. First client guaranteed. Paid internship at Doctor Barns Tech. Top 2 students get hired. Starts April 20, 2026 in Accra, Ghana.",
  metadataBase: new URL(APP_URL),
  applicationName: "Remote Work Hub Masterclass",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: [
    "web development masterclass",
    "learn web development Ghana",
    "coding bootcamp Accra",
    "Doctor Barns Tech",
    "Remote Work Hub",
    "SaaS masterclass",
    "paid internship Ghana",
    "web developer training",
    "learn to code Accra",
    "web design training Ghana",
    "Next.js course Ghana",
    "React training Accra",
    "full stack developer course",
    "web development certificate Ghana",
    "coding school Accra Ghana",
    "tech training West Africa",
    "freelance web developer Ghana",
    "software engineering bootcamp",
  ],
  authors: [{ name: "Doctor Barns Tech", url: APP_URL }],
  creator: "Doctor Barns Tech",
  publisher: "Doctor Barns Tech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: APP_URL,
  },
  category: "Education",
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: APP_URL,
    siteName: "Remote Work Hub",
    title: "2026 Elite Web Development Masterclass — Remote Work Hub",
    description:
      "Become a professional web developer in 6 weeks. First client guaranteed. Paid internship included. Top 2 get hired by Doctor Barns Tech. GHS 2,200 — Accra, Ghana.",
    countryName: "Ghana",
  },
  twitter: {
    card: "summary_large_image",
    site: "@remoteworkhub",
    creator: "@remoteworkhub",
    title: "2026 Elite Web Development Masterclass — Remote Work Hub",
    description:
      "Become a professional web developer in 6 weeks. First client guaranteed. Paid internship. Top 2 get hired. GHS 2,200. Starts April 20, 2026.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Replace with your actual Search Console verification code after adding property
    // google: "your-google-site-verification-code",
  },
  other: {
    "msapplication-TileColor": "#2563EB",
    "geo.region": "GH-AA",
    "geo.placename": "Accra",
    "geo.position": "5.6037;-0.1870",
    ICBM: "5.6037, -0.1870",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#2563EB" />
        <link rel="canonical" href={APP_URL} />
        <StructuredData />
      </head>
      <body className={`${inter.variable} ${jakarta.variable} antialiased font-sans bg-white text-slate-900`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <PageViewTracker />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
