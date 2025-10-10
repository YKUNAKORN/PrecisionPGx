import Link from "next/link";
import { Button } from "../ui/button";

const Register = () => {
  return (
    <Button size="sm" asChild variant="outline">
      <Link href="/Register" className="text-2xl">
        Register
      </Link>
    </Button>
  );
};
export default Register;
