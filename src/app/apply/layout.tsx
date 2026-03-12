import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply Now — Elite Web Development Masterclass",
  description:
    "Apply for the 2026 Elite Web Development & SaaS Masterclass. No experience needed. Start with GHS 200 deposit. Paid internship, first client guaranteed, top 2 get hired. Accra, Ghana.",
  alternates: {
    canonical: "https://remoteworkhub.org/apply",
  },
  openGraph: {
    title: "Apply Now — Remote Work Hub Masterclass",
    description:
      "Apply for the 30-day intensive web development masterclass. GHS 1,000 total. Start with just GHS 200. Paid internship included.",
    url: "https://remoteworkhub.org/apply",
  },
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
