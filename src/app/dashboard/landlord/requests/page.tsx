"use client";

import { useState } from "react";
import { useLandlordRequests, useUpdateRequestStatus } from "@/hooks/useRentals";
import { Card, Badge, Skeleton } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { formatDate } from "@/lib/utils";

export default function LandlordRequestsPage() {
  const { data: requests, isLoading, isError } = useLandlordRequests();
  const updateStatus = useUpdateRequestStatus();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-semibold text-gray-900">Incoming Requests</h1>
      <p className="mb-8 text-sm text-gray-500">Approve or reject rental requests for your properties.</p>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">Couldn&apos;t load requests.</p>
      )}

      {requests && requests.length === 0 && (
        <Card className="p-6 text-center text-sm text-gray-500">No rental requests yet.</Card>
      )}

      <div className="space-y-3">
        {requests?.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-gray-900">{r.property?.title}</p>
                <p className="text-sm text-gray-500">
                  From {r.tenant?.name} ({r.tenant?.email}) · Move-in {formatDate(r.moveInDate)}
                </p>
                {r.message && <p className="mt-1 text-sm text-gray-500 italic">&ldquo;{r.message}&rdquo;</p>}
              </div>
              <Badge status={r.status} />
            </div>

            {r.status === "PENDING" && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  size="sm"
                  isLoading={updateStatus.isPending}
                  onClick={() => updateStatus.mutate({ id: r.id, status: "APPROVED" })}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setRejectingId(rejectingId === r.id ? null : r.id)}
                >
                  Reject
                </Button>
              </div>
            )}

            {r.status === "PAYMENT_DUE" && (
              <p className="mt-3 text-xs text-gray-400">
                Approved — waiting for the tenant to complete payment via Stripe.
              </p>
            )}
            {r.status === "REJECTED" && (
              <p className="mt-3 text-xs text-gray-400">You rejected this request.</p>
            )}
            {r.status === "ACTIVE" && (
              <p className="mt-3 text-xs text-green-600">Payment received — this rental is active.</p>
            )}

            {rejectingId === r.id && (
              <div className="mt-3 space-y-2">
                <Textarea
                  placeholder="Reason for rejection (optional)"
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <Button
                  size="sm"
                  variant="danger"
                  isLoading={updateStatus.isPending}
                  onClick={() =>
                    updateStatus.mutate(
                      { id: r.id, status: "REJECTED", rejectReason: reason || undefined },
                      { onSuccess: () => setRejectingId(null) }
                    )
                  }
                >
                  Confirm Rejection
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
