import React from "react";
import { Navigate, useLocation, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, LockKeyhole } from "lucide-react";

// Demo-only client-side gate. Use server-side authentication before any public deployment.
const ADMIN_ID = import.meta.env.VITE_ADMIN_ID || "admin";
const ADMIN_PASSWORD =
  import.meta.env.VITE_ADMIN_PASSWORD || "PathSaarthi@2047";
export function AdminGate({ children }) {
  const location = useLocation();
  return localStorage.getItem("pathsaarthi.admin.session") === "active" ? (
    children
  ) : (
    <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  );
}
export default function AdminLogin() {
  const [adminId, setAdminId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();
  const location = useLocation();
  if (localStorage.getItem("pathsaarthi.admin.session") === "active")
    return <Navigate to="/admin" replace />;
  function submit(e) {
    e.preventDefault();
    if (adminId === ADMIN_ID && password === ADMIN_PASSWORD) {
      localStorage.setItem("pathsaarthi.admin.session", "active");
      navigate(location.state?.from || "/admin", { replace: true });
    } else setError("Incorrect admin ID or password. Please try again.");
  }
  return (
    <main className="flex min-h-[72vh] items-center justify-center bg-linear-to-br from-violet-50 via-white to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-7 shadow-xl sm:p-9">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-100 text-violet-700">
          <ShieldCheck size={28} />
        </div>
        <p className="mt-5 text-center text-xs font-extrabold uppercase tracking-[.18em] text-violet-700">
          Restricted workspace
        </p>
        <h1 className="mt-2 text-center text-3xl font-black text-slate-950">
          Admin sign in
        </h1>
        <p className="mt-2 text-center text-sm leading-6 text-slate-500">
          Sign in to manage careers, roadmaps, and community contributions.
        </p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <label className="label">Admin ID</label>
            <input
              autoComplete="username"
              className="input"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              required
              placeholder="Enter admin ID"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <LockKeyhole
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                autoComplete="current-password"
                type="password"
                className="input pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />
            </div>
          </div>
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700"
            >
              {error}
            </p>
          )}
          <button className="btn-primary w-full justify-center">
            Sign in to admin
          </button>
        </form>
        <div className="mt-5 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          <strong>Demo credentials:</strong> ID <code>admin</code> · Password{" "}
          <code>PathSaarthi@2047</code>. Change these before presenting if
          needed.
        </div>
        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          Prototype access control only. This browser-based demo gate is not
          secure enough for a public production site.
        </p>
        <Link
          to="/"
          className="mt-4 block text-center text-sm font-bold text-violet-700 hover:underline"
        >
          Back to website
        </Link>
      </div>
    </main>
  );
}
