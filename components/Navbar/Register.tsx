import Link from "next/link";
import { Button } from "../ui/button";
import RegisterIcon from "../Icon/RegisterIcon";

const Register = () => {
  return (
    
    <div className="flex flex-col items-center gap-1">
    <Button size="sm" asChild variant="ghost" className="size-12 w-12 h-12 hover:bg-primary">
      <Link href="/Dashboard/Register" className="text-2xl">
      <RegisterIcon/>
      </Link>
    </Button>
        Register
    </div>
  );
};
export default Register;
