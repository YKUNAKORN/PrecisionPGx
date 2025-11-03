import Link from "next/link";
import { Button } from "../ui/button";
import { HomeIcon } from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col items-center gap-1">

    <Button size="sm" asChild variant="outline" className="size-12 w-12 h-12 hover:bg-primary">
      <Link href="/" className="text-2xl">
        <HomeIcon/>
      </Link>
    </Button>
        Home
    </div>
  );
};
export default Home;
