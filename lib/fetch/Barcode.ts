// /lib/queries/Barcode.ts
import { queryOptions } from "@tanstack/react-query";

export async function getBarcode(patientId: string) {
  const res = await fetch(`/api/user/barcode?patientId=${encodeURIComponent(patientId)}`);
  if (!res.ok) throw new Error("Failed to fetch barcode");
  return res.json() as Promise<{
    status: string;
    message: string;
    data: { patientId: string; base64: string } | null;
  }>;
}

export default function createBarcodeQueryOptions(patientId: string) {
  return queryOptions({
    queryKey: ["barcode", patientId], // ผูก cache ต่อคน
    queryFn: () => getBarcode(patientId),
  });
}
