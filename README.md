# RentNest

A Next.js 15 (App Router) frontend for the RentNest rental property marketplace. Three roles - Tenant, Landlord, Admin  with fully role-adaptive UI and protected routes via Next.js Middleware.

---

## 1. Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS - clean, responsive, no clutter
- **Forms:** React Hook Form + Zod for validation
- **Server State:** TanStack Query - fetching & caching made easy
- **Global State:** Zustand with persistence - session stays put
- **Route Protection:** Next.js Middleware reading JWT cookies
- **Payments:** Stripe Checkout - redirect-based, no card handling on our end
- **Toasts:** sonner - subtle, friendly notifications

---

## 2. Getting Started

```bash
git clone <your-repo-url>
cd rentnest-frontend
npm install

cp .env.example .env

npm run dev   # http://localhost:3000
```

### Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the RentNest backend API, including `/api` (e.g. `https://rentnest-backend-phi.vercel.app/api`) |

---

## 3. Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Home (featured properties)
│   ├── properties/                       # Public browse + detail
│   ├── auth/{login,register}/            # Auth forms
│   ├── payment/{success,cancel}/         # Stripe redirect outcome pages
│   └── dashboard/
│       ├── tenant/                       # Tenant dashboard + pay flow
│       ├── landlord/                     # Landlord dashboard + property CRUD + requests
│       └── admin/                        # Admin dashboard (users/properties/rentals)
├── components/                           # Navbar, PropertyCard, forms, UI primitives
├── hooks/                                # TanStack Query hooks per resource
├── lib/                                  # api client, auth cookie helpers, zod schemas, utils
├── store/                                # Zustand auth store
└── types/                                # Shared TS types matching backend models
middleware.ts                             # Route protection (project root, Next.js convention)
```

---

## 4. Admin Credentials

Use the same admin account seeded on the backend:

```
Email:    admin@gmail.com
Password: admin123
```

---

## 5. Route Protection (Next.js Middleware)

`middleware.ts` guards every `/dashboard/*` path:
- No `rentnest_token` cookie → redirect to `/auth/login`.
- Token present but role doesn't match the dashboard section (`/dashboard/landlord` visited by a tenant, etc.) → redirect to that user's own dashboard.

The token is stored in a plain (non-httpOnly) cookie set right after login/register specifically so the middleware - which runs before any page renders - can read it. Real authorization is still enforced by the backend on every API call; this only gates which page shell loads.

---

## 6. Payment Flow (Stripe)

1. Tenant's rental request is approved by the landlord → status `PAYMENT_DUE`.
2. Tenant visits `/dashboard/tenant/requests/[id]/pay` → clicks **Pay with Stripe**.
3. Frontend calls `POST /api/payments/create`, gets back a Stripe Checkout `checkoutUrl`, and redirects the browser there (`window.location.href`).
4. Stripe redirects back to `/payment/success?session_id=...` or `/payment/cancel`.
5. The success page automatically calls `POST /api/payments/confirm` with the `session_id`, then shows a confirmation state.

Test with Stripe's card `4242 4242 4242 4242`, any future expiry, any CVC.

---

## 7. Error Handling

- **Form-level:** every form uses React Hook Form + Zod — validation errors render inline under each field before any request fires.
- **API-level:** all requests go through `src/lib/api.ts`, which throws a typed `ApiClientError` on any backend failure; hooks catch this and show a `sonner` toast with the backend's actual error message.
- **Route-level:** every route segment has a `loading.tsx` (skeleton) and the root + dashboard segments have `error.tsx` boundaries; a custom `not-found.tsx` handles unmatched routes.

---

## 8. Deployment (Vercel)

1. Push to GitHub, import the repo in Vercel.
2. Set `NEXT_PUBLIC_API_URL` in Vercel's Environment Variables to your **deployed backend URL** (not localhost).
3. Deploy - no special build command needed, Next.js is auto-detected.
4. Make sure your backend's CORS `CLIENT_URL` env var matches this frontend's deployed URL so requests aren't blocked.

---

## 9. Scripts

`npm run dev` | Start dev server 
`npm run build` | Production build 
`npm start` | Run production build 

---

## 10. Notes on Design Decisions

- **Cookie + Zustand, not just localStorage:** the JWT lives in both a cookie (for middleware) and Zustand's persisted store (for instant client-side reads without re-parsing cookies everywhere).
- **Client Components for data-heavy pages:** most pages are client components using TanStack Query rather than Server Components fetching directly, since nearly every page needs the JWT (client-only) attached to its request and needs live refetching after mutations (e.g. approving a request should instantly update the table).
- **Comma-separated inputs for amenities/images:** kept the property form simple (no file upload infra) — landlords paste comma-separated amenity names and image URLs, which the form splits into arrays before submitting, matching the backend's `string[]` fields.
