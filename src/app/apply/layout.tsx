import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply Now — Elite Web Development Masterclass",
  description:
    "Apply for the April 2026 Elite 6-Week Web Development Masterclass. No experience needed. GHS 2,200 total. Deposit options available. Paid internship, first client guaranteed, top 2 get hired. Accra, Ghana.",
  alternates: {
    canonical: "https://remoteworkhub.org/apply",
  },
  openGraph: {
    title: "Apply Now — Remote Work Hub Masterclass",
    description:
      "Apply for the 6-week intensive web development masterclass starting April 20, 2026. GHS 2,200 total. Paid internship included. Top 2 get hired.",
    url: "https://remoteworkhub.org/apply",
  },
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
