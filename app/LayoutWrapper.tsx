// app/LayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ✅ หน้าเหล่านี้จะซ่อน Navbar
  const hideNavbar = ["/login", "/register", "/api-doc"].includes(pathname);

  return (
    <div className="flex min-h-dvh">
      {/* ✅ แสดง Navbar เฉพาะเมื่อไม่อยู่ในหน้าที่ซ่อน */}
      {!hideNavbar && <Navbar />}

      {/* ✅ ถ้ามี Navbar → ขยับ content ออกด้วย pl-20 */}
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
