"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { rentalRequestSchema, type RentalRequestFormValues } from "@/lib/validations/property";
import { Input, Label, Textarea, FieldError } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useSubmitRentalRequest } from "@/hooks/useRentals";

export function RentalRequestModal({
  propertyId,
  onClose,
}: {
  propertyId: string;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RentalRequestFormValues>({
    resolver: zodResolver(rentalRequestSchema),
    defaultValues: { durationMonths: 12 },
  });

  const submitRequest = useSubmitRentalRequest(propertyId);

  const onSubmit = (values: RentalRequestFormValues) => {
    submitRequest.mutate(values, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Request to Rent</h2>
          <button onClick={onClose} aria-label="Close">
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="moveInDate">Move-in Date</Label>
            <Input id="moveInDate" type="date" error={errors.moveInDate?.message} {...register("moveInDate")} />
            <FieldError message={errors.moveInDate?.message} />
          </div>

          <div>
            <Label htmlFor="durationMonths">Duration (months)</Label>
            <Input
              id="durationMonths"
              type="number"
              min={1}
              error={errors.durationMonths?.message}
              {...register("durationMonths")}
            />
            <FieldError message={errors.durationMonths?.message} />
          </div>

          <div>
            <Label htmlFor="message">Message to landlord (optional)</Label>
            <Textarea id="message" rows={3} {...register("message")} />
          </div>

          <Button type="submit" className="w-full" isLoading={submitRequest.isPending}>
            Submit Request
          </Button>
        </form>
      </div>
    </div>
  );
}
