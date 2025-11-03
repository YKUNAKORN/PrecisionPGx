import Link from "next/link";
import { Button } from "../ui/button";
import AccountIcon from "../Icon/AccountIcon";

const Account = () => {
  return (
    <div className="flex flex-col items-center gap-1">

    <Button size="sm" asChild variant="ghost" className="size-12 hover:bg-primary">
      <Link href="/Dashboard/Account" className="text-2xl">
      <AccountIcon />
      </Link>
    </Button>
         
          Account
          
    </div>
  );
};
export default Account;
