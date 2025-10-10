import Link from "next/link";
import { Button } from "../ui/button";

const Account = () => {
  return (
    <Button size="sm" asChild variant="outline">
      <Link href="/Account" className="text-2xl">
         <span className="text-xs text-">
          Account
          </span>
      </Link>
    </Button>
  );
};
export default Account;
