import Link from "next/link";
import { Button } from "../ui/button";
import QualityIcon from "../Icon/QualityIcon";

const Quality = () => {
  return (
    <div className="flex flex-col items-center gap-1">

    <Button size="sm" asChild variant="outline" className="size-12 w-12 h-12">
      <Link href="/Dashboard/Quality" className="text-2xl">
      <QualityIcon/>
      </Link>
    </Button>
        Quality
    </div>
  );
};
export default Quality;
