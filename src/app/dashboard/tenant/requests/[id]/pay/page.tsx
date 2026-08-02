"use client";

import { useParams, useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { useRentalRequest } from "@/hooks/useRentals";
import { useCreatePaymentSession } from "@/hooks/usePayments";
import { Card, Skeleton } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

export default function PayForRentalPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: rentalRequest, isLoading } = useRentalRequest(id);
  const createSession = useCreatePaymentSession();

  const handlePay = () => {
    createSession.mutate(id, {
      onSuccess: (data) => {
        // Redirect to Stripe's hosted Checkout page.
        window.location.href = data.checkoutUrl;
      },
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!rentalRequest) {
    return (
      <div className="mx-auto max-w-md px-4 py-10 text-center text-sm text-gray-500">
        Rental request not found.
      </div>
    );
  }

  if (rentalRequest.status !== "PAYMENT_DUE") {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <Card className="p-6 text-center text-sm text-gray-500">
          This rental request isn&apos;t awaiting payment (current status:{" "}
          <span className="font-medium">{rentalRequest.status}</span>).
          <div className="mt-4">
            <Button variant="outline" onClick={() => router.push("/dashboard/tenant")}>
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card className="p-6">
        <CreditCard className="mb-4 h-8 w-8 text-brand-600" />
        <h1 className="mb-1 text-lg font-semibold text-gray-900">Complete Your Payment</h1>
        <p className="mb-6 text-sm text-gray-500">
          {rentalRequest.property?.title} · {rentalRequest.durationMonths} month(s)
        </p>

        <div className="mb-6 flex items-center justify-between rounded-xl bg-gray-50 p-4">
          <span className="text-sm text-gray-500">Total due</span>
          <span className="text-xl font-semibold text-gray-900">
            {formatCurrency(rentalRequest.property?.price ?? 0)}
          </span>
        </div>

        <Button className="w-full" size="lg" onClick={handlePay} isLoading={createSession.isPending}>
          Pay with Stripe
        </Button>
        <p className="mt-3 text-center text-xs text-gray-400">
          You&apos;ll be redirected to Stripe&apos;s secure checkout page.
        </p>
      </Card>
    </div>
  );
}
