"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const timeout = setTimeout(() => {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          referrer: document.referrer || null,
        }),
        keepalive: true,
      }).catch(() => {});
    }, 100);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
