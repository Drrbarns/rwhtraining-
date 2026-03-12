import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Remote Work Hub | 2026 Elite Web Development & SaaS Masterclass",
  description: "Become a Professional Web Developer & Get Your First Paying Client in 30 Days. 1-Month Paid Internship at Doctor Barns Tech included.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${jakarta.variable} ${playfair.variable} antialiased font-sans bg-[#0A0A0A] text-gray-100`}>
        {children}
      </body>
    </html>
  );
}
