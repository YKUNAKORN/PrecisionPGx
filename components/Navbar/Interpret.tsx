import Link from "next/link"
import { Button } from "../ui/button"

const Interpret = () => {
  return (
    <Button size='sm' asChild >
        <Link href ="/" className = "text-2xl">
        Interpret
        </Link> 
    </Button>
  )
}
export default Interpret