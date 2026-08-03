export type Role = "TENANT" | "LANDLORD" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
export type PropertyType = "APARTMENT" | "HOUSE" | "STUDIO" | "ROOM" | "VILLA" | "OFFICE";
export type PropertyStatus = "AVAILABLE" | "UNAVAILABLE" | "RENTED";
export type RentalRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PAYMENT_DUE"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  bedrooms: number;
  bathrooms: number;
  areaSqft?: number | null;
  address: string;
  city: string;
  region?: string | null;
  country: string;
  amenities: string[];
  images: string[];
  landlordId: string;
  landlord?: Pick<User, "id" | "name" | "email" | "phone">;
  category?: Category | null;
  categoryId?: string | null;
  createdAt: string;
}

export interface RentalRequest {
  id: string;
  status: RentalRequestStatus;
  moveInDate: string;
  durationMonths: number;
  message?: string | null;
  rejectReason?: string | null;
  tenantId: string;
  tenant?: Pick<User, "id" | "name" | "email" | "phone">;
  propertyId: string;
  property?: Property;
  payments?: Payment[];
  createdAt: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  method: string;
  provider: "STRIPE" | "SSLCOMMERZ";
  status: PaymentStatus;
  providerSessionId?: string | null;
  paidAt?: string | null;
  rentalRequestId: string;
  rentalRequest?: RentalRequest;
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  tenantId: string;
  propertyId: string;
  rentalRequestId: string;
  createdAt: string;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiFailure {
  success: false;
  message: string;
  errorDetails: unknown;
}

export interface PaginatedProperties {
  properties: Property[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
