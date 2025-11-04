'use client'

import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import SamplesIcon from "../Icon/SamplesIcon";

const Account = () => {
  const pathname = usePathname();
  const isActive = pathname === "/Dashboard/Samples";

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        size="sm"
        asChild
        variant="ghost"
        className={[
          "w-18 h-13   !rounded-3xl transition",
          // ✅ ถ้า path ตรงกับหน้าปัจจุบัน ให้แสดงสไตล์ active
          isActive
            ? "bg-primary text-white"
            : "hover:bg-primary hover:text-white",
        ].join(" ")}
      >
        <Link href="/Dashboard/Samples" className="text-2xl">
          <SamplesIcon />
        </Link>
      </Button>

      <span className="text-xs font-medium">Samples</span>
    </div>
  );
};

export default Account;
