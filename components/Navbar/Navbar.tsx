"use client";

import Account from "./Account";
import Home from "./Home";
import Interpret from "./Interpret";
import Logo from "./Logo";
import Quality from "./Quality";
import Register from "./Register";
import Samples from "./Samples";

export default function Navbar() {
  return (
      <aside
        className="fixed top-0 left-0 h-dvh w-21 border-r-[1px] flex flex-col justify-between items-center p-4 border-[#B8A8D8]" style={{ boxShadow: '0 0 5px rgba(74, 67, 89, 1)' }}>
        <nav aria-label="Primary" className="flex flex-col items-center gap-5">
          <Logo />
          <Home />
          <Register />
          <Interpret />
          <Quality />
          <Samples />
          <Account/>
        </nav>


      </aside>
  );
}
