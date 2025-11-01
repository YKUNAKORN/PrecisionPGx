// "use client";

// import Link from "next/link";
// import Image from "next/image";

// export default function Logo() {
//   return (
//     <header className="flex items-center p-4">
//       <Link
//         href="/"
//         className="grid place-items-center size-12 rounded-xl"
//         aria-label="Homepage"
//       >
//         {/* 🌞 Light Mode Logo */}
//         <Image
//           src="/logo-light.png"
//           alt="Logo Light"
//           width={100}
//           height={100}
//           className="object-contain size-12 rounded-xl block dark:hidden"
//           priority
//         />

//         {/* 🌙 Dark Mode Logo */}
//         <Image
//           src="/logo-dark.png"
//           alt="Logo Dark"
//           width={100}
//           height={100}
//           className="object-contain size-12 rounded-xl hidden dark:block"
//           priority
//         />
//       </Link>
//     </header>
//   );
// }

"use client";

import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center justify-center pt-4">
      <Link
        href="/"
        aria-label="Homepage"
        className="grid place-items-center size-12 rounded-xl"
      >
        {/* 🌞 Light mode */}
        <span className="block dark:hidden">
          <Image
            src="/logo-light.png"
            alt="Logo (light)"
            width={48}
            height={48}
            className="object-contain size-12 rounded"
            priority
          />
        </span>

        {/* 🌙 Dark mode */}
        <span className="hidden dark:block">
          <Image
            src="/logo-dark.png"
            alt="Logo (dark)"
            width={48}
            height={48}
            className="object-contain size-12 rounded"
            priority
          />
        </span>
      </Link>
    </div>
  );
}
