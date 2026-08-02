"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-5xl flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertTriangle className="h-10 w-10 text-amber-500" />
      <h2 className="text-lg font-semibold text-gray-900">This section couldn&apos;t load</h2>
      <p className="max-w-md text-sm text-gray-500">
        Something went wrong loading your dashboard data. Your session is still active — try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
