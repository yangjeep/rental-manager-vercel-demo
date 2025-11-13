'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <section className="text-center py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">Something went wrong!</h1>
      <p className="text-muted mb-6">
        {error.message || 'An unexpected error occurred'}
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={reset}
          className="rounded-full px-5 py-2.5 bg-accent text-[#04140f] font-semibold border-none cursor-pointer"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-block rounded-full px-5 py-2.5 bg-transparent border border-white/25 text-fg font-semibold text-center no-underline hover:bg-white/10"
        >
          Go home
        </Link>
      </div>
    </section>
  );
}

