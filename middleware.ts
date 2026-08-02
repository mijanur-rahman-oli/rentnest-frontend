import { NextRequest, NextResponse } from "next/server";

type Role = "TENANT" | "LANDLORD" | "ADMIN";

function decodeRoleFromToken(token: string): Role | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const parsed = JSON.parse(decoded);
    return parsed.role ?? null;
  } catch {
    return null;
  }
}

const roleHome: Record<Role, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("rentnest_token")?.value;

  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = decodeRoleFromToken(token);
  if (!role) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Role-scoped section guard: /dashboard/tenant/* only for TENANT, etc.
  const section = pathname.split("/")[2]; // "tenant" | "landlord" | "admin"
  const sectionToRole: Record<string, Role> = {
    tenant: "TENANT",
    landlord: "LANDLORD",
    admin: "ADMIN",
  };

  const requiredRole = sectionToRole[section];
  if (requiredRole && requiredRole !== role) {
    return NextResponse.redirect(new URL(roleHome[role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
