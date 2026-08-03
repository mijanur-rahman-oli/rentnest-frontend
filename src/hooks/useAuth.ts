"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api, ApiClientError } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { User, Role } from "@/types";
import type { LoginFormValues, RegisterFormValues } from "@/lib/validations/auth";

interface AuthResponse {
  user: User;
  token: string;
}

const roleHome: Record<Role, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (values: LoginFormValues) => api.post<AuthResponse>("/auth/login", values, { auth: false }),
    onSuccess: (data) => {
      setSession(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      router.push(roleHome[data.user.role]);
    },
    onError: (err: ApiClientError) => {
      toast.error(err.message || "Login failed. Check your credentials.");
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (values: RegisterFormValues) =>
      api.post<AuthResponse>(
        "/auth/register",
        { ...values, phone: values.phone || undefined },
        { auth: false }
      ),
    onSuccess: (data) => {
      setSession(data.user, data.token);
      toast.success("Account created successfully!");
      router.push(roleHome[data.user.role]);
    },
    onError: (err: ApiClientError) => {
      toast.error(err.message || "Registration failed.");
    },
  });
}

export function useCurrentUser() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.get<User>("/auth/me"),
    enabled: !!token,
    retry: false,
  });
}

export function useLogout() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  return () => {
    logout();
    toast.success("Logged out");
    router.push("/auth/login");
  };
}
