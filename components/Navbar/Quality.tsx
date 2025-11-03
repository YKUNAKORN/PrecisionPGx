import Link from "next/link";
import { Button } from "../ui/button";
import QualityIcon from "../Icon/QualityIcon";

const Quality = () => {
  return (
    <div className="flex flex-col items-center gap-1">

    <Button size="sm" asChild variant="ghost" className="size-12 w-12 h-12 hover:bg-primary">
      <Link href="/Dashboard/Quality" className="text-2xl">
      <QualityIcon/>
      </Link>
    </Button>
        Quality
    </div>
  );
};
export default Quality;
