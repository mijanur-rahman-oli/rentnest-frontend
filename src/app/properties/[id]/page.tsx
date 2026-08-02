"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { MapPin, BedDouble, Bath, Ruler, Star } from "lucide-react";
import { useProperty } from "@/hooks/useProperties";
import { useAuthStore } from "@/store/authStore";
import { Skeleton } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { RentalRequestModal } from "@/components/RentalRequestModal";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, isError } = useProperty(id);
  const user = useAuthStore((s) => s.user);
  const [showRequestModal, setShowRequestModal] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Skeleton className="mb-6 h-80 w-full" />
        <Skeleton className="mb-3 h-8 w-2/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          This property couldn&apos;t be loaded. It may have been removed.
        </p>
      </div>
    );
  }

  const canRequest = !user || user.role === "TENANT";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="relative mb-6 h-80 w-full overflow-hidden rounded-xl bg-gray-100">
        {property.images?.[0] ? (
          <Image src={property.images[0]} alt={property.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">No image available</div>
        )}
      </div>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{property.title}</h1>
          <p className="mt-1 flex items-center gap-1 text-gray-500">
            <MapPin className="h-4 w-4" />
            {property.address}, {property.city}
          </p>
        </div>
        <p className="text-2xl font-bold text-brand-700">
          {formatCurrency(property.price)}
          <span className="text-sm font-normal text-gray-400"> /month</span>
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-6 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
        <span className="flex items-center gap-1.5">
          <BedDouble className="h-4 w-4" /> {property.bedrooms} Bedrooms
        </span>
        <span className="flex items-center gap-1.5">
          <Bath className="h-4 w-4" /> {property.bathrooms} Bathrooms
        </span>
        {property.areaSqft && (
          <span className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4" /> {property.areaSqft} sqft
          </span>
        )}
      </div>

      <div className="mt-6">
        <h2 className="mb-2 font-semibold text-gray-900">Description</h2>
        <p className="text-gray-600">{property.description}</p>
      </div>

      {property.amenities?.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2 font-semibold text-gray-900">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {property.amenities.map((a) => (
              <span key={a} className="rounded-full bg-brand-50 px-3 py-1 text-xs text-brand-700">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {property.landlord && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="mb-1 font-semibold text-gray-900">Listed by</h2>
          <p className="text-sm text-gray-600">{property.landlord.name}</p>
          <p className="text-sm text-gray-500">{property.landlord.email}</p>
        </div>
      )}

      {canRequest && (
        <div className="mt-8">
          <Button size="lg" onClick={() => setShowRequestModal(true)}>
            Request to Rent
          </Button>
          {!user && <p className="mt-2 text-xs text-gray-500">You&apos;ll need to log in first.</p>}
        </div>
      )}

      {showRequestModal &&
        (user ? (
          <RentalRequestModal propertyId={property.id} onClose={() => setShowRequestModal(false)} />
        ) : (
          <RedirectToLogin onClose={() => setShowRequestModal(false)} />
        ))}
    </div>
  );
}

function RedirectToLogin({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-lg">
        <Star className="mx-auto mb-3 h-8 w-8 text-brand-500" />
        <p className="mb-4 text-sm text-gray-600">Please log in as a tenant to request this property.</p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <a href="/auth/login">
            <Button>Log In</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
