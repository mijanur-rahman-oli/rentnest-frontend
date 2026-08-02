"use client";

import { useRouter } from "next/navigation";
import { PropertyForm } from "@/components/PropertyForm";
import { useCreateProperty } from "@/hooks/useProperties";

export default function NewPropertyPage() {
  const router = useRouter();
  const createProperty = useCreateProperty();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-semibold text-gray-900">List a New Property</h1>
      <p className="mb-6 text-sm text-gray-500">Fill in the details tenants will see.</p>

      <PropertyForm
        submitLabel="Create Listing"
        isSubmitting={createProperty.isPending}
        onSubmit={(values) =>
          createProperty.mutate(values, {
            onSuccess: () => router.push("/dashboard/landlord"),
          })
        }
      />
    </div>
  );
}
