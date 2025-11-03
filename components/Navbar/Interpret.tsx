import Link from "next/link"
import { Button } from "../ui/button"
import InterpretIcon from "../Icon/InterpretIcon"

const Interpret = () => {
  return (
    <div className="flex flex-col items-center gap-1">

    <Button size='sm' asChild variant='outline' className="size-12 w-12 h-12 hover:bg-primary">
        <Link href ="/Dashboard/Interpret" className = "text-2xl">
        <InterpretIcon/>
        </Link>
    </Button>
        Interpret
    </div>
  )
}
export default Interpret