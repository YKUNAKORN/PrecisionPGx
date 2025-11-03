import { queryOptions } from "@tanstack/react-query";

export async function getBarcode() {
  const res = await fetch(`/api/barcode`);
  if (!res.ok) throw new Error("Failed to fetch Barcode");
  return res.json();
}

export default function createBarcodeQueryOptions() {
  return queryOptions({
    queryKey: ["Barcode"],
    queryFn: () => getBarcode(),
  });
}