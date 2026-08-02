import Image from "next/image";
import Link from "next/link";
import { MapPin, BedDouble, Bath } from "lucide-react";
import { Card } from "@/components/ui/Primitives";
import { formatCurrency } from "@/lib/utils";
import type { Property } from "@/types";

export function PropertyCard({ property }: { property: Property }) {
  const image = property.images?.[0];

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative h-44 w-full overflow-hidden bg-gray-100">
          {image ? (
            <Image
              src={image}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">No image</div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-brand-700">
            {property.type}
          </span>
        </div>
        <div className="space-y-2 p-4">
          <h3 className="line-clamp-1 font-semibold text-gray-900">{property.title}</h3>
          <p className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-3.5 w-3.5" />
            {property.city}
            {property.region ? `, ${property.region}` : ""}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" /> {property.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" /> {property.bathrooms}
            </span>
          </div>
          <p className="pt-1 font-semibold text-brand-700">
            {formatCurrency(property.price)}
            <span className="text-xs font-normal text-gray-400"> /month</span>
          </p>
        </div>
      </Card>
    </Link>
  );
}
