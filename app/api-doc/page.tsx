import { getApiDocs } from "@/lib/swagger";
import ReactSwagger from "./react-swagger";
import React from "react";

// Page to display API documentation using Swagger UI
// Note: StrictMode is intentionally not used here to avoid warnings from swagger-ui-react
// which uses legacy React lifecycle methods (UNSAFE_componentWillReceiveProps)
export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="w-full">
      <ReactSwagger spec={spec} />
    </section>
  );
}