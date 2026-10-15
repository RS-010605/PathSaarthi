import React from "react";
import { Mail, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "../components";
export default function Contact() {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState("");
  function submit(e) {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!form.message.trim()) {
      setError("Please enter a message.");
      return;
    }
    const old = JSON.parse(
      localStorage.getItem("pathsaarthi.contactMessages") || "[]",
    );
    localStorage.setItem(
      "pathsaarthi.contactMessages",
      JSON.stringify([
        { ...form, id: Date.now(), createdAt: new Date().toISOString() },
        ...old,
      ]),
    );
    setSent(true);
  }
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Get in touch"
        title="We would like to hear from you"
        description="Share feedback, report an issue, or ask about the PathSaarthi concept."
      />
      <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
        <aside className="rounded-2xl bg-linear-to-br from-brand-700 to-indigo-800 p-7 text-white">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/15">
            <MessageCircle />
          </span>
          <h2 className="mt-5 text-2xl font-extrabold">
            Let's make career guidance clearer.
          </h2>
          <p className="mt-3 text-sm leading-6 text-violet-100">
            For this demo, contact messages are saved locally in your browser.
            Connect a backend email or ticket service before public launch.
          </p>
          <div className="mt-7 flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-4">
            <Mail />
            <div>
              <p className="text-sm font-bold">Contact form</p>
              <p className="text-xs text-violet-200">Demo-only local storage</p>
            </div>
          </div>
        </aside>
        <div className="card p-6 sm:p-8">
          {sent ? (
            <div className="py-12 text-center">
              <CheckCircle2 size={42} className="mx-auto text-emerald-500" />
              <h2 className="mt-4 text-2xl font-black">Message saved</h2>
              <p className="mt-2 text-sm text-slate-500">
                Thanks for your feedback. This prototype saved your message in
                this browser.
              </p>
              <button
                className="btn-secondary mt-5"
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", email: "", subject: "", message: "" });
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {error && (
                <div
                  role="alert"
                  className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
                >
                  {error}
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Name</label>
                  <input
                    className="input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label">Subject</label>
                <input
                  className="input"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea
                  className="input min-h-36 resize-y"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                  placeholder="Tell us what is on your mind..."
                />
              </div>
              <button className="btn-primary">
                <Send size={16} /> Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
