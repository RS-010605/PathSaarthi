import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, Send, Lightbulb } from "lucide-react";
import { repository } from "../lib/repository";
import { SectionHeading } from "../components";

export default function Contribute() {
  const [params] = useSearchParams();
  const [careers, setCareers] = React.useState([]);
  const [submitted, setSubmitted] = React.useState(null);
  const [form, setForm] = React.useState({
    type: "roadmap-step",
    careerId: params.get("career") || "",
    title: "",
    proposed: "",
    explanation: "",
    sourceUrl: "",
    contributor: "",
  });
  const [error, setError] = React.useState("");
  React.useEffect(() => {
    repository.getCareers().then(setCareers);
  }, []);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    setError("");
    if (
      !form.title.trim() ||
      !form.proposed.trim() ||
      !form.explanation.trim()
    ) {
      setError("Please complete the title, proposed change, and explanation.");
      return;
    }
    if (form.sourceUrl && !/^https?:\/\//i.test(form.sourceUrl)) {
      setError("Source URL must begin with https:// or http://");
      return;
    }
    const result = await repository.addContribution(form);
    setSubmitted(result);
  }
  if (submitted)
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="card p-8 text-center sm:p-12">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={32} />
          </span>
          <h1 className="mt-5 text-3xl font-black text-slate-900">
            Contribution received
          </h1>
          <p className="mt-3 text-slate-500">
            Thanks for helping improve PathSaarthi. Your suggestion is now in
            the demo review queue.
          </p>
          <div className="mx-auto mt-6 max-w-md rounded-xl bg-slate-50 p-4 text-left text-sm">
            <p>
              <span className="font-bold">Reference:</span> {submitted.id}
            </p>
            <p className="mt-1">
              <span className="font-bold">Status:</span> Pending review
            </p>
            <p className="mt-1">
              <span className="font-bold">Suggestion:</span> {submitted.title}
            </p>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              className="btn-primary"
              onClick={() => {
                setSubmitted(null);
                setForm({
                  ...form,
                  title: "",
                  proposed: "",
                  explanation: "",
                  sourceUrl: "",
                });
              }}
            >
              Submit another
            </button>
            <Link to="/careers" className="btn-secondary">
              Explore careers
            </Link>
          </div>
        </div>
      </main>
    );
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Build better guidance together"
        title="Contribute to a career pathway"
        description="Share a correction, useful resource, skill, or roadmap idea. Submissions are reviewed before any public content changes."
      />
      <div className="grid gap-7 lg:grid-cols-[.75fr_1.25fr]">
        <aside className="space-y-5">
          <div className="rounded-2xl bg-linear-to-br from-brand-700 to-indigo-800 p-6 text-white">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/15">
              <Lightbulb />
            </span>
            <h2 className="mt-5 text-xl font-extrabold">
              Every useful suggestion helps
            </h2>
            <p className="mt-2 text-sm leading-6 text-violet-100">
              Pathways change over time. Share credible sources and practical
              details that help students understand their options.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-violet-50">
              <li className="flex gap-2">
                <CheckCircle2 size={16} /> Suggest a missing milestone
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={16} /> Correct outdated information
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={16} /> Recommend a learning resource
              </li>
            </ul>
          </div>
          <div className="card p-5">
            <h3 className="font-extrabold">What happens next?</h3>
            <ol className="mt-3 space-y-3 text-sm text-slate-600">
              <li>
                <span className="mr-2 font-extrabold text-brand-600">01</span>{" "}
                Your suggestion enters the review queue.
              </li>
              <li>
                <span className="mr-2 font-extrabold text-brand-600">02</span> A
                reviewer checks the details and source.
              </li>
              <li>
                <span className="mr-2 font-extrabold text-brand-600">03</span>{" "}
                Approved changes are applied separately before publishing.
              </li>
            </ol>
          </div>
        </aside>
        <form onSubmit={submit} className="card p-6 sm:p-8">
          <h2 className="text-xl font-extrabold">Suggestion details</h2>
          <p className="mt-1 text-sm text-slate-500">
            Fields marked with * are required.
          </p>
          {error && (
            <div
              role="alert"
              className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
            >
              {error}
            </div>
          )}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label">Contribution type *</label>
              <select
                name="type"
                value={form.type}
                onChange={change}
                className="input"
              >
                <option value="career">Suggest a new career</option>
                <option value="roadmap-step">Roadmap step</option>
                <option value="skill">Skill</option>
                <option value="qualification">Qualification</option>
                <option value="resource">Learning resource</option>
                <option value="correction">Correction / update</option>
              </select>
            </div>
            <div>
              <label className="label">Related career</label>
              <select
                name="careerId"
                value={form.careerId}
                onChange={change}
                className="input"
              >
                <option value="">Not specific to a career</option>
                {careers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Suggestion title *</label>
              <input
                name="title"
                value={form.title}
                onChange={change}
                className="input"
                placeholder="e.g. Add portfolio review to software developer roadmap"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Proposed change *</label>
              <textarea
                name="proposed"
                value={form.proposed}
                onChange={change}
                className="input min-h-28 resize-y"
                placeholder="Describe the specific information you recommend adding or changing."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Why is this useful? *</label>
              <textarea
                name="explanation"
                value={form.explanation}
                onChange={change}
                className="input min-h-24 resize-y"
                placeholder="Explain why students would benefit from this change."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">
                Supporting source URL (recommended)
              </label>
              <input
                name="sourceUrl"
                value={form.sourceUrl}
                onChange={change}
                className="input"
                placeholder="https://..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Your name (optional)</label>
              <input
                name="contributor"
                value={form.contributor}
                onChange={change}
                className="input"
                placeholder="How should we identify you?"
              />
            </div>
          </div>
          <button className="btn-primary mt-6 w-full sm:w-auto">
            <Send size={16} /> Submit for review
          </button>
          <p className="mt-4 text-xs leading-5 text-slate-400">
            This MVP stores contributions in your browser's local storage unless
            the optional API is configured. Do not submit private or sensitive
            information.
          </p>
        </form>
      </div>
    </main>
  );
}
