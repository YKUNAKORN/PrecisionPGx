import Account from "./Account"
import { Darkmode } from "./Darkmode"
import Home from "./Home"
import Interpret from "./Interpret"
import Logo from "./Logo"
import Quality from "./Quality"
import Register from "./Register"
import Samples from "./Samples"


// components/Navbar/Navbar.tsx
export default function Navbar() {
  return (
    <aside
        className="shrink-0 sticky top-0 h-dvh w-20 border-r border-white/10 
                  flex flex-col justify-between items-center p-3"
    >
      <nav aria-label="Primary" className="flex flex-col items-center gap-10">
        <Logo/>
        <Home/>
        <Register/>
        <Interpret/>
        <Quality/>
        <Samples/>
      </nav>

      <nav aria-label="Utilities" className="mb-2 flex flex-col items-center gap-2">
        <Darkmode/>
        <Account/>
      </nav>
      
    </aside>
  );
}
