import { getApiDocs } from "@/lib/swagger";
import ReactSwagger from "./react-swagger";

// Page to display API documentation using Swagger UI
export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}