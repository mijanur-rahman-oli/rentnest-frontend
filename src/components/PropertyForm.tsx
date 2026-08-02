"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema, type PropertyFormValues } from "@/lib/validations/property";
import { Input, Label, Select, Textarea, FieldError } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useCategories } from "@/hooks/useProperties";
import { ImageUrlUploader } from "@/components/ImageUrlUploader";

const propertyTypes = ["APARTMENT", "HOUSE", "STUDIO", "ROOM", "VILLA", "OFFICE"];

interface Props {
  defaultValues?: Partial<PropertyFormValues>;
  onSubmit: (values: PropertyFormValues) => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

export function PropertyForm({ defaultValues, onSubmit, isSubmitting, submitLabel = "Save Property" }: Props) {
  const { data: categories } = useCategories();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: { images: [], ...defaultValues },
  });

  const images = watch("images");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Cozy 2-Bed Apartment in Gulshan" error={errors.title?.message} {...register("title")} />
        <FieldError message={errors.title?.message} />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} error={errors.description?.message} {...register("description")} />
        <FieldError message={errors.description?.message} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select id="type" error={errors.type?.message} {...register("type")}>
            {propertyTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <FieldError message={errors.type?.message} />
        </div>
        <div>
          <Label htmlFor="categoryId">Category</Label>
          <Select id="categoryId" {...register("categoryId")}>
            <option value="">None</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price / month</Label>
          <Input id="price" type="number" error={errors.price?.message} {...register("price")} />
          <FieldError message={errors.price?.message} />
        </div>
        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input id="bedrooms" type="number" {...register("bedrooms")} />
        </div>
        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input id="bathrooms" type="number" {...register("bathrooms")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="areaSqft">Area (sqft)</Label>
          <Input id="areaSqft" type="number" {...register("areaSqft")} />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" error={errors.city?.message} {...register("city")} />
          <FieldError message={errors.city?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" error={errors.address?.message} {...register("address")} />
        <FieldError message={errors.address?.message} />
      </div>

      <div>
        <Label htmlFor="region">Region (optional)</Label>
        <Input id="region" {...register("region")} />
      </div>

      <div>
        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
        <Input id="amenities" placeholder="Wifi, Parking, Generator" {...register("amenities")} />
      </div>

      <div>
        <Label>Property Images</Label>
        <ImageUrlUploader
          value={images ?? []}
          onChange={(urls) => setValue("images", urls, { shouldValidate: true })}
          error={errors.images?.message as string | undefined}
        />
      </div>

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}
