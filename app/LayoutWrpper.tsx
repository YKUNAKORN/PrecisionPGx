"use client";
// Layout wrapper to decide which pages show the Navbar
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = ["/api-doc"].includes(pathname);// Add more paths as needed to hide the navbar

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main>{children}</main>
    </>
  );
}