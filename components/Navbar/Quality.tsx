'use client'

import Link from "next/link";
import { Button } from "../ui/button";
import AccountIcon from "../Icon/AccountIcon";
import { usePathname } from "next/navigation";
import QualityIcon from "../Icon/QualityIcon";

const Account = () => {
  const pathname = usePathname();
  const isActive = pathname === "/Dashboard/Quality";

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        size="sm"
        asChild
        variant="ghost"
        className={[
          "w-18 h-13  !rounded-3xl  transition",
          isActive
            ? "text-white bg-[#574883] hover:bg-[#574883]" 
            : "hover:bg-[#574883] hover:text-white ",
        ].join(" ")}
      >
        <Link href="/Dashboard/Quality" className="text-2xl">
          <QualityIcon />
        </Link>
      </Button>

      <span className="text-xs font-medium">Quality</span>
    </div>
  );
};

export default Account;
