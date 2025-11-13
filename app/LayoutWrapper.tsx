"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";


export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = ["/", "/register", "/api-doc", "/reset-password", "/forgotpassword"].includes(pathname);

  return (
    <div className="flex min-h-dvh">
      {!hideNavbar && <Navbar />}

      <main
        className={`w-full overflow-y-auto ${
          hideNavbar ? "" : "pl-20"
        }`}
      >
        {children}
      </main>
    </div>
  );
}