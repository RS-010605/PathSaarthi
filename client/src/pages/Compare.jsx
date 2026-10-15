import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { GitCompareArrows, ArrowRight, Check } from "lucide-react";
import { repository } from "../lib/repository";
import { SectionHeading, EmptyState } from "../components";

export default function Compare() {
  const [params, setParams] = useSearchParams();
  const [careers, setCareers] = React.useState([]);
  const [first, setFirst] = React.useState(params.get("first") || "");
  const [second, setSecond] = React.useState(params.get("second") || "");
  React.useEffect(() => {
    repository.getCareers().then(setCareers);
  }, []);
  React.useEffect(() => {
    setParams(
      (p) => {
        if (first) p.set("first", first);
        else p.delete("first");
        if (second) p.set("second", second);
        else p.delete("second");
        return p;
      },
      { replace: true },
    );
  }, [first, second]);
  const a = careers.find((c) => c.id === first),
    b = careers.find((c) => c.id === second);
  const rows = [
    ["Industry", (c) => c.industry],
    ["Overview", (c) => c.description],
    ["Typical qualifications", (c) => c.qualifications || []],
    ["Key skills", (c) => c.skills || []],
    ["Roadmap milestones", (c) => (c.roadmap || []).map((s) => s.title)],
    ["Responsibilities", (c) => c.responsibilities || []],
  ];
  const fmt = (v) =>
    Array.isArray(v)
      ? v.map((x) => (typeof x === "string" ? x : x.title || "")).join(" · ")
      : v || "Not provided";
  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Make an informed choice"
        title="Compare two careers"
        description="See the differences in learning routes, skills, and responsibilities side by side."
      />
      <div className="card p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Career one</label>
            <select
              className="input"
              value={first}
              onChange={(e) => setFirst(e.target.value)}
            >
              <option value="">Choose a career</option>
              {careers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Career two</label>
            <select
              className="input"
              value={second}
              onChange={(e) => setSecond(e.target.value)}
            >
              <option value="">Choose a career</option>
              {careers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {a && b && a.id !== b.id ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
          <div className="grid grid-cols-2 bg-linear-to-r from-brand-700 to-indigo-700 text-white">
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-violet-200">
                Career A
              </p>
              <h2 className="mt-1 text-lg font-extrabold sm:text-2xl">
                {a.name}
              </h2>
            </div>
            <div className="border-l border-white/15 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-violet-200">
                Career B
              </p>
              <h2 className="mt-1 text-lg font-extrabold sm:text-2xl">
                {b.name}
              </h2>
            </div>
          </div>
          {rows.map(([label, fn]) => (
            <div
              key={label}
              className="grid grid-cols-2 border-t border-slate-100"
            >
              <div className="p-4 sm:p-5">
                <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-brand-700">
                  {label}
                </p>
                <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                  {fmt(fn(a))}
                </p>
              </div>
              <div className="border-l border-slate-100 p-4 sm:p-5">
                <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-brand-700">
                  {label}
                </p>
                <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                  {fmt(fn(b))}
                </p>
              </div>
            </div>
          ))}
          <div className="grid grid-cols-2 border-t border-slate-100">
            <div className="p-4">
              <Link
                to={`/careers/${a.slug || a.id}`}
                className="btn-secondary w-full"
              >
                View pathway <ArrowRight size={14} />
              </Link>
            </div>
            <div className="border-l border-slate-100 p-4">
              <Link
                to={`/careers/${b.slug || b.id}`}
                className="btn-secondary w-full"
              >
                View pathway <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            title={
              a && b
                ? "Choose two different careers"
                : "Select two careers to compare"
            }
            description="Choose a career in each dropdown to see their education routes, skills, roadmap milestones, and responsibilities together."
          />
        </div>
      )}
      <p className="mt-5 text-xs text-slate-400">
        This comparison uses sample pathway content, not a ranking or guarantee
        of salary, demand, or employment outcomes.
      </p>
    </main>
  );
}
