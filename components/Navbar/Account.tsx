'use client'

import Link from "next/link";
import { Button } from "../ui/button";
import AccountIcon from "../Icon/AccountIcon";
import { usePathname } from "next/navigation";

const Account = () => {
  const pathname = usePathname();
  const isActive = pathname === "/Dashboard/Account";

  return (
    <div className="flex flex-col items-center gap-1 ">
      <Button
        size="sm"
        asChild
        variant="ghost"
        className={[
          "w-18 h-13   !rounded-3xl transition",
          isActive
            ? "bg-primary text-white hover:bg-[#8123FE]"
            : "hover:bg-primary hover:text-white",
        ].join(" ")}
      >
        <Link href="/Dashboard/Account" className="text-2xl">
          <AccountIcon />
        </Link>
      </Button>

      <span className="text-xs font-medium">Account</span>
    </div>
  );
};

export default Account;
