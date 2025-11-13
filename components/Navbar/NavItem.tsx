"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

type Props = {
  href: string;
  icon: LucideIcon;
  label: string;
  size?: number;
  exact?: boolean;
};

export default function NavItem({
  href,
  icon: Icon,
  label,
  size = 28,
  exact = false,
}: Props) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <li className="flex flex-col items-center gap-1">
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className="group flex flex-col items-center"
      >
        <span
          className={[
            "w-14 h-10 rounded-2xl flex items-center justify-center",
            // hover นุ่ม ๆ
            "",
            // สถานะ active = มีพื้นหลังแบบภาพแรก
            isActive ? "ring-1 ring-white/20" : "",
            // transition
            " ",
          ].join(" ")}
        >
          <Icon size={size} className="" />
        </span>

        <span className="text-[11px] leading-none text-zinc-200 mt-1">
          {label}
        </span>
      </Link>
    </li>
  );
}
