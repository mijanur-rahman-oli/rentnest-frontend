"use client";

import { useState } from "react";
import { useProperties, type PropertyFilters } from "@/hooks/useProperties";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyFiltersBar } from "@/components/PropertyFiltersBar";
import { Skeleton } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";

export default function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFilters>({ page: 1, limit: 9 });
  const { data, isLoading, isError } = useProperties(filters);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Browse Properties</h1>

      <PropertyFiltersBar initial={filters} onApply={(f) => setFilters({ ...f, page: 1, limit: 9 })} />

      <div className="mt-8">
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        )}

        {isError && (
          <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
            Couldn&apos;t load properties. Please try again.
          </p>
        )}

        {data && data.properties.length === 0 && (
          <p className="text-sm text-gray-500">No properties match your filters.</p>
        )}

        {data && data.properties.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={data.pagination.page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {data.pagination.page} of {data.pagination.totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={data.pagination.page >= data.pagination.totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
