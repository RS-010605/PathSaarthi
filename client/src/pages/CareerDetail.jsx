import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ExternalLink,
  GitCompareArrows,
  Info,
  Route,
  GraduationCap,
  Wrench,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { repository } from "../lib/repository";
import { Badge } from "../components";

export default function CareerDetail() {
  const { id } = useParams();
  const [career, setCareer] = React.useState(null);
  const [careers, setCareers] = React.useState([]);
  const [done, setDone] = React.useState([]);
  React.useEffect(() => {
    repository.getCareers().then((all) => {
      setCareers(all);
      setCareer(all.find((c) => c.id === id || c.slug === id) || null);
    });
  }, [id]);
  React.useEffect(() => {
    try {
      setDone(
        JSON.parse(localStorage.getItem(`pathsaarthi.progress.${id}`) || "[]"),
      );
    } catch {}
  }, [id]);
  const toggle = (stepId) =>
    setDone((prev) => {
      const next = prev.includes(stepId)
        ? prev.filter((x) => x !== stepId)
        : [...prev, stepId];
      localStorage.setItem(`pathsaarthi.progress.${id}`, JSON.stringify(next));
      return next;
    });
  if (!career)
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold">Career not found</h1>
        <p className="mt-2 text-slate-500">
          This career may have been removed from the demo.
        </p>
        <Link to="/careers" className="btn-primary mt-5">
          Back to careers
        </Link>
      </main>
    );
  const roadmap = [...(career.roadmap || [])].sort(
    (a, b) => a.sequence - b.sequence,
  );
  const progress = roadmap.length
    ? Math.round(
        (done.filter((x) => roadmap.some((s) => s.id === x)).length /
          roadmap.length) *
          100,
      )
    : 0;
  const related = careers
    .filter(
      (c) =>
        c.id !== career.id &&
        (c.industry === career.industry ||
          c.skills.some((s) => career.skills.includes(s))),
    )
    .slice(0, 3);
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/careers"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-700"
      >
        <ArrowLeft size={16} /> All careers
      </Link>
      <section className="mt-5 overflow-hidden rounded-4xl bg-linear-to-br from-brand-700 via-violet-700 to-indigo-800 p-7 text-white sm:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="blue">{career.industry}</Badge>
              <Badge tone="amber">Sample content · verify requirements</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              {career.name}
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-violet-100">
              {career.description}
            </p>
          </div>
          <Link
            to={`/compare?first=${encodeURIComponent(career.id)}`}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/20"
          >
            <GitCompareArrows size={17} /> Compare this career
          </Link>
        </div>
      </section>
      <section className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
              India · entry-level estimate
            </p>
            <h2 className="mt-1 text-lg font-extrabold text-slate-900">
              Typical fresher salary
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {career.fresherSalary?.display || "Not available yet"}
            </p>
          </div>
          <div className="rounded-xl bg-white/80 px-4 py-3 text-xs leading-5 text-slate-500 sm:max-w-md">
            {career.fresherSalary?.basis || "Salary data needs verification."}{" "}
            These are indicative estimates, not guaranteed offers; actual pay
            depends on location, employer, skills, and qualifications.
          </div>
        </div>
      </section>
      <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="card p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Info />
              </span>
              <h2 className="text-xl font-extrabold">
                What this career involves
              </h2>
            </div>
            <ul className="mt-5 space-y-3">
              {(career.responsibilities || []).map((r, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm leading-6 text-slate-600"
                >
                  <CheckCircle2
                    size={17}
                    className="mt-1 shrink-0 text-emerald-500"
                  />
                  {typeof r === "string" ? r : r.title || JSON.stringify(r)}
                </li>
              ))}
            </ul>
          </section>
          <section className="card p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <GraduationCap />
              </span>
              <div>
                <h2 className="text-xl font-extrabold">
                  Qualifications & education
                </h2>
                <p className="text-sm text-slate-500">
                  Check official requirements for your route.
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {(career.qualifications || []).map((q, i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-white text-xs font-extrabold text-brand-700">
                    {i + 1}
                  </span>
                  {typeof q === "string" ? q : q.title || JSON.stringify(q)}
                </div>
              ))}
            </div>
          </section>
          <section className="card p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
                <Wrench />
              </span>
              <div>
                <h2 className="text-xl font-extrabold">Skills to develop</h2>
                <p className="text-sm text-slate-500">
                  Use these as a practical learning checklist.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {(career.skills || []).map((s, i) => (
                <div
                  key={s}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-xs font-extrabold text-brand-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {typeof s === "string" ? s : s.name || JSON.stringify(s)}
                  </span>
                </div>
              ))}
            </div>
          </section>
          <section className="card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Route />
                  </span>
                  <div>
                    <h2 className="text-xl font-extrabold">
                      Your step-by-step roadmap
                    </h2>
                    <p className="text-sm text-slate-500">
                      Updated dynamically from the career data.
                    </p>
                  </div>
                </div>
              </div>
              <div className="min-w-32">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-brand-500 to-indigo-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-7">
              {roadmap.length ? (
                roadmap.map((step, i) => (
                  <div
                    key={step.id || step.sequence}
                    className="relative flex gap-4 pb-7 last:pb-0"
                  >
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => toggle(step.id)}
                        aria-label={`Mark ${step.title} ${done.includes(step.id) ? "incomplete" : "complete"}`}
                        className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition ${done.includes(step.id) ? "border-emerald-500 bg-emerald-500 text-white" : "border-brand-100 bg-brand-50 text-brand-700 hover:bg-brand-100"}`}
                      >
                        {done.includes(step.id) ? (
                          <CheckCircle2 size={19} />
                        ) : (
                          <span className="text-xs font-extrabold">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        )}
                      </button>
                      {i < roadmap.length - 1 && (
                        <span className="absolute top-10 h-[calc(100%-2.5rem)] w-px bg-slate-200" />
                      )}
                    </div>
                    <div className="flex-1 rounded-xl border border-slate-100 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`font-bold ${done.includes(step.id) ? "text-emerald-700" : "text-slate-900"}`}
                        >
                          {step.title}
                        </h3>
                        {done.includes(step.id) && (
                          <Badge tone="green">Completed</Badge>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {step.description}
                      </p>
                      {step.prerequisites?.length > 0 && (
                        <p className="mt-3 text-xs text-slate-400">
                          Prerequisite: {step.prerequisites.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No roadmap steps have been published yet.
                </p>
              )}
            </div>
          </section>
          <section className="card p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 text-sky-600">
                <BookOpen />
              </span>
              <div>
                <h2 className="text-xl font-extrabold">Learning resources</h2>
                <p className="text-sm text-slate-500">
                  Resources are suggestions and have not been individually
                  verified.
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {(career.resources || []).map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-brand-200 hover:bg-brand-50/50"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{r.title}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {r.language || "English"} ·{" "}
                      {r.verified ? "Verified" : "Needs review"}
                    </p>
                  </div>
                  <ExternalLink size={16} className="shrink-0 text-brand-600" />
                </a>
              ))}
            </div>
          </section>
        </div>
        <aside className="space-y-5">
          <div className="card p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-amber-500" />
              <h3 className="font-extrabold">Guidance note</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              This is a prototype. Course eligibility, licensing, and entrance
              requirements may change. Confirm them with official institutions
              before making decisions.
            </p>
            <Link
              to={`/contribute?career=${encodeURIComponent(career.id)}`}
              className="btn-secondary mt-4 w-full"
            >
              Suggest an improvement
            </Link>
          </div>
          {related.length > 0 && (
            <div className="card p-5">
              <h3 className="font-extrabold">Related pathways</h3>
              <div className="mt-4 space-y-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to={`/careers/${r.slug || r.id}`}
                    className="flex items-center justify-between gap-2 text-sm font-semibold text-slate-700 hover:text-brand-700"
                  >
                    <span>{r.name}</span>
                    <ArrowRight size={15} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
