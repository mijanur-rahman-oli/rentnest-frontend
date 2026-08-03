import Cookies from "js-cookie";
import type { Role } from "@/types";

const TOKEN_COOKIE = "rentnest_token";
const ROLE_COOKIE = "rentnest_role";

/**
 * We store the JWT in a plain (non-httpOnly) cookie, not just localStorage,
 * specifically so Next.js Middleware — which runs on the server/edge before
 * a page renders — can read it and protect /dashboard/* routes without a
 * client-side redirect flash. Real authorization is still enforced by the
 * backend on every request; this only gates which page shell loads.
 */
export function setAuthCookies(token: string, role: Role) {
  Cookies.set(TOKEN_COOKIE, token, { expires: 7, sameSite: "lax" });
  Cookies.set(ROLE_COOKIE, role, { expires: 7, sameSite: "lax" });
}

export function clearAuthCookies() {
  Cookies.remove(TOKEN_COOKIE);
  Cookies.remove(ROLE_COOKIE);
}

export function getToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return Cookies.get(TOKEN_COOKIE);
}

export function getRole(): Role | undefined {
  if (typeof window === "undefined") return undefined;
  return Cookies.get(ROLE_COOKIE) as Role | undefined;
}

export interface JwtPayload {
  id: string;
  role: Role;
  exp?: number;
}

/** Decodes (does NOT verify) a JWT's payload — fine for UI/route-gating
 * decisions, since the backend independently verifies the signature on
 * every real API call. */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
