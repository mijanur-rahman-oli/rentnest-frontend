"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiClientError } from "@/lib/api";
import type { Category, PaginatedProperties, Property } from "@/types";
import type { PropertyFormValues } from "@/lib/validations/property";

export interface PropertyFilters {
  city?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  amenities?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

function buildQuery(filters: PropertyFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: () =>
      api.get<PaginatedProperties>(`/properties${buildQuery(filters)}`, { auth: false }),
  });
}

export function useProperty(id: string | undefined) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => api.get<Property>(`/properties/${id}`, { auth: false }),
    enabled: !!id,
    // FIX: always refetch on mount so detail page never shows stale images
    staleTime: 0,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<Category[]>("/categories", { auth: false }),
  });
}

export function useMyProperties() {
  return useQuery({
    queryKey: ["landlord-properties"],
    queryFn: () => api.get<Property[]>("/landlord/properties"),
    // FIX: always refetch so the edit page gets the latest images
    staleTime: 0,
  });
}

function toPropertyPayload(values: PropertyFormValues) {
  return {
    ...values,
    amenities: values.amenities
      ? values.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean)
      : [],
    images: values.images ?? [],
    categoryId: values.categoryId || undefined,
    region: values.region || undefined,
  };
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: PropertyFormValues) =>
      api.post<Property>("/landlord/properties", toPropertyPayload(values)),
    onSuccess: (newProperty) => {
      toast.success("Property listed successfully");

      // Invalidate the browsable list so new card (with image) appears immediately
      queryClient.invalidateQueries({ queryKey: ["properties"] });

      // FIX: also invalidate the landlord list (was missing entirely)
      queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });

      // FIX: seed the detail-page cache with the server response so images
      // are available instantly when navigating to /properties/:id
      queryClient.setQueryData(["property", newProperty.id], newProperty);
    },
    onError: (err: ApiClientError) => toast.error(err.message),
  });
}

export function useUpdateProperty(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: Partial<PropertyFormValues>) =>
      api.put<Property>(
        `/landlord/properties/${id}`,
        toPropertyPayload(values as PropertyFormValues)
      ),
    onSuccess: (updatedProperty) => {
      toast.success("Property updated");

      // FIX: update the detail-page cache directly with the fresh server response
      // (images, etc.) — this is the main reason images weren't appearing
      queryClient.setQueryData(["property", id], updatedProperty);

      // Invalidate list queries so cards also reflect the new images
      queryClient.invalidateQueries({ queryKey: ["properties"] });

      // FIX: invalidate the landlord list (was missing)
      queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
    },
    onError: (err: ApiClientError) => toast.error(err.message),
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/landlord/properties/${id}`),
    onSuccess: (_, id) => {
      toast.success("Property removed");
      queryClient.invalidateQueries({ queryKey: ["properties"] });

      // FIX: was missing — landlord dashboard still showed deleted listings
      queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });

      // FIX: evict the stale detail-page cache entry so navigating back
      // to /properties/:id shows an error instead of ghost data
      queryClient.removeQueries({ queryKey: ["property", id] });
    },
    onError: (err: ApiClientError) => toast.error(err.message),
  });
}
