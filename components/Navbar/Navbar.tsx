import Account from "./Account"
import { Darkmode } from "./Darkmode"
import Home from "./Home"
import Interpret from "./Interpret"
import Logo from "./Logo"
import Quality from "./Quality"
import Register from "./Register"
import Samples from "./Samples"


const Navbar = () => {
  return (
    <aside className="flex flex-col justify-between items-center h-screen w-20 border-r">

    <nav  className="flex flex-col justify-between gap-6">
        <div>
            <Logo/>
            <Home/>
            <Register/>
            <Interpret/>
            <Quality/>
            <Samples/>
            

        </div>
    </nav>
    <nav className="mb-6 flex flex-col items-center gap-1">
        <Darkmode/>
        <Account/>
        
      </nav>
    

    </aside>
  )
}
export default Navbar