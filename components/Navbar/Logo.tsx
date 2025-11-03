
// // "use client";

// // import Link from "next/link";
// // import Image from "next/image";

// // export default function Logo() {
// //   return (
// //     <div className="flex items-center justify-center pt-4">
// //       <Link
// //         href="/"
// //         aria-label="Homepage"
// //         className="grid place-items-center size-12 rounded-xl"
// //       >
// //         {/* 🌞 Light mode */}
// //         <span className="block dark:hidden">
// //           <Image
// //             src="/logo-light.png"
// //             alt="Logo (light)"
// //             width={48}
// //             height={48}
// //             className="object-contain size-12 rounded"
// //             priority
// //           />
// //         </span>

// //         {/* 🌙 Dark mode */}
// //         <span className="hidden dark:block">
// //           <Image
// //             src="/logo-dark.png"
// //             alt="Logo (dark)"
// //             width={48}
// //             height={48}
// //             className="object-contain size-12 rounded"
// //             priority
// //           />
// //         </span>
// //       </Link>
// //     </div>
// //   );
// // }


// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useTheme } from "next-themes";

// export default function Logo() {
//   const { theme, systemTheme } = useTheme();
//   const currentTheme = theme === "system" ? systemTheme : theme;

//   const logoSrc =
//     currentTheme === "dark"
//       ? "/logo-dark.png"
//       : "/logo-light.png";

//   return (
//     <div className="flex items-center justify-center pt-4">
//       <Link
//         href="/"
//         aria-label="Homepage"
//         className="grid place-items-center size-12 rounded-xl"
//       >
//         <Image
//           src={logoSrc}
//           alt="Logo"
//           width={48}
//           height={48}
//           className="object-contain size-12 rounded"
//           priority
//         />
//       </Link>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import * as React from "react";

const LOGO_LIGHT = "/logo-light.png";
const LOGO_DARK = "/logo-dark.png";

export default function Logo() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // ให้รอจนกว่าจะ mount ก่อนค่อยใช้ค่าธีมจริง
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // ตอน SSR หรือยังไม่ mount → ให้ใช้รูป light ไปก่อน
  let logoSrc = LOGO_LIGHT;

  if (mounted) {
    const currentTheme = theme === "system" ? systemTheme : theme;
    logoSrc = currentTheme === "dark" ? LOGO_DARK : LOGO_LIGHT;
  }

  return (
    <div className="flex items-center justify-center pt-4">
      <Link
        href="/"
        aria-label="Homepage"
        className="grid place-items-center size-12 rounded-xl"
      >
        <Image
          src={logoSrc}
          alt="Logo"
          width={48}
          height={48}
          className="object-contain size-12 rounded"
          priority
        />
      </Link>
    </div>
  );
}

