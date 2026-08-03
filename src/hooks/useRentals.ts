"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiClientError } from "@/lib/api";
import type { RentalRequest } from "@/types";
import type { RentalRequestFormValues } from "@/lib/validations/property";

export function useMyRentalRequests() {
  return useQuery({
    queryKey: ["rentals"],
    queryFn: () => api.get<RentalRequest[]>("/rentals"),
  });
}

export function useRentalRequest(id: string | undefined) {
  return useQuery({
    queryKey: ["rental", id],
    queryFn: () => api.get<RentalRequest>(`/rentals/${id}`),
    enabled: !!id,
  });
}

export function useSubmitRentalRequest(propertyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: RentalRequestFormValues) =>
      api.post<RentalRequest>("/rentals", { ...values, propertyId }),
    onSuccess: () => {
      toast.success("Rental request submitted! Waiting for landlord approval.");
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
    },
    onError: (err: ApiClientError) => toast.error(err.message),
  });
}

export function useLandlordRequests() {
  return useQuery({
    queryKey: ["landlord-requests"],
    queryFn: () => api.get<RentalRequest[]>("/landlord/requests"),
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      rejectReason,
    }: {
      id: string;
      status: "APPROVED" | "REJECTED";
      rejectReason?: string;
    }) => api.patch<RentalRequest>(`/landlord/requests/${id}`, { status, rejectReason }),

    // Optimistic update: instantly reflect the new status in the table
    // before the server responds, so there's no full-page reload or
    // waiting flicker. Rolls back automatically if the request fails.
    onMutate: async ({ id, status, rejectReason }) => {
      await queryClient.cancelQueries({ queryKey: ["landlord-requests"] });
      const previous = queryClient.getQueryData<RentalRequest[]>(["landlord-requests"]);

      queryClient.setQueryData<RentalRequest[]>(["landlord-requests"], (old) =>
        old?.map((r) =>
          r.id === id
            ? {
                ...r,
                status: status === "APPROVED" ? "PAYMENT_DUE" : "REJECTED",
                rejectReason: status === "REJECTED" ? rejectReason ?? null : null,
              }
            : r
        )
      );

      return { previous };
    },
    onError: (err: ApiClientError, _variables, context) => {
      // Roll back to the pre-mutation state and show why.
      if (context?.previous) {
        queryClient.setQueryData(["landlord-requests"], context.previous);
      }
      toast.error(err.message);
    },
    onSuccess: (_data, variables) => {
      toast.success(
        variables.status === "APPROVED" ? "Request approved" : "Request rejected"
      );
      queryClient.invalidateQueries({ queryKey: ["landlord-requests"] });
    },
  });
}
