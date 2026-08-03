import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(["APARTMENT", "HOUSE", "STUDIO", "ROOM", "VILLA", "OFFICE"], {
    errorMap: () => ({ message: "Select a property type" }),
  }),
  price: z.coerce.number().positive("Price must be greater than 0"),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  areaSqft: z.coerce.number().positive().optional().or(z.nan().transform(() => undefined)),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  region: z.string().optional().or(z.literal("")),
  amenities: z.string().optional().or(z.literal("")), // comma-separated in the form, split before submit
  images: z.array(z.string().url("Must be a valid image URL")).default([]),
  categoryId: z.string().optional().or(z.literal("")),
});
export type PropertyFormValues = z.infer<typeof propertySchema>;

export const rentalRequestSchema = z.object({
  moveInDate: z.string().min(1, "Move-in date is required"),
  durationMonths: z.coerce.number().int().positive("Enter a valid duration"),
  message: z.string().max(1000).optional().or(z.literal("")),
});
export type RentalRequestFormValues = z.infer<typeof rentalRequestSchema>;

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Pick a rating").max(5),
  comment: z.string().max(1000).optional().or(z.literal("")),
});
export type ReviewFormValues = z.infer<typeof reviewSchema>;
