import Link from "next/link";
import { Button } from "../ui/button";
import SamplesIcon from "../Icon/SamplesIcon";


const Samples = () => {
  return (
    <div className="flex flex-col items-center gap-1">

    <Button size="sm" asChild variant="ghost" className="size-12 hover:bg-primary ">
    

      <Link href="/Dashboard/Samples" className="text-3xl">
      <div className="item-center ">
        <SamplesIcon />
      </div>
      </Link>
    </Button>
      Samples
    </div>
    
  );
};
export default Samples;
