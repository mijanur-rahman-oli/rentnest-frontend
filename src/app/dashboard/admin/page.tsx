"use client";

import { useMemo, useState } from "react";
import { Users, Home, ListChecks, Search } from "lucide-react";
import { useAdminUsers, useAdminProperties, useAdminRentals, useUpdateUserStatus } from "@/hooks/useAdmin";
import { Card, Badge, Skeleton } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

type Tab = "overview" | "users" | "properties" | "rentals";

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const { data: users, isLoading: loadingUsers } = useAdminUsers();
  const { data: properties, isLoading: loadingProperties } = useAdminProperties();
  const { data: rentals, isLoading: loadingRentals } = useAdminRentals();

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "users", label: "Users" },
    { key: "properties", label: "Properties" },
    { key: "rentals", label: "Rentals" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
      <p className="mb-6 text-sm text-gray-500">Platform-wide oversight and moderation.</p>

      <div className="mb-8 flex gap-2 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              tab === t.key ? "border-brand-600 text-brand-700" : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="flex items-center gap-3 p-4">
            <Users className="h-8 w-8 text-brand-600" />
            <div>
              <p className="text-xs text-gray-500">Total Users</p>
              <p className="text-xl font-semibold text-gray-900">{users?.length ?? "—"}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3 p-4">
            <Home className="h-8 w-8 text-brand-600" />
            <div>
              <p className="text-xs text-gray-500">Total Properties</p>
              <p className="text-xl font-semibold text-gray-900">{properties?.length ?? "—"}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3 p-4">
            <ListChecks className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-xs text-gray-500">Pending Requests</p>
              <p className="text-xl font-semibold text-gray-900">
                {rentals?.filter((r) => r.status === "PENDING").length ?? "—"}
              </p>
            </div>
          </Card>
        </div>
      )}

      {tab === "users" && <UsersTable users={users} isLoading={loadingUsers} />}
      {tab === "properties" && <PropertiesTable properties={properties} isLoading={loadingProperties} />}
      {tab === "rentals" && <RentalsTable rentals={rentals} isLoading={loadingRentals} />}
    </div>
  );
}

function UsersTable({ users, isLoading }: { users?: ReturnType<typeof useAdminUsers>["data"]; isLoading: boolean }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const updateStatus = useUpdateUserStatus();

  const filtered = useMemo(
    () =>
      (users || []).filter(
        (u) => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())
      ),
    [users, query]
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name or email…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
        />
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((u) => (
              <tr key={u.id} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">{u.role}</td>
                <td className="px-4 py-3">
                  <Badge status={u.status} />
                </td>
                <td className="px-4 py-3">
                  {u.role !== "ADMIN" && (
                    <Button
                      size="sm"
                      variant={u.status === "ACTIVE" ? "danger" : "secondary"}
                      isLoading={updateStatus.isPending}
                      onClick={() =>
                        updateStatus.mutate({ id: u.id, status: u.status === "ACTIVE" ? "BANNED" : "ACTIVE" })
                      }
                    >
                      {u.status === "ACTIVE" ? "Ban" : "Unban"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="mt-4 flex items-center justify-center gap-3">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </Button>
        <span className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </span>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

function PropertiesTable({
  properties,
  isLoading,
}: {
  properties?: ReturnType<typeof useAdminProperties>["data"];
  isLoading: boolean;
}) {
  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <Card className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-100 text-gray-500">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">City</th>
            <th className="px-4 py-3 font-medium">Landlord</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {properties?.map((p) => (
            <tr key={p.id} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3">{p.title}</td>
              <td className="px-4 py-3 text-gray-500">{p.city}</td>
              <td className="px-4 py-3 text-gray-500">{p.landlord?.name}</td>
              <td className="px-4 py-3">{formatCurrency(p.price)}</td>
              <td className="px-4 py-3">
                <Badge status={p.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function RentalsTable({
  rentals,
  isLoading,
}: {
  rentals?: ReturnType<typeof useAdminRentals>["data"];
  isLoading: boolean;
}) {
  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <Card className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-100 text-gray-500">
          <tr>
            <th className="px-4 py-3 font-medium">Property</th>
            <th className="px-4 py-3 font-medium">Tenant</th>
            <th className="px-4 py-3 font-medium">Move-in</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rentals?.map((r) => (
            <tr key={r.id} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3">{r.property?.title}</td>
              <td className="px-4 py-3 text-gray-500">{r.tenant?.name}</td>
              <td className="px-4 py-3 text-gray-500">{formatDate(r.moveInDate)}</td>
              <td className="px-4 py-3">
                <Badge status={r.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
