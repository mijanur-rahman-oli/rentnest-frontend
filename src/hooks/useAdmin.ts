"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiClientError } from "@/lib/api";
import type { Property, RentalRequest, User, UserStatus } from "@/types";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: () => api.get<User[]>("/admin/users"),
  });
}

export function useAdminProperties() {
  return useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => api.get<Property[]>("/admin/properties"),
  });
}

export function useAdminRentals() {
  return useQuery({
    queryKey: ["admin-rentals"],
    queryFn: () => api.get<RentalRequest[]>("/admin/rentals"),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      api.patch<User>(`/admin/users/${id}`, { status }),
    onSuccess: (_data, variables) => {
      toast.success(variables.status === "BANNED" ? "User banned" : "User unbanned");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: ApiClientError) => toast.error(err.message),
  });
}
