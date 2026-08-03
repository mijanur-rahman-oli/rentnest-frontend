"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiClientError } from "@/lib/api";
import type { Payment, Review } from "@/types";
import type { ReviewFormValues } from "@/lib/validations/property";

export function useMyPayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: () => api.get<Payment[]>("/payments"),
  });
}

interface CreatePaymentResponse {
  payment: Payment;
  checkoutUrl: string;
  sessionId: string;
}

export function useCreatePaymentSession() {
  return useMutation({
    mutationFn: (rentalRequestId: string) =>
      api.post<CreatePaymentResponse>("/payments/create", { rentalRequestId }),
    onError: (err: ApiClientError) => toast.error(err.message),
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => api.post<Payment>("/payments/confirm", { sessionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (err: ApiClientError) => toast.error(err.message),
  });
}

export function useSubmitReview() {
  return useMutation({
    mutationFn: ({ rentalRequestId, ...values }: ReviewFormValues & { rentalRequestId: string }) =>
      api.post<Review>("/reviews", { rentalRequestId, ...values }),
    onSuccess: () => toast.success("Thanks for your review!"),
    onError: (err: ApiClientError) => toast.error(err.message),
  });
}
