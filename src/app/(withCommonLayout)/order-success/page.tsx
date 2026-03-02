import OrderSuccess from "@/components/orderSuccess/OrderSuccess";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950" />}>
      <OrderSuccess />
    </Suspense>
  );
}
