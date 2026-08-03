import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl border border-gray-200 bg-white shadow-sm", className)}
      {...props}
    />
  );
}

const badgeStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-blue-100 text-blue-700",
  PAYMENT_DUE: "bg-blue-100 text-blue-700",
  REJECTED: "bg-red-100 text-red-700",
  ACTIVE: "bg-green-100 text-green-700",
  COMPLETED: "bg-gray-200 text-gray-700",
  CANCELLED: "bg-gray-200 text-gray-500",
  AVAILABLE: "bg-green-100 text-green-700",
  UNAVAILABLE: "bg-gray-200 text-gray-600",
  RENTED: "bg-blue-100 text-blue-700",
  ACTIVE_ACCOUNT: "bg-green-100 text-green-700",
  BANNED: "bg-red-100 text-red-700",
  COMPLETED_PAYMENT: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-200 text-gray-600",
};

export function Badge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        badgeStyles[status] || "bg-gray-100 text-gray-600",
        className
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-gray-200", className)} />;
}
