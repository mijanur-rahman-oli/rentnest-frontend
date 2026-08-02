"use client";

import Link from "next/link";
import { useState } from "react";
import { Home, Menu, X, LogOut, LayoutDashboard, ClipboardList } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

const dashboardPath: Record<string, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-brand-700">
          <Home className="h-5 w-5" />
          RentNest
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
          <Link href="/properties" className="hover:text-brand-700">
            Browse Properties
          </Link>
          {user && (
            <Link href={dashboardPath[user.role]} className="flex items-center gap-1 hover:text-brand-700">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}
          {user?.role === "LANDLORD" && (
            <Link href="/dashboard/landlord/requests" className="flex items-center gap-1 hover:text-brand-700">
              <ClipboardList className="h-4 w-4" />
              Requests
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-gray-500">
                {user.name} · <span className="capitalize">{user.role.toLowerCase()}</span>
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-gray-700">
            <Link href="/properties" onClick={() => setOpen(false)}>
              Browse Properties
            </Link>
            {user ? (
              <>
                <Link href={dashboardPath[user.role]} onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                {user.role === "LANDLORD" && (
                  <Link href="/dashboard/landlord/requests" onClick={() => setOpen(false)}>
                    Requests
                  </Link>
                )}
                <button className="text-left text-red-600" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link href="/auth/register" onClick={() => setOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
