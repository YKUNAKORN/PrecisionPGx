// components/NavItem.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

type Props = {
  href: string;
  icon: LucideIcon;      // ไอคอนจาก lucide-react
  label: string;
  size?: number;         // ขนาดไอคอน (px)
  exact?: boolean;       // match แบบเป๊ะ ๆ หรือ prefix
};

export default function NavItem({ href, icon: Icon, label, size = 28, exact = false }: Props) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <li className="flex flex-col items-center gap-1">
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className="group flex flex-col items-center"
      >
        {/* วนปกคลุมเฉพาะ 'ไอคอน' ให้มีพื้นหลังวงรีตอน active */}
        <span
          className={[
            // ขนาดพื้นที่คลิกไอคอน
            "w-14 h-10 rounded-2xl flex items-center justify-center",
            // hover นุ่ม ๆ
            "hover:bg-white/5",
            // สถานะ active = มีพื้นหลังแบบภาพแรก
            isActive ? "bg-white/10 ring-1 ring-white/20" : "",
            // transition
            "transition-colors"
          ].join(" ")}
        >
          <Icon size={size} className="shrink-0" />
        </span>

        <span className="text-[11px] leading-none text-zinc-200 mt-1">
          {label}
        </span>
      </Link>
    </li>
  );
}
