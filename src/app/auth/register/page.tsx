"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";
import { Input, Label, Select, FieldError } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useRegister } from "@/hooks/useAuth";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "TENANT" },
  });

  const registerMutation = useRegister();

  const onSubmit = (values: RegisterFormValues) => registerMutation.mutate(values);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="mb-1 text-2xl font-semibold text-gray-900">Create your account</h1>
      <p className="mb-6 text-sm text-gray-500">Join RentNest as a tenant or a landlord.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="role">I am a</Label>
          <Select id="role" error={errors.role?.message} {...register("role")}>
            <option value="TENANT">Tenant — looking to rent</option>
            <option value="LANDLORD">Landlord — listing properties</option>
          </Select>
          <FieldError message={errors.role?.message} />
        </div>

        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="Ayesha Islam" error={errors.name?.message} {...register("name")} />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" placeholder="+8801700000000" error={errors.phone?.message} {...register("phone")} />
          <FieldError message={errors.phone?.message} />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            error={errors.password?.message}
            {...register("password")}
          />
          <FieldError message={errors.password?.message} />
        </div>

        <Button type="submit" className="w-full" isLoading={registerMutation.isPending}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-brand-700 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
