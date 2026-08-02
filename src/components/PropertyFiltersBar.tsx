"use client";

import { useState } from "react";
import { Select, Input, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useCategories } from "@/hooks/useProperties";
import type { PropertyFilters } from "@/hooks/useProperties";

interface Props {
  initial: PropertyFilters;
  onApply: (filters: PropertyFilters) => void;
}

const propertyTypes = ["APARTMENT", "HOUSE", "STUDIO", "ROOM", "VILLA", "OFFICE"];

export function PropertyFiltersBar({ initial, onApply }: Props) {
  const [filters, setFilters] = useState<PropertyFilters>(initial);
  const { data: categories, isLoading: loadingCategories } = useCategories();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onApply(filters);
      }}
      className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-6"
    >
      <div>
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          placeholder="e.g. Dhaka"
          value={filters.city || ""}
          onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <Select
          id="type"
          value={filters.type || ""}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
        >
          <option value="">Any</option>
          {propertyTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="categoryId">Category</Label>
        <Select
          id="categoryId"
          value={filters.categoryId || ""}
          onChange={(e) => setFilters((f) => ({ ...f, categoryId: e.target.value }))}
          disabled={loadingCategories}
        >
          <option value="">Any</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="minPrice">Min Price</Label>
        <Input
          id="minPrice"
          type="number"
          min={0}
          value={filters.minPrice || ""}
          onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="maxPrice">Max Price</Label>
        <Input
          id="maxPrice"
          type="number"
          min={0}
          value={filters.maxPrice || ""}
          onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
        />
      </div>
      <div className="flex items-end">
        <Button type="submit" className="w-full">
          Apply Filters
        </Button>
      </div>
    </form>
  );
}
