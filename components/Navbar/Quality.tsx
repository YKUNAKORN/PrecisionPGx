import Link from "next/link";
import { Button } from "../ui/button";

const Quality = () => {
  return (
    <Button size="sm" asChild>
      <Link href="/Quality" className="text-2xl">
        Quality
      </Link>
    </Button>
  );
};
export default Quality;
