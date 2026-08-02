"use client";

import Link from "next/link";
import { useProperties } from "@/hooks/useProperties";
import { PropertyCard } from "@/components/PropertyCard";
import { Skeleton } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";

export default function HomePage() {
  const { data, isLoading, isError } = useProperties({ limit: 6 });

  return (
    <div>
      <section className="border-b border-gray-200 bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Find & List Rental Properties <span className="text-brand-600">with Ease</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            Browse verified listings, submit rental requests, and pay securely — all in one place.
          </p>
          <Link href="/properties">
            <Button size="lg" className="mt-6">
              <Search className="h-4 w-4" />
              Browse Properties
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">Featured Properties</h2>

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        )}

        {isError && (
          <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
            Couldn&apos;t load properties right now. Please try again shortly.
          </p>
        )}

        {data && data.properties.length === 0 && (
          <p className="text-sm text-gray-500">No properties available yet — check back soon.</p>
        )}

        {data && data.properties.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
