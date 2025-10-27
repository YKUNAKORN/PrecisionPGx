// import Link from "next/link";
// import { Button } from "../ui/button";

// const Logo = () => {
//   return (
//     <Button size="sm" asChild variant="outline">
//       <Link href="/Dashboard/" className="text-2xl">
//         Logo 
//       </Link>
//     </Button>
//   );
// };
// export default Logo;

import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <header className="flex items-center p-4">
      <Link href="/" className="flex items-center">
        <Image src="/Logo Version 2 Varient 1.png" alt="Logo" width={50} height={50} />
      </Link>
      <span className="ml-3 text-lg font-semibold"></span>
    </header>
  );
}