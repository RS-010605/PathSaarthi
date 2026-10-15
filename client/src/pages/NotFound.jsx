import React from "react";
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="text-sm font-extrabold uppercase tracking-widest text-brand-600">
        404 · Not found
      </p>
      <h1 className="mt-4 text-4xl font-black text-slate-900">
        This path doesn't exist yet.
      </h1>
      <p className="mt-3 text-slate-500">
        Let's get you back to exploring your future.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Go to home
      </Link>
    </main>
  );
}
