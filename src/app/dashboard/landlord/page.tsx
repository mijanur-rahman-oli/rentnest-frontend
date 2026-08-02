"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2, Home, ListChecks, Wallet, Users, ClipboardList } from "lucide-react";
import { useMyProperties, useDeleteProperty } from "@/hooks/useProperties";
import { useLandlordRequests } from "@/hooks/useRentals";
import { Card, Badge, Skeleton } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function LandlordDashboardPage() {
  const { data: properties, isLoading } = useMyProperties();
  const { data: requests } = useLandlordRequests();
  const deleteProperty = useDeleteProperty();

  const pendingCount = requests?.filter((r) => r.status === "PENDING").length ?? 0;
  const earnings = requests
    ?.filter((r) => r.status === "ACTIVE" || r.status === "COMPLETED")
    .reduce((sum, r) => sum + (r.property?.price ?? 0), 0) ?? 0;
  const tenantHistory =
    requests?.filter((r) => r.status === "ACTIVE" || r.status === "COMPLETED") ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Landlord Dashboard</h1>
          <p className="text-sm text-gray-500">Manage your listings and rental requests.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/landlord/requests">
            <Button variant="outline">
              <ClipboardList className="h-4 w-4" />
              View Requests
              {pendingCount > 0 && (
                <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  {pendingCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/dashboard/landlord/properties/new">
            <Button>
              <Plus className="h-4 w-4" />
              New Listing
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-3 p-4">
          <Home className="h-8 w-8 text-brand-600" />
          <div>
            <p className="text-xs text-gray-500">Total Properties</p>
            <p className="text-xl font-semibold text-gray-900">{properties?.length ?? 0}</p>
          </div>
        </Card>
        <Link href="/dashboard/landlord/requests">
          <Card className="flex items-center gap-3 p-4 transition-shadow hover:shadow-md">
            <ListChecks className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-xs text-gray-500">Pending Requests</p>
              <p className="text-xl font-semibold text-gray-900">{pendingCount}</p>
            </div>
          </Card>
        </Link>
        <Card className="flex items-center gap-3 p-4">
          <Wallet className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-xs text-gray-500">Active Rental Value</p>
            <p className="text-xl font-semibold text-gray-900">{formatCurrency(earnings)}</p>
          </div>
        </Card>
      </div>

      <h2 className="mb-3 font-semibold text-gray-900">Your Properties</h2>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      )}

      {properties && properties.length === 0 && (
        <Card className="p-6 text-center text-sm text-gray-500">
          You haven&apos;t listed any properties yet.
        </Card>
      )}

      <div className="space-y-3">
        {properties?.map((property) => (
          <Card key={property.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium text-gray-900">{property.title}</p>
              <p className="text-sm text-gray-500">
                {property.city} · {formatCurrency(property.price)}/mo
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge status={property.status} />
              <Link href={`/dashboard/landlord/properties/${property.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (confirm("Remove this listing? This cannot be undone.")) {
                    deleteProperty.mutate(property.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 mt-10 flex items-center gap-2 font-semibold text-gray-900">
        <Users className="h-4 w-4" />
        Tenant History
      </h2>
      <p className="mb-3 text-sm text-gray-500">Everyone who has rented (or is currently renting) from you.</p>

      {tenantHistory.length === 0 ? (
        <Card className="p-6 text-center text-sm text-gray-500">No tenant history yet.</Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Tenant</th>
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Move-in</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {tenantHistory.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{r.tenant?.name}</p>
                    <p className="text-xs text-gray-400">{r.tenant?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{r.property?.title}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(r.moveInDate)}</td>
                  <td className="px-4 py-3 text-gray-500">{r.durationMonths} months</td>
                  <td className="px-4 py-3">
                    <Badge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
