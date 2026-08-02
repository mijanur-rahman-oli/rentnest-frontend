# API Integration Map

This file maps every frontend route/component to the backend endpoint(s) it consumes, per the assignment's mandatory documentation requirement.

Backend base URL is set via `NEXT_PUBLIC_API_URL` in `.env` (see `.env.example`). All requests go through the shared client in `src/lib/api.ts`, which auto-attaches the JWT (from the `rentnest_token` cookie) and normalizes the backend's `{ success, message, data }` / `{ success, message, errorDetails }` response shape into thrown `ApiClientError`s that hooks/components handle with toast notifications or inline form errors.

## Auth

| Frontend | Component / Hook | Backend Endpoint |
|---|---|---|
| `/auth/register` | `RegisterPage` → `useRegister` | `POST /api/auth/register` |
| `/auth/login` | `LoginPage` → `useLogin` | `POST /api/auth/login` |
| Navbar / session bootstrap | `useCurrentUser` | `GET /api/auth/me` |

## Public Properties

| Frontend | Component / Hook | Backend Endpoint |
|---|---|---|
| `/` (Home, featured) | `HomePage` → `useProperties({ limit: 6 })` | `GET /api/properties` |
| `/properties` (Browse + filters) | `PropertiesPage` → `useProperties(filters)` | `GET /api/properties?city=&type=&minPrice=&maxPrice=&categoryId=&page=&limit=` |
| `/properties` (category filter dropdown) | `PropertyFiltersBar` → `useCategories` | `GET /api/categories` |
| `/properties/[id]` (Detail) | `PropertyDetailPage` → `useProperty(id)` | `GET /api/properties/:id` |

## Tenant

| Frontend | Component / Hook | Backend Endpoint |
|---|---|---|
| `/properties/[id]` → "Request to Rent" modal | `RentalRequestModal` → `useSubmitRentalRequest` | `POST /api/rentals` |
| `/dashboard/tenant` (request history) | `TenantDashboardPage` → `useMyRentalRequests` | `GET /api/rentals` |
| `/dashboard/tenant` (payment history table) | `TenantDashboardPage` → `useMyPayments` | `GET /api/payments` |
| `/dashboard/tenant/requests/[id]/pay` | `PayForRentalPage` → `useRentalRequest(id)` | `GET /api/rentals/:id` |
| `/dashboard/tenant/requests/[id]/pay` → "Pay with Stripe" | `PayForRentalPage` → `useCreatePaymentSession` | `POST /api/payments/create` |
| `/payment/success?session_id=...` | `PaymentSuccessPage` → `useConfirmPayment` | `POST /api/payments/confirm` |
| `/payment/success` (inline review prompt) | `PaymentSuccessPage` → `ReviewForm` → `useSubmitReview` | `POST /api/reviews` |
| `/dashboard/tenant` → "Leave Review" (if skipped on success page) | `ReviewForm` → `useSubmitReview` | `POST /api/reviews` |

## Landlord

| Frontend | Component / Hook | Backend Endpoint |
|---|---|---|
| `/dashboard/landlord` (overview + property list) | `LandlordDashboardPage` → `useMyProperties` | `GET /api/landlord/properties` |
| `/dashboard/landlord` (tenant history table) | `LandlordDashboardPage` → `useLandlordRequests` (filtered to ACTIVE/COMPLETED) | `GET /api/landlord/requests` |
| `/dashboard/landlord/properties/new` | `NewPropertyPage` → `useCreateProperty` | `POST /api/landlord/properties` |
| `/dashboard/landlord/properties/[id]/edit` | `EditPropertyPage` → `useUpdateProperty` | `PUT /api/landlord/properties/:id` |
| `/dashboard/landlord` → delete action | `LandlordDashboardPage` → `useDeleteProperty` | `DELETE /api/landlord/properties/:id` |
| `/dashboard/landlord/requests` | `LandlordRequestsPage` → `useLandlordRequests` | `GET /api/landlord/requests` |
| `/dashboard/landlord/requests` → Approve/Reject | `LandlordRequestsPage` → `useUpdateRequestStatus` | `PATCH /api/landlord/requests/:id` |

## Admin

| Frontend | Component / Hook | Backend Endpoint |
|---|---|---|
| `/dashboard/admin` → Users tab | `AdminDashboardPage` → `useAdminUsers` | `GET /api/admin/users` |
| `/dashboard/admin` → Ban/Unban action | `AdminDashboardPage` → `useUpdateUserStatus` | `PATCH /api/admin/users/:id` |
| `/dashboard/admin` → Properties tab | `AdminDashboardPage` → `useAdminProperties` | `GET /api/admin/properties` |
| `/dashboard/admin` → Rentals tab | `AdminDashboardPage` → `useAdminRentals` | `GET /api/admin/rentals` |

## Route Protection

`middleware.ts` guards every `/dashboard/*` route at the edge: it reads the `rentnest_token` cookie (set client-side on login/register), decodes the JWT's `role` claim (without verifying the signature — real verification happens on every backend call), and:
- Redirects to `/auth/login` if there's no token.
- Redirects a logged-in user away from a dashboard section that doesn't match their role (e.g. a tenant hitting `/dashboard/landlord` gets redirected to `/dashboard/tenant`).

## Error Handling Pattern

Every API call goes through `apiFetch()` in `src/lib/api.ts`, which throws a typed `ApiClientError` on any non-2xx or `success: false` response. Consumers handle this in one of two ways:
- **TanStack Query mutations** (`onError`) → show a `sonner` toast with the backend's `message`.
- **React Hook Form + Zod** → client-side validation errors render inline under each field before a request is even sent; server-side validation errors (if the backend rejects something the client missed) surface via the same toast path.
