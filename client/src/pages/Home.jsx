import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Search,
  Sparkles,
  Compass,
  ShieldCheck,
  Route,
  BookOpenCheck,
  TrendingUp,
  GraduationCap,
  BriefcaseBusiness,
  Palette,
  HeartPulse,
  Wrench,
  Code2,
} from "lucide-react";
import { repository } from "../lib/repository";
import { CareerCard, SectionHeading, Badge } from "../components";
import { LanguageContext } from "../App";

const categories = [
  {
    name: "Technology",
    icon: Code2,
    description: "Build digital products and systems",
  },
  {
    name: "Healthcare",
    icon: HeartPulse,
    description: "Support health and wellbeing",
  },
  {
    name: "Finance",
    icon: BriefcaseBusiness,
    description: "Understand money and business",
  },
  {
    name: "Design & Creative",
    icon: Palette,
    description: "Tell stories through creativity",
  },
  {
    name: "Engineering",
    icon: Wrench,
    description: "Solve practical problems",
  },
  {
    name: "Education",
    icon: GraduationCap,
    description: "Help people learn and grow",
  },
];
export default function Home() {
  const { t } = React.useContext(LanguageContext);
  const [careers, setCareers] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();
  React.useEffect(() => {
    repository.getCareers().then(setCareers);
  }, []);
  const trending = careers
    .filter((c) => c.trending)
    .sort((a, b) => (a.trendingPriority || 99) - (b.trendingPriority || 99))
    .slice(0, 6);
  const submit = (e) => {
    e.preventDefault();
    navigate(`/careers?q=${encodeURIComponent(search)}`);
  };
  return (
    <main>
      <section className="relative overflow-hidden bg-linear-to-br from-violet-50 via-white to-indigo-50">
        <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div>
            <Badge>
              <Sparkles size={13} className="mr-1" /> {t("heroBadge")}
            </Badge>
            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {t("heroTitle1")}
              <br />
              <span className="bg-linear-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
                {t("heroTitle2")}
              </span>
              <br />
              {t("heroTitle3")}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              {t("heroDescription")}
            </p>
            <form
              onSubmit={submit}
              className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-violet-100/70 sm:flex-row"
            >
              <div className="flex flex-1 items-center gap-3 px-3">
                <Search className="shrink-0 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full py-2 text-sm outline-none placeholder:text-slate-400"
                  placeholder={t("searchPlaceholder")}
                />
              </div>
              <button className="btn-primary rounded-xl! px-5">
                {t("findPath")} <ArrowRight size={16} />
              </button>
            </form>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-600" />{" "}
                {t("structured")}
              </span>
              <span className="flex items-center gap-1.5">
                <Route size={15} className="text-brand-600" /> {t("roadmaps")}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpenCheck size={15} className="text-brand-600" />{" "}
                {t("resources")}
              </span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-5 rounded-[2.5rem] bg-linear-to-br from-brand-300/40 to-indigo-300/40 blur-2xl" />
            <div className="relative rounded-4xl border border-white bg-white/80 p-5 shadow-2xl shadow-indigo-200/50 backdrop-blur sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-brand-600">
                    {t("preview")}
                  </p>
                  <h3 className="mt-1 text-xl font-extrabold text-slate-900">
                    {t("curious")}
                  </h3>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <Compass />
                </span>
              </div>
              <div className="mt-7 space-y-0">
                {[
                  {
                    n: "01",
                    title: t("discover"),
                    sub: t("discoverSub"),
                    tone: "bg-violet-500",
                  },
                  {
                    n: "02",
                    title: t("understand"),
                    sub: t("understandSub"),
                    tone: "bg-indigo-500",
                  },
                  {
                    n: "03",
                    title: t("learn"),
                    sub: t("learnSub"),
                    tone: "bg-blue-500",
                  },
                  {
                    n: "04",
                    title: t("nextStep"),
                    sub: t("nextStepSub"),
                    tone: "bg-emerald-500",
                  },
                ].map((s, i) => (
                  <div key={s.n} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${s.tone} text-xs font-extrabold text-white`}
                      >
                        {s.n}
                      </span>
                      {i < 3 && <span className="my-1 h-8 w-px bg-slate-200" />}
                    </div>
                    <div className="pb-5">
                      <p className="font-bold text-slate-900">{s.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-1 rounded-2xl bg-linear-to-r from-brand-600 to-indigo-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">{t("smallSteps")}</p>
                    <p className="mt-1 text-xs text-violet-100">
                      {t("journey")}
                    </p>
                  </div>
                  <Sparkles className="text-violet-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("possibilities")}
          title={t("fitCareer")}
          description={t("fitDescription")}
          action={
            <Link to="/careers" className="btn-secondary">
              {t("viewAll")} <ArrowRight size={16} />
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ name, icon: Icon, description }) => (
            <Link
              key={name}
              to={`/careers?industry=${encodeURIComponent(name === "Design & Creative" ? "Creative" : name)}`}
              className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-soft"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <Icon />
              </span>
              <span className="flex-1">
                <span className="block font-bold text-slate-900">{name}</span>
                <span className="mt-1 block text-xs text-slate-500">
                  {description}
                </span>
              </span>
              <ArrowRight
                size={16}
                className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-600"
              />
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("popular")}
            title={t("trendingCareers")}
            description={t("trendingDescription")}
            action={
              <Link to="/careers" className="btn-secondary">
                {t("exploreAll")} <ArrowRight size={16} />
              </Link>
            }
          />
          {trending.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {trending.map((c) => (
                <CareerCard key={c.id} career={c} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-8 text-center text-slate-500">
              Loading career paths…
            </div>
          )}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t("howWorks")} title={t("clearerRoute")} />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              n: "01",
              title: t("exploreTitle"),
              desc: t("exploreDesc"),
              icon: Search,
            },
            { n: "02", title: t("plan"), desc: t("planDesc"), icon: Route },
            {
              n: "03",
              title: t("contributeTitle"),
              desc: t("contributeDesc"),
              icon: Sparkles,
            },
          ].map(({ n, title, desc, icon: Icon }) => (
            <div key={n} className="card p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-brand-200">
                  {n}
                </span>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon />
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-4xl bg-linear-to-r from-brand-700 to-indigo-700 p-8 text-white sm:p-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-200">
                {t("nextStarts")}
              </p>
              <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
                {t("decision")}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-violet-100">
                {t("decisionDesc")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/careers"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-700 hover:bg-violet-50"
              >
                {t("explore")} <ArrowRight size={16} />
              </Link>
              <Link
                to="/contribute"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                {t("contributeIdea")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
