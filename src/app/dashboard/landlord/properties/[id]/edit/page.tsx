"use client";

import { useParams, useRouter } from "next/navigation";
import { PropertyForm } from "@/components/PropertyForm";
import { useMyProperties, useUpdateProperty } from "@/hooks/useProperties";
import { Skeleton } from "@/components/ui/Primitives";

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: properties, isLoading } = useMyProperties();
  const updateProperty = useUpdateProperty(id);

  const property = properties?.find((p) => p.id === id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center text-sm text-gray-500">
        Property not found, or you don&apos;t own it.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-semibold text-gray-900">Edit Property</h1>
      <p className="mb-6 text-sm text-gray-500">Update your listing details.</p>

      <PropertyForm
        submitLabel="Save Changes"
        isSubmitting={updateProperty.isPending}
        defaultValues={{
          title: property.title,
          description: property.description,
          type: property.type,
          price: property.price,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          areaSqft: property.areaSqft ?? undefined,
          address: property.address,
          city: property.city,
          region: property.region ?? "",
          amenities: property.amenities?.join(", ") ?? "",
          images: property.images ?? [],
          categoryId: property.categoryId ?? "",
        }}
        onSubmit={(values) =>
          updateProperty.mutate(values, {
            onSuccess: () => router.push("/dashboard/landlord"),
          })
        }
      />
    </div>
  );
}
