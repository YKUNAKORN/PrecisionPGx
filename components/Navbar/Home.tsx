import Link from "next/link";
import { Button } from "../ui/button";

const Home = () => {
  return (
    <Button size="sm" asChild variant="outline">
      <Link href="/Home" className="text-2xl">
        Home
      </Link>
    </Button>
  );
};
export default Home;
