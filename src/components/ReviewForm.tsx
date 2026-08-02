"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { reviewSchema, type ReviewFormValues } from "@/lib/validations/property";
import { Textarea, FieldError } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useSubmitReview } from "@/hooks/usePayments";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function ReviewForm({ rentalRequestId, onDone }: { rentalRequestId: string; onDone?: () => void }) {
  const [rating, setRating] = useState(0);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormValues>({ resolver: zodResolver(reviewSchema) });

  const submitReview = useSubmitReview();

  const onSubmit = (values: ReviewFormValues) => {
    submitReview.mutate({ ...values, rentalRequestId }, { onSuccess: onDone });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
      <div>
        <p className="mb-1.5 text-sm font-medium text-gray-700">Your rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setRating(n);
                setValue("rating", n, { shouldValidate: true });
              }}
            >
              <Star
                className={cn(
                  "h-6 w-6",
                  n <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                )}
              />
            </button>
          ))}
        </div>
        <input type="hidden" {...register("rating")} />
        <FieldError message={errors.rating?.message} />
      </div>

      <Textarea placeholder="Share your experience (optional)" rows={3} {...register("comment")} />

      <Button type="submit" size="sm" isLoading={submitReview.isPending}>
        Submit Review
      </Button>
    </form>
  );
}
