import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Route,
  MessagesSquare,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Check,
  Search,
  Eye,
  RotateCcw,
  TrendingUp,
  Users,
  Clock3,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import { repository } from "../lib/repository";
import { Badge, StatCard, SectionHeading } from "../components";

const blankCareer = {
  id: "",
  slug: "",
  name: "",
  description: "",
  industry: "Technology",
  responsibilities: [""],
  qualifications: [""],
  skills: [""],
  roadmap: [],
  resources: [],
  trending: false,
  trendingPriority: 99,
  status: "draft",
  contentStatus: "Sample — verify official requirements",
  languages: ["en", "hi", "gu"],
};
const statusTone = (s) =>
  s === "accepted"
    ? "green"
    : s === "rejected"
      ? "red"
      : s === "reviewed"
        ? "blue"
        : "amber";
export default function Admin() {
  const [tab, setTab] = React.useState("overview"),
    [careers, setCareers] = React.useState([]),
    [contributions, setContributions] = React.useState([]),
    [selectedCareer, setSelectedCareer] = React.useState(""),
    [editing, setEditing] = React.useState(null),
    [editingStep, setEditingStep] = React.useState(null),
    [review, setReview] = React.useState(null),
    [filter, setFilter] = React.useState("pending"),
    [query, setQuery] = React.useState(""),
    [notice, setNotice] = React.useState(""),
    [preview, setPreview] = React.useState(false);
  async function refresh() {
    const [c, k] = await Promise.all([
      repository.getCareers(),
      repository.getContributions(),
    ]);
    setCareers(c);
    setContributions(k);
    if (!selectedCareer && c.length) setSelectedCareer(c[0].id);
  }
  React.useEffect(() => {
    refresh();
  }, []);
  React.useEffect(() => {
    if (notice) {
      const t = setTimeout(() => setNotice(""), 3000);
      return () => clearTimeout(t);
    }
  }, [notice]);
  const active = careers.find((c) => c.id === selectedCareer);
  const tabs = [
    ["overview", "Overview", LayoutDashboard],
    ["careers", "Career CRUD", BriefcaseBusiness],
    ["roadmap", "Roadmap builder", Route],
    ["contributions", "Contribution reviews", MessagesSquare],
  ];
  const pending = contributions.filter((c) => c.status === "pending").length;
  function exportBackup() {
    const backup = {
      app: "PathSaarthi Gujarat",
      version: 1,
      exportedAt: new Date().toISOString(),
      careers,
      contributions,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pathsaarthi-backup.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(
      "JSON backup downloaded. Keep it safe to restore your demo data.",
    );
  }
  async function importBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const backup = JSON.parse(await file.text());
      if (
        backup.app !== "PathSaarthi Gujarat" ||
        !Array.isArray(backup.careers) ||
        !Array.isArray(backup.contributions)
      )
        throw new Error("Invalid backup");
      localStorage.setItem(
        "pathsaarthi.careers.v1",
        JSON.stringify(backup.careers),
      );
      localStorage.setItem(
        "pathsaarthi.contributions.v1",
        JSON.stringify(backup.contributions),
      );
      await refresh();
      setNotice("Backup imported successfully.");
    } catch {
      setNotice(
        "Could not import file. Select a valid PathSaarthi JSON backup.",
      );
    } finally {
      event.target.value = "";
    }
  }
  async function saveCareer(e) {
    e.preventDefault();
    if (!editing.name.trim() || !editing.description.trim()) {
      setNotice("Career name and description are required.");
      return;
    }
    const saved = await repository.saveCareer({
      ...editing,
      id:
        editing.id ||
        editing.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      slug:
        editing.slug ||
        editing.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
    });
    await refresh();
    setSelectedCareer(saved.id);
    setEditing(null);
    setNotice("Career saved successfully.");
  }
  async function deleteCareer(id) {
    if (!confirm("Delete this career from the local demo?")) return;
    await repository.deleteCareer(id);
    await refresh();
    setNotice("Career deleted.");
  }
  function updateCareerField(key, value) {
    setEditing((prev) => ({ ...prev, [key]: value }));
  }
  function updateArrayField(key, index, value) {
    setEditing((prev) => ({
      ...prev,
      [key]: prev[key].map((x, i) => (i === index ? value : x)),
    }));
  }
  function addArrayField(key) {
    setEditing((prev) => ({ ...prev, [key]: [...(prev[key] || []), ""] }));
  }
  function removeArrayField(key, index) {
    setEditing((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  }
  async function saveStep(e) {
    e.preventDefault();
    if (!active || !editingStep?.title?.trim()) return;
    const existing = active.roadmap || [];
    const next = editingStep.id
      ? existing.map((s) => (s.id === editingStep.id ? editingStep : s))
      : [
          ...existing,
          {
            ...editingStep,
            id: `${active.id}-step-${Date.now()}`,
            sequence: existing.length + 1,
          },
        ];
    await repository.saveRoadmap(active.id, next);
    await refresh();
    setEditingStep(null);
    setNotice(
      "Roadmap saved. The student career page now reflects the changes.",
    );
  }
  async function deleteStep(id) {
    if (!active) return;
    await repository.saveRoadmap(
      active.id,
      (active.roadmap || []).filter((s) => s.id !== id),
    );
    await refresh();
    setNotice("Roadmap step removed.");
  }
  async function reorderStep(id, dir) {
    if (!active) return;
    const steps = [...(active.roadmap || [])].sort(
      (a, b) => a.sequence - b.sequence,
    );
    const i = steps.findIndex((s) => s.id === id),
      j = i + dir;
    if (j < 0 || j >= steps.length) return;
    [steps[i], steps[j]] = [steps[j], steps[i]];
    await repository.saveRoadmap(active.id, steps);
    await refresh();
    setNotice("Roadmap order updated.");
  }
  async function decide(contrib, status, notes) {
    await repository.updateContribution(contrib.id, {
      status,
      reviewNotes: notes ?? contrib.reviewNotes ?? "",
      reviewedAt: new Date().toISOString(),
      applicationStatus:
        status === "accepted"
          ? "not_applied"
          : contrib.applicationStatus || "not_applied",
    });
    setReview(null);
    await refresh();
    setNotice(
      `Contribution marked ${status}. Accepted changes are not automatically published.`,
    );
  }
  async function applyContribution(c) {
    const career = careers.find((x) => x.id === c.careerId);
    if (!career) {
      setNotice("Choose a related career before applying this contribution.");
      return;
    }
    if (c.type === "roadmap-step") {
      const next = [
        ...(career.roadmap || []),
        {
          id: `${career.id}-step-${Date.now()}`,
          title: c.title,
          description: c.proposed,
          sequence: (career.roadmap || []).length + 1,
          prerequisites: [],
        },
      ];
      await repository.saveRoadmap(career.id, next);
    } else if (c.type === "skill") {
      await repository.saveCareer({
        ...career,
        skills: [...career.skills, c.proposed],
      });
    } else {
      setNotice(
        "This demo applies roadmap-step and skill suggestions directly to a local draft. Other contribution types need a field-specific edit.",
      );
      return;
    }
    await repository.updateContribution(c.id, { applicationStatus: "applied" });
    await refresh();
    setNotice(
      "Contribution applied to demo content. Verify before publishing.",
    );
  }
  const shownContributions = contributions.filter(
    (c) =>
      (filter === "all" || c.status === filter) &&
      `${c.title} ${c.careerId} ${c.contributor} ${c.type}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <main className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-375 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-brand-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Demo
              workspace
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Admin dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage careers, edit roadmaps, and review community suggestions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={exportBackup} className="btn-secondary">
              Export JSON backup
            </button>
            <label className="btn-secondary cursor-pointer">
              Import JSON backup
              <input
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={importBackup}
              />
            </label>
            <button
              onClick={() => {
                localStorage.removeItem("pathsaarthi.admin.session");
                window.location.href = "/admin/login";
              }}
              className="btn-secondary"
            >
              Sign out
            </button>
            <Link to="/careers" className="btn-secondary">
              <Eye size={16} /> View student site
            </Link>
            <button
              onClick={async () => {
                if (
                  confirm("Reset local demo data to its original sample state?")
                ) {
                  await repository.resetDemo();
                  await refresh();
                  setNotice("Demo data reset.");
                }
              }}
              className="btn-secondary"
            >
              <RotateCcw size={16} /> Reset demo
            </button>
          </div>
        </div>
        {notice && (
          <div
            role="status"
            className="mb-5 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
          >
            {notice}
            <button onClick={() => setNotice("")}>
              <X size={16} />
            </button>
          </div>
        )}
        <div className="grid gap-5 lg:grid-cols-[235px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-3 shadow-soft">
            <p className="px-3 pb-3 pt-2 text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Workspace
            </p>
            {tabs.map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${tab === id ? "bg-brand-600 text-white shadow-md shadow-brand-200" : "text-slate-600 hover:bg-slate-50 hover:text-brand-700"}`}
              >
                <Icon size={18} />
                {label}
                {id === "contributions" && pending > 0 && (
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-xs ${tab === id ? "bg-white/20" : "bg-amber-100 text-amber-700"}`}
                  >
                    {pending}
                  </span>
                )}
              </button>
            ))}
            <div className="mt-4 rounded-xl bg-violet-50 p-3">
              <p className="text-xs font-bold text-violet-800">Demo mode</p>
              <p className="mt-1 text-xs leading-5 text-violet-700">
                Changes are saved in this browser unless the API is configured.
              </p>
            </div>
          </aside>
          <section className="min-w-0">
            {tab === "overview" && (
              <>
                <SectionHeading
                  eyebrow="At a glance"
                  title="Platform overview"
                  description="Live counts from the current demo data."
                />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    label="Total careers"
                    value={careers.length}
                    icon={BriefcaseBusiness}
                  />
                  <StatCard
                    label="Roadmap steps"
                    value={careers.reduce(
                      (n, c) => n + (c.roadmap || []).length,
                      0,
                    )}
                    icon={Route}
                    tone="green"
                  />
                  <StatCard
                    label="Pending reviews"
                    value={pending}
                    icon={Clock3}
                    tone="amber"
                  />
                  <StatCard
                    label="All contributions"
                    value={contributions.length}
                    icon={Users}
                  />
                </div>
                <div className="mt-5 grid gap-5 xl:grid-cols-2">
                  <div className="card p-5">
                    <div className="flex items-center justify-between">
                      <h2 className="font-extrabold">Recent careers</h2>
                      <button
                        onClick={() => setTab("careers")}
                        className="text-sm font-bold text-brand-700"
                      >
                        Manage all →
                      </button>
                    </div>
                    <div className="mt-4 divide-y divide-slate-100">
                      {careers.slice(0, 6).map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between gap-3 py-3"
                        >
                          <div>
                            <p className="font-semibold text-slate-800">
                              {c.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {c.industry} · {(c.roadmap || []).length} roadmap
                              steps
                            </p>
                          </div>
                          <Badge
                            tone={c.status === "published" ? "green" : "amber"}
                          >
                            {c.status || "draft"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card p-5">
                    <div className="flex items-center justify-between">
                      <h2 className="font-extrabold">Contribution queue</h2>
                      <button
                        onClick={() => setTab("contributions")}
                        className="text-sm font-bold text-brand-700"
                      >
                        Review all →
                      </button>
                    </div>
                    <div className="mt-4 space-y-3">
                      {contributions.slice(0, 5).map((c) => (
                        <div
                          key={c.id}
                          className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {c.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {c.type} · {c.contributor}
                            </p>
                          </div>
                          <Badge tone={statusTone(c.status)}>{c.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
            {tab === "careers" && (
              <>
                <SectionHeading
                  eyebrow="Content management"
                  title="Career CRUD"
                  description="Create and update careers using dynamic form fields. Changes appear in the student directory."
                  action={
                    <button
                      onClick={() => setEditing({ ...blankCareer })}
                      className="btn-primary"
                    >
                      <Plus size={16} /> New career
                    </button>
                  }
                />
                <div className="card overflow-hidden">
                  <div className="border-b border-slate-100 p-4">
                    <div className="relative">
                      <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="input pl-9"
                        placeholder="Search careers..."
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-170 text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-5 py-3">Career</th>
                          <th className="px-5 py-3">Industry</th>
                          <th className="px-5 py-3">Roadmap</th>
                          <th className="px-5 py-3">Status</th>
                          <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {careers
                          .filter((c) =>
                            (c.name + " " + c.industry)
                              .toLowerCase()
                              .includes(query.toLowerCase()),
                          )
                          .map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/70">
                              <td className="px-5 py-4">
                                <p className="font-bold text-slate-900">
                                  {c.name}
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                  {c.slug}
                                </p>
                              </td>
                              <td className="px-5 py-4 text-slate-600">
                                {c.industry}
                              </td>
                              <td className="px-5 py-4 text-slate-600">
                                {(c.roadmap || []).length} steps
                              </td>
                              <td className="px-5 py-4">
                                <Badge
                                  tone={
                                    c.status === "published" ? "green" : "amber"
                                  }
                                >
                                  {c.status || "draft"}
                                </Badge>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex justify-end gap-2">
                                  <button
                                    title="Edit career"
                                    onClick={() =>
                                      setEditing({
                                        ...c,
                                        responsibilities: [
                                          ...(c.responsibilities || [""]),
                                        ],
                                        qualifications: [
                                          ...(c.qualifications || [""]),
                                        ],
                                        skills: [...(c.skills || [])],
                                        roadmap: [...(c.roadmap || [])],
                                        resources: [...(c.resources || [])],
                                      })
                                    }
                                    className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                                  >
                                    <Pencil size={15} />
                                  </button>
                                  <button
                                    title="Edit roadmap"
                                    onClick={() => {
                                      setSelectedCareer(c.id);
                                      setTab("roadmap");
                                    }}
                                    className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                                  >
                                    <Route size={15} />
                                  </button>
                                  <button
                                    title="Delete career"
                                    onClick={() => deleteCareer(c.id)}
                                    className="rounded-lg border border-slate-200 p-2 text-rose-500 hover:bg-rose-50"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            {tab === "roadmap" && (
              <>
                <SectionHeading
                  eyebrow="Dynamic pathway editor"
                  title="Roadmap builder"
                  description="Select a career, add or edit milestones, and preview the same structured roadmap shown to students."
                />
                <div className="card p-5">
                  <label className="label">Select career</label>
                  <select
                    className="input max-w-xl"
                    value={selectedCareer}
                    onChange={(e) => {
                      setSelectedCareer(e.target.value);
                      setEditingStep(null);
                    }}
                  >
                    {careers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {active && (
                    <>
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-extrabold text-slate-900">
                            {active.name} pathway
                          </h3>
                          <p className="text-sm text-slate-500">
                            {(active.roadmap || []).length} ordered milestones
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setEditingStep({
                              title: "",
                              description: "",
                              prerequisites: [],
                              sequence: (active.roadmap || []).length + 1,
                            })
                          }
                          className="btn-primary"
                        >
                          <Plus size={16} /> Add step
                        </button>
                      </div>
                      <div className="mt-5 space-y-3">
                        {[...(active.roadmap || [])]
                          .sort((a, b) => a.sequence - b.sequence)
                          .map((s, i) => (
                            <div
                              key={s.id}
                              className="flex gap-3 rounded-xl border border-slate-100 p-4"
                            >
                              <div className="flex flex-col items-center gap-1 text-slate-300">
                                <GripVertical size={17} />
                                <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-50 text-xs font-extrabold text-brand-700">
                                  {i + 1}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-slate-900">
                                  {s.title}
                                </p>
                                <p className="mt-1 text-sm leading-5 text-slate-500">
                                  {s.description}
                                </p>
                                {s.prerequisites?.length > 0 && (
                                  <p className="mt-2 text-xs text-slate-400">
                                    Prerequisites: {s.prerequisites.join(", ")}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col gap-1">
                                <button
                                  disabled={i === 0}
                                  onClick={() => reorderStep(s.id, -1)}
                                  title="Move up"
                                  className="rounded-lg border border-slate-200 p-1.5 text-slate-500 disabled:opacity-30"
                                >
                                  <ChevronDown
                                    className="rotate-180"
                                    size={15}
                                  />
                                </button>
                                <button
                                  disabled={
                                    i === (active.roadmap || []).length - 1
                                  }
                                  onClick={() => reorderStep(s.id, 1)}
                                  title="Move down"
                                  className="rounded-lg border border-slate-200 p-1.5 text-slate-500 disabled:opacity-30"
                                >
                                  <ChevronDown size={15} />
                                </button>
                                <button
                                  onClick={() => setEditingStep({ ...s })}
                                  title="Edit step"
                                  className="rounded-lg border border-slate-200 p-1.5 text-brand-700"
                                >
                                  <Pencil size={15} />
                                </button>
                                <button
                                  onClick={() => deleteStep(s.id)}
                                  title="Delete step"
                                  className="rounded-lg border border-slate-200 p-1.5 text-rose-500"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <button
                          onClick={() => setPreview(!preview)}
                          className="btn-secondary"
                        >
                          <Eye size={16} />
                          {preview ? "Hide" : "Preview"} student roadmap
                        </button>
                        <Link
                          to={`/careers/${active.slug || active.id}`}
                          className="btn-secondary"
                        >
                          Open career page ↗
                        </Link>
                      </div>
                      {preview && (
                        <div className="mt-5 rounded-2xl bg-violet-50 p-5">
                          <p className="text-xs font-extrabold uppercase tracking-widest text-brand-700">
                            Student preview
                          </p>
                          <h4 className="mt-1 text-xl font-extrabold">
                            {active.name} roadmap
                          </h4>
                          <div className="mt-4 space-y-3">
                            {[...(active.roadmap || [])]
                              .sort((a, b) => a.sequence - b.sequence)
                              .map((s, i) => (
                                <div
                                  key={s.id}
                                  className="flex gap-3 rounded-xl bg-white p-3"
                                >
                                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-600 text-xs font-bold text-white">
                                    {i + 1}
                                  </span>
                                  <div>
                                    <p className="font-bold text-slate-800">
                                      {s.title}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                      {s.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
            {tab === "contributions" && (
              <>
                <SectionHeading
                  eyebrow="Community content"
                  title="Contribution reviews"
                  description="Review proposals and record decisions. Acceptance does not automatically publish a change."
                />
                <div className="mb-4 flex flex-wrap gap-2">
                  {[
                    ["all", "All"],
                    ["pending", "Pending"],
                    ["accepted", "Accepted"],
                    ["rejected", "Rejected"],
                    ["reviewed", "Reviewed"],
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => setFilter(id)}
                      className={`rounded-xl px-4 py-2 text-sm font-bold ${filter === id ? "bg-brand-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-brand-50"}`}
                    >
                      {label}{" "}
                      <span className="ml-1 opacity-70">
                        {id === "all"
                          ? contributions.length
                          : contributions.filter((c) => c.status === id).length}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="card overflow-hidden">
                  <div className="border-b border-slate-100 p-4">
                    <div className="relative">
                      <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="input pl-9"
                        placeholder="Search submissions..."
                      />
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {shownContributions.length ? (
                      shownContributions.map((c) => (
                        <div
                          key={c.id}
                          className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge tone={statusTone(c.status)}>
                                {c.status}
                              </Badge>
                              <Badge tone="slate">{c.type}</Badge>
                              <span className="text-xs text-slate-400">
                                {new Date(c.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <h3 className="mt-2 font-extrabold text-slate-900">
                              {c.title}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              By {c.contributor || "Anonymous"} ·{" "}
                              {careers.find((x) => x.id === c.careerId)?.name ||
                                "General"}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                              {c.proposed}
                            </p>
                            {c.sourceUrl && (
                              <a
                                href={c.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 inline-block break-all text-xs font-semibold text-brand-700 underline"
                              >
                                {c.sourceUrl}
                              </a>
                            )}
                            {c.reviewNotes && (
                              <p className="mt-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                                Review note: {c.reviewNotes}
                              </p>
                            )}
                            {c.applicationStatus === "applied" && (
                              <p className="mt-2 text-xs font-bold text-emerald-700">
                                Applied to demo content
                              </p>
                            )}
                          </div>
                          <div className="flex shrink-0 flex-wrap gap-2">
                            <button
                              onClick={() => setReview({ ...c })}
                              className="btn-secondary px-3! py-2!"
                            >
                              <Eye size={15} /> Review
                            </button>
                            {c.status === "pending" && (
                              <>
                                <button
                                  onClick={() => decide(c, "accepted")}
                                  className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                                >
                                  <Check size={14} /> Accept
                                </button>
                                <button
                                  onClick={() => decide(c, "rejected")}
                                  className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
                                >
                                  <X size={14} /> Reject
                                </button>
                              </>
                            )}
                            {c.status === "accepted" &&
                              c.applicationStatus !== "applied" && (
                                <button
                                  onClick={() => applyContribution(c)}
                                  className="btn-primary px-3! py-2!"
                                >
                                  Apply locally
                                </button>
                              )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center text-sm text-slate-500">
                        No contributions match this filter.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-brand-600">
                  Career editor
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  {editing.id ? "Edit career" : "Create career"}
                </h2>
              </div>
              <button
                onClick={() => setEditing(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                <X />
              </button>
            </div>
            <form onSubmit={saveCareer} className="mt-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Career name *</label>
                  <input
                    className="input"
                    value={editing.name}
                    onChange={(e) => updateCareerField("name", e.target.value)}
                    required
                    placeholder="e.g. Product Designer"
                  />
                </div>
                <div>
                  <label className="label">Industry</label>
                  <input
                    className="input"
                    value={editing.industry}
                    onChange={(e) =>
                      updateCareerField("industry", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Description *</label>
                  <textarea
                    className="input min-h-24"
                    value={editing.description}
                    onChange={(e) =>
                      updateCareerField("description", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
              {[
                ["responsibilities", "Work responsibilities"],
                ["qualifications", "Qualifications"],
                ["skills", "Skills"],
              ].map(([key, label]) => (
                <div key={key}>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="label mb-0!">{label}</label>
                    <button
                      type="button"
                      onClick={() => addArrayField(key)}
                      className="text-xs font-bold text-brand-700"
                    >
                      + Add item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(editing[key] || []).map((val, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          className="input"
                          value={
                            typeof val === "string"
                              ? val
                              : val.name || val.title || ""
                          }
                          onChange={(e) =>
                            updateArrayField(key, i, e.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayField(key, i)}
                          className="rounded-xl border border-slate-200 px-3 text-rose-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Publication status</label>
                  <select
                    className="input"
                    value={editing.status || "draft"}
                    onChange={(e) =>
                      updateCareerField("status", e.target.value)
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    checked={!!editing.trending}
                    onChange={(e) =>
                      updateCareerField("trending", e.target.checked)
                    }
                    className="h-4 w-4 accent-violet-600"
                  />
                  <label className="text-sm font-semibold text-slate-700">
                    Feature as trending
                  </label>
                </div>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                Content is demo data. Verify qualifications and requirements
                from official sources before publishing.
              </div>
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button className="btn-primary">
                  <Save size={16} /> Save career
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editingStep && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <form
            onSubmit={saveStep}
            className="w-full max-w-xl rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">
                {editingStep.id ? "Edit roadmap step" : "Add roadmap step"}
              </h2>
              <button
                type="button"
                onClick={() => setEditingStep(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X />
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <label className="label">Step title *</label>
                <input
                  required
                  className="input"
                  value={editingStep.title}
                  onChange={(e) =>
                    setEditingStep({ ...editingStep, title: e.target.value })
                  }
                  placeholder="e.g. Build a portfolio project"
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  className="input min-h-28"
                  value={editingStep.description || ""}
                  onChange={(e) =>
                    setEditingStep({
                      ...editingStep,
                      description: e.target.value,
                    })
                  }
                  placeholder="What should the learner do at this step?"
                />
              </div>
              <div>
                <label className="label">Prerequisites (comma separated)</label>
                <input
                  className="input"
                  value={(editingStep.prerequisites || []).join(", ")}
                  onChange={(e) =>
                    setEditingStep({
                      ...editingStep,
                      prerequisites: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g. Programming basics"
                />
              </div>
              <div className="rounded-xl bg-violet-50 p-3 text-xs text-violet-800">
                This step will be stored as structured data and appear on the
                student career page immediately after saving.
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingStep(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button className="btn-primary">
                <Save size={16} /> Save step
              </button>
            </div>
          </form>
        </div>
      )}
      {review && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Review contribution</h2>
              <button
                onClick={() => setReview(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X />
              </button>
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <Badge tone={statusTone(review.status)}>{review.status}</Badge>
              <h3 className="mt-2 font-extrabold">{review.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {review.proposed}
              </p>
              {review.explanation && (
                <p className="mt-3 text-sm text-slate-500">
                  {review.explanation}
                </p>
              )}
              {review.sourceUrl && (
                <a
                  href={review.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block break-all text-xs text-brand-700 underline"
                >
                  {review.sourceUrl}
                </a>
              )}
            </div>
            <label className="label mt-4">Review notes</label>
            <textarea
              className="input min-h-20"
              value={review.reviewNotes || ""}
              onChange={(e) =>
                setReview({ ...review, reviewNotes: e.target.value })
              }
              placeholder="Explain your decision or what needs verification."
            />
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                onClick={() => decide(review, "rejected", review.reviewNotes)}
                className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-700"
              >
                Reject
              </button>
              <button
                onClick={() => decide(review, "reviewed", review.reviewNotes)}
                className="btn-secondary"
              >
                Mark reviewed
              </button>
              <button
                onClick={() => decide(review, "accepted", review.reviewNotes)}
                className="btn-primary"
              >
                <Check size={15} /> Accept
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Accepted changes are not automatically published. Apply the change
              separately after review.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
