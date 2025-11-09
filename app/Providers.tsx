"use client";

import React, { ReactNode, useState } from "react";
import { ThemeProvider } from "./theme-provder";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({ children }: { children: ReactNode }) {
  // ✅ สร้าง QueryClient หนึ่งตัวต่อการ mount
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={true}
        disableTransitionOnChange
        storageKey="theme"
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

