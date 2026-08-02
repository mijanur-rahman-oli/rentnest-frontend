"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useConfirmPayment } from "@/hooks/usePayments";
import { Card } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { ReviewForm } from "@/components/ReviewForm";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const confirmPayment = useConfirmPayment();
  const [status, setStatus] = useState<"confirming" | "success" | "error">("confirming");
  const [rentalRequestId, setRentalRequestId] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }
    confirmPayment.mutate(sessionId, {
      onSuccess: (payment) => {
        setRentalRequestId(payment.rentalRequestId);
        setStatus("success");
      },
      onError: () => setStatus("error"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <Card className="w-full p-8">
        {status === "confirming" && (
          <>
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-brand-600" />
            <h1 className="mb-1 text-lg font-semibold text-gray-900">Confirming your payment…</h1>
            <p className="text-sm text-gray-500">This will just take a moment.</p>
          </>
        )}

        {status === "success" && !reviewed && (
          <>
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-500" />
            <h1 className="mb-1 text-lg font-semibold text-gray-900">Payment Successful!</h1>
            <p className="mb-6 text-sm text-gray-500">Your rental is now active.</p>
          </>
        )}

        {status === "success" && !reviewed && rentalRequestId && (
          <div className="mb-4 text-left">
            <p className="mb-2 text-center text-sm font-medium text-gray-700">
              Want to leave a quick review?
            </p>
            <ReviewForm rentalRequestId={rentalRequestId} onDone={() => setReviewed(true)} />
          </div>
        )}

        {status === "success" && (
          <div className="mt-4 space-y-2">
            {reviewed && <p className="text-sm text-green-600">Thanks for your review!</p>}
            <Link href="/dashboard/tenant">
              <Button variant={reviewed ? "primary" : "outline"} className="w-full">
                {reviewed ? "Go to Dashboard" : "Skip for now"}
              </Button>
            </Link>
          </div>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <h1 className="mb-1 text-lg font-semibold text-gray-900">Couldn&apos;t confirm payment</h1>
            <p className="mb-6 text-sm text-gray-500">
              We couldn&apos;t verify this payment automatically. If Stripe charged you, this will
              resolve shortly — check your dashboard in a minute.
            </p>
            <Link href="/dashboard/tenant">
              <Button variant="outline" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </>
        )}
      </Card>
    </div>
  );
}
