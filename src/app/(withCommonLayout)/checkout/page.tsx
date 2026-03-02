import Checkout from "@/components/checkout/Checkout";
import Loading from "@/components/ui/Loading";
import { Suspense } from "react";

export default function CheckoutPage() {
  return (
    <div>
      <Suspense
        fallback={
          <div>
            <Loading />
          </div>
        }
      >
        <Checkout />{" "}
      </Suspense>{" "}
    </div>
  );
}
