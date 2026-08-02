import Link from "next/link";
import { XCircle } from "lucide-react";
import { Card } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <Card className="w-full p-8">
        <XCircle className="mx-auto mb-4 h-12 w-12 text-amber-500" />
        <h1 className="mb-1 text-lg font-semibold text-gray-900">Payment Cancelled</h1>
        <p className="mb-6 text-sm text-gray-500">
          No charge was made. You can try again anytime from your dashboard.
        </p>
        <Link href="/dashboard/tenant">
          <Button className="w-full">Back to Dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}
