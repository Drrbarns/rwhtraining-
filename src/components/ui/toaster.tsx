"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "white",
          border: "1px solid rgba(226, 232, 240, 0.6)",
          borderRadius: "16px",
          boxShadow: "0 8px 30px -4px rgba(0, 0, 0, 0.08)",
          padding: "16px",
          fontSize: "13px",
          fontWeight: "600",
        },
      }}
      richColors
      closeButton
    />
  );
}
