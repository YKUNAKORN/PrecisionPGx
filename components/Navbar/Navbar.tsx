// components/Navbar/Navbar.tsx
"use client";

import Account from "./Account";
// import { Darkmode } from "./Darkmode";
import Home from "./Home";
import Interpret from "./Interpret";
import Logo from "./Logo";
import Quality from "./Quality";
import Register from "./Register";
import Samples from "./Samples";

export default function Navbar() {
  return (
      <aside
        className="fixed top-0 left-0 h-dvh w-21 border-r-[0.5px]
                  flex flex-col justify-between items-center p-4 "
      >
        <nav aria-label="Primary" className="flex flex-col items-center gap-10  ">
          <Logo />
          <Home />
          <Register />
          <Interpret />
          <Quality />
          <Samples />
          <Account/>
        </nav>

        <nav aria-label="Utilities" className="mb-2 flex flex-col items-center gap-2  ">
          {/* <div className="size-10"><Darkmode /></div> */}
        </nav>
      </aside>
  );
}
