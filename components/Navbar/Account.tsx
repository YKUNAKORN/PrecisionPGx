import Link from "next/link";
import { Button } from "../ui/button";

const Account = () => {
  return (
    <Button size="sm" asChild>
      <Link href="/" className="text-2xl">
         <span className="text-xs text-">
          Account
          </span>
      </Link>
    </Button>
  );
};
export default Account;
