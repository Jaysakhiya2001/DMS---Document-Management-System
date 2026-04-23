"use client";

import { Button } from "@/components/common/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-red-700">Something went wrong</h2>
          <p className="mt-2 text-sm text-slate-600">{error.message}</p>
          <div className="mt-4">
            <Button onClick={reset} type="button">
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
