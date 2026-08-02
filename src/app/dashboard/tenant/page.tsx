"use client";

import { useState } from "react";
import Link from "next/link";
import { useMyRentalRequests } from "@/hooks/useRentals";
import { useMyPayments } from "@/hooks/usePayments";
import { Card, Badge, Skeleton } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ReviewForm } from "@/components/ReviewForm";

export default function TenantDashboardPage() {
  const { data: requests, isLoading: loadingRequests, isError: errorRequests } = useMyRentalRequests();
  const { data: payments, isLoading: loadingPayments } = useMyPayments();
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-semibold text-gray-900">Tenant Dashboard</h1>
      <p className="mb-8 text-sm text-gray-500">Track your rental requests, payments, and reviews.</p>

      <section className="mb-10">
        <h2 className="mb-3 font-semibold text-gray-900">Rental Requests</h2>

        {loadingRequests && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        )}

        {errorRequests && (
          <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">Couldn&apos;t load your requests.</p>
        )}

        {requests && requests.length === 0 && (
          <Card className="p-6 text-center text-sm text-gray-500">
            No rental requests yet.{" "}
            <Link href="/properties" className="text-brand-700 hover:underline">
              Browse properties
            </Link>{" "}
            to get started.
          </Card>
        )}

        <div className="space-y-3">
          {requests?.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-900">{r.property?.title ?? "Property"}</p>
                  <p className="text-sm text-gray-500">
                    Move-in {formatDate(r.moveInDate)} · {r.durationMonths} months
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={r.status} />
                  {r.status === "PAYMENT_DUE" && (
                    <Link href={`/dashboard/tenant/requests/${r.id}/pay`}>
                      <Button size="sm">Pay Now</Button>
                    </Link>
                  )}
                  {(r.status === "ACTIVE" || r.status === "COMPLETED") && (
                    <Button size="sm" variant="outline" onClick={() => setReviewingId(r.id)}>
                      Leave Review
                    </Button>
                  )}
                </div>
              </div>
              {r.status === "PENDING" && (
                <p className="mt-2 text-xs text-gray-400">
                  Waiting for the landlord to approve this request. You&apos;ll get a &ldquo;Pay Now&rdquo; button here once it&apos;s approved.
                </p>
              )}
              {r.status === "REJECTED" && r.rejectReason && (
                <p className="mt-2 text-xs text-red-500">Reason: {r.rejectReason}</p>
              )}
              {reviewingId === r.id && (
                <div className="mt-4">
                  <ReviewForm rentalRequestId={r.id} onDone={() => setReviewingId(null)} />
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-gray-900">Payment History</h2>

        {loadingPayments && <Skeleton className="h-32 w-full" />}

        {payments && payments.length === 0 && (
          <Card className="p-6 text-center text-sm text-gray-500">No payments yet.</Card>
        )}

        {payments && payments.length > 0 && (
          <Card className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Property</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3">{p.rentalRequest?.property?.title ?? "—"}</td>
                    <td className="px-4 py-3">{formatCurrency(p.amount, p.currency)}</td>
                    <td className="px-4 py-3">
                      <Badge status={p.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {p.paidAt ? formatDate(p.paidAt) : formatDate(p.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </section>
    </div>
  );
}
