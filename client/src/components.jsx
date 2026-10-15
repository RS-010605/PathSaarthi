import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ArrowRight,
  Compass,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  GitCompareArrows,
  Menu,
  X,
  Languages,
} from "lucide-react";
import { LanguageContext } from "./App";

export function Badge({ children, tone = "purple" }) {
  const styles = {
    purple: "bg-brand-50 text-brand-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-600",
    red: "bg-rose-50 text-rose-700",
    blue: "bg-sky-50 text-sky-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[tone] || styles.purple}`}
    >
      {children}
    </span>
  );
}
export function Logo({ small = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 no-underline">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-linear-to-br from-brand-500 to-indigo-700 text-white shadow-lg shadow-brand-200">
        <Compass size={21} />
      </span>
      <span className="leading-tight">
        <span
          className={`block font-extrabold tracking-tight text-slate-900 ${small ? "text-sm" : "text-base"}`}
        >
          PathSaarthi
        </span>
        <span className="block text-[11px] font-medium tracking-wide text-slate-500">
          GUJARAT
        </span>
      </span>
    </Link>
  );
}
const nav = [
  ["explore", "/careers"],
  ["compare", "/compare"],
  ["contribute", "/contribute"],
  ["about", "/about"],
];
export function Header({ language, setLanguage }) {
  const { t } = React.useContext(LanguageContext);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const submit = (e) => {
    e.preventDefault();
    window.location.href = `/careers?q=${encodeURIComponent(search)}`;
  };
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map(([key, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm font-semibold transition ${isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-brand-700"}`
              }
            >
              {t(key)}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-2.5 py-2 text-xs text-slate-500">
            <Languages size={15} />
            {/* <select
              aria-label="Language"
              className="bg-transparent outline-none cursor-pointer border pt-2 pb-2 rounded-xl"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="gu">ગુજરાતી</option>
            </select> */}

            <select
              aria-label="Language"
              className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 shadow-sm outline-none transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option className="text-gray-800" value="en">
                English
              </option>
              <option className="text-gray-800" value="hi">
                हिन्दी
              </option>
              <option className="text-gray-800" value="gu">
                ગુજરાતી
              </option>
            </select>
          </label>
          <Link to="/admin" className="btn-secondary px-3! py-2!">
            {t("admin")}
          </Link>
        </div>
        <button
          className="rounded-lg p-2 text-slate-600 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          <div className="grid gap-1">
            {nav.map(([key, to]) => (
              <Link
                onClick={() => setOpen(false)}
                key={to}
                to={to}
                className="rounded-lg px-3 py-2 font-semibold text-slate-700 hover:bg-brand-50"
              >
                {t(key)}
              </Link>
            ))}
            <label className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600">
              <Languages size={15} />
              {t("mobileLanguage")}
              <select
                aria-label="Language"
                className="ml-auto rounded-lg border border-slate-200 bg-white p-1"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="gu">ગુજરાતી</option>
              </select>
            </label>
            <Link
              to="/admin"
              className="px-3 py-2 font-semibold text-brand-700"
            >
              {t("admin")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
export function Footer() {
  const { t } = React.useContext(LanguageContext);
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-9 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <Logo />
          <p className="mt-3 max-w-md text-sm text-slate-500">{t("tagline")}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
          <Link to="/about" className="hover:text-brand-700">
            {t("about")}
          </Link>
          <Link to="/contact" className="hover:text-brand-700">
            {t("contact")}
          </Link>
          <Link to="/contribute" className="hover:text-brand-700">
            {t("contribute")}
          </Link>
          <Link to="/admin" className="hover:text-brand-700">
            {t("admin")}
          </Link>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} PathSaarthi Gujarat ·{" "}
        {t("footerDisclaimer")}
      </div>
    </footer>
  );
}
export function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[.18em] text-brand-600">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
export function CareerCard({ career }) {
  const { t } = React.useContext(LanguageContext);
  const colors = [
    "from-violet-500 to-indigo-600",
    "from-cyan-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-rose-500",
  ];
  const color =
    colors[(career.name.length + career.industry.length) % colors.length];
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-1 hover:border-brand-100 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br ${color} text-lg font-extrabold text-white`}
        >
          {career.name
            .split(/[\s-]/)
            .filter(Boolean)
            .slice(0, 2)
            .map((x) => x[0])
            .join("")
            .toUpperCase()}
        </div>
        {career.trending && (
          <Badge>
            <TrendingUp size={12} className="mr-1" />
            {t("trending")}
          </Badge>
        )}
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-brand-600">
        {career.industry}
      </p>
      <h3 className="mt-1 text-lg font-bold text-slate-900">{career.name}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-500">
        {career.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {career.skills.slice(0, 2).map((s) => (
          <span
            key={s}
            className="rounded-lg bg-slate-50 px-2 py-1 text-xs text-slate-600"
          >
            {s}
          </span>
        ))}
      </div>
      <Link
        to={`/careers/${career.slug || career.id}`}
        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:gap-3"
      >
        {t("pathway")} <ArrowRight size={16} />
      </Link>
    </article>
  );
}
export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Search />
      </div>
      <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
export function StatCard({ label, value, icon: Icon, tone = "purple", hint }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span
          className={`grid h-10 w-10 place-items-center rounded-xl ${tone === "green" ? "bg-emerald-50 text-emerald-600" : tone === "amber" ? "bg-amber-50 text-amber-600" : "bg-brand-50 text-brand-600"}`}
        >
          <Icon size={19} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
