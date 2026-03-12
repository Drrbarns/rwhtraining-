import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Remote Work Hub — Elite Web Development Masterclass",
    short_name: "RWH Masterclass",
    description:
      "Become a professional web developer in 30 days. Paid internship, first client guaranteed, top 2 get hired by Doctor Barns Tech.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#2563EB",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
