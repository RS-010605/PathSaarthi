import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { repository } from "../lib/repository";
import { CareerCard, SectionHeading, EmptyState } from "../components";

export default function Careers() {
  const [params, setParams] = useSearchParams();
  const [careers, setCareers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState(params.get("q") || "");
  const [industry, setIndustry] = React.useState(
    params.get("industry") || "All industries",
  );
  const [sort, setSort] = React.useState("trending");
  React.useEffect(() => {
    repository
      .getCareers()
      .then(setCareers)
      .finally(() => setLoading(false));
  }, []);
  React.useEffect(() => {
    setQuery(params.get("q") || "");
    setIndustry(params.get("industry") || "All industries");
  }, [params]);
  const industries = [
    "All industries",
    ...new Set(careers.map((c) => c.industry).filter(Boolean)),
  ];
  const filtered = careers
    .filter((c) => {
      const hay = [c.name, c.description, c.industry, ...c.skills]
        .join(" ")
        .toLowerCase();
      return (
        hay.includes(query.toLowerCase()) &&
        (industry === "All industries" || c.industry === industry)
      );
    })
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "recent"
          ? (b.updatedAt || "").localeCompare(a.updatedAt || "")
          : Number(b.trending) - Number(a.trending) ||
            (a.trendingPriority || 99) - (b.trendingPriority || 99),
    );
  function reset() {
    setQuery("");
    setIndustry("All industries");
    setParams({});
  }
  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Career directory"
        title="Explore career pathways"
        description="Search by career, industry, or skill. Each pathway is a starting point to help you learn what comes next."
      />
      <div className="mb-7 rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_180px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input pl-10"
              placeholder="Search career, industry, or skill"
            />
          </div>
          <select
            className="input"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          >
            {industries.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select
            className="input"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="trending">Trending first</option>
            <option value="name">Name A–Z</option>
            <option value="recent">Recently updated</option>
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            <SlidersHorizontal size={13} className="mr-1 inline" />{" "}
            {filtered.length} career{filtered.length === 1 ? "" : "s"} found
          </p>
          {(query || industry !== "All industries") && (
            <button
              onClick={reset}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-700"
            >
              <X size={13} /> Clear filters
            </button>
          )}
        </div>
      </div>
      {loading ? (
        <div className="py-20 text-center text-slate-500">
          Loading career paths…
        </div>
      ) : filtered.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CareerCard key={c.id} career={c} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matching careers yet"
          description="Try a different keyword or clear your filters to see all available career pathways."
          action={
            <button onClick={reset} className="btn-secondary">
              Clear filters
            </button>
          }
        />
      )}
      <p className="mt-8 text-xs leading-5 text-slate-400">
        Demo content may be incomplete. Verify formal qualifications, entrance
        exams, and licensing requirements with the relevant official authority.
      </p>
    </main>
  );
}
