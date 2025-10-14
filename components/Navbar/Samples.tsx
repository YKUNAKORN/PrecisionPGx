import Link from "next/link";
import { Button } from "../ui/button";

const Samples = () => {
  return (
    <Button size="sm" asChild>
      <Link href="/" className="text-2xl">
        Samples
      </Link>
    </Button>
  );
};
export default Samples;
