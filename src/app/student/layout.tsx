import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "Access your Remote Work Hub Masterclass student dashboard, curriculum, payments, and profile.",
  robots: { index: false, follow: false },
};

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
