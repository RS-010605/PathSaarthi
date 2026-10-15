import React from "react";
import {
  Compass,
  ShieldCheck,
  Languages,
  Route,
  Users,
  HeartHandshake,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeading } from "../components";
export default function About() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-4xl bg-linear-to-br from-brand-700 to-indigo-800 p-8 text-white sm:p-12">
        <p className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-200">
          About PathSaarthi Gujarat
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
          Career choices deserve clarity, not confusion.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-violet-100">
          PathSaarthi is a career-navigation concept designed to help students
          understand the routes, skills, and milestones that connect education
          to future work.
        </p>
      </section>
      <section className="py-14">
        <SectionHeading
          eyebrow="Our approach"
          title="Make the next step easier to see"
          description="The platform turns career exploration into a structured, editable pathway that can improve as information changes."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Compass,
              title: "Clear pathways",
              desc: "Explore ordered milestones rather than a list of job titles.",
            },
            {
              icon: ShieldCheck,
              title: "Transparent guidance",
              desc: "Show what is verified, what is a recommendation, and what needs checking.",
            },
            {
              icon: Languages,
              title: "Regional language support",
              desc: "Build toward Gujarati, Hindi, and English access.",
            },
            {
              icon: Route,
              title: "Dynamic roadmaps",
              desc: "Let authorized editors update pathway steps without rewriting the frontend.",
            },
            {
              icon: Users,
              title: "Community contribution",
              desc: "Invite corrections and resources through a review process.",
            },
            {
              icon: HeartHandshake,
              title: "Student-first design",
              desc: "Make information approachable for school, college, and vocational learners.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <article key={title} className="card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon />
              </span>
              <h2 className="mt-4 text-lg font-extrabold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
        <h2 className="font-extrabold text-amber-900">
          Important content disclaimer
        </h2>
        <p className="mt-2 text-sm leading-6 text-amber-800">
          This is an MVP prototype. Career descriptions and learning routes are
          illustrative and may be incomplete. Admission, eligibility, licensing,
          and recruitment requirements can change. Always confirm them with the
          relevant official board, institution, regulator, or recruitment
          authority.
        </p>
      </section>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/careers" className="btn-primary">
          Explore careers
        </Link>
        <Link to="/contribute" className="btn-secondary">
          Help improve pathways
        </Link>
      </div>
    </main>
  );
}
