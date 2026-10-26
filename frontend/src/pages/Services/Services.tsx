import {
  BarChart3,
  Boxes,
  Cloud,
  Code2,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { services } from "../../data/services";

type Service = (typeof services)[number];

const serviceIcons: Record<string, LucideIcon> = {
  "Web App Development": Code2,
  "Cloud & DevOps": Cloud,
  "AI Integration": Sparkles,
  "Report Development": BarChart3,
  "Low-Code No-Code Development": Boxes,
  Automation: Workflow,
};

const serviceAccents: Record<string, string> = {
  "Web App Development": "bg-blue-500/10 text-blue-600",
  "Cloud & DevOps": "bg-sky-500/10 text-sky-600",
  "AI Integration": "bg-indigo-500/10 text-indigo-600",
  "Report Development": "bg-emerald-500/10 text-emerald-600",
  "Low-Code No-Code Development": "bg-violet-500/10 text-violet-600",
  Automation: "bg-amber-500/10 text-amber-600",
};

// Soft, hue-matched tint for each service's code card so it reads as part of the page, not a terminal.
const servicePanelAccents: Record<string, { panel: string; dot: string }> = {
  "Web App Development": { panel: "bg-blue-500/[0.06] border-blue-500/15", dot: "bg-blue-400" },
  "Cloud & DevOps": { panel: "bg-sky-500/[0.06] border-sky-500/15", dot: "bg-sky-400" },
  "AI Integration": { panel: "bg-indigo-500/[0.06] border-indigo-500/15", dot: "bg-indigo-400" },
  "Report Development": { panel: "bg-emerald-500/[0.06] border-emerald-500/15", dot: "bg-emerald-400" },
  "Low-Code No-Code Development": { panel: "bg-violet-500/[0.06] border-violet-500/15", dot: "bg-violet-400" },
  Automation: { panel: "bg-amber-500/[0.06] border-amber-500/15", dot: "bg-amber-400" },
};

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function Services() {
  return (
    <section>
      <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-[var(--chrome-text)]">
        <span aria-hidden="true">🎖️</span> Services
      </h1>
      <p className="mt-2 text-[var(--chrome-muted)]">
        From idea to deployment, I help you build scalable, secure, and modern applications.
      </p>

      <hr className="my-5 border-[var(--chrome-border)]" />

      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((service) => {
          const Icon = serviceIcons[service.title] ?? Sparkles;
          const accent = serviceAccents[service.title] ?? "bg-slate-500/10 text-slate-600";
          return (
            <article
              key={service.title}
              className="overflow-hidden rounded-lg border border-[var(--chrome-border)] bg-[var(--content-bg)] shadow-sm transition-colors hover:border-[var(--file-color)]"
            >
              <div className="flex items-center gap-2.5 border-b border-[var(--chrome-border)] px-4 py-3">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${accent}`}>
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                <h2 className="min-w-0 text-base font-bold text-[var(--chrome-text)]">{service.title}</h2>
              </div>
              <div className="p-3">
                <ServiceJsonBlock service={service} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// Renders the service data as a cozy, hand-colorized JSON snippet styled like a little editor card.
function ServiceJsonBlock({ service }: { service: Service }) {
  const lastIndex = service.highlights.length - 1;
  const panel = servicePanelAccents[service.title] ?? { panel: "bg-slate-500/[0.06] border-slate-500/15", dot: "bg-slate-400" };

  return (
    <div className={`overflow-hidden rounded-md border ${panel.panel}`}>
      <div className="flex items-center gap-1.5 border-b border-[var(--chrome-border)]/60 px-3 py-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${panel.dot}`} />
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--chrome-muted)]/30" />
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--chrome-muted)]/30" />
        <span className="ml-1.5 truncate text-[10px] text-[var(--chrome-muted)]">{slugify(service.title)}.json</span>
      </div>
      <pre className="whitespace-pre-wrap break-words px-3.5 py-3 font-mono text-[12.5px] leading-[1.9]">
        <code>
          <JsonPunct text="{" />
          {"\n  "}
          <JsonKey text="service" />
          <JsonPunct text=": " />
          <JsonString text={service.title} />
          <JsonPunct text="," />
          {"\n  "}
          <JsonKey text="summary" />
          <JsonPunct text=": " />
          <JsonString text={service.overview} />
          <JsonPunct text="," />
          {"\n  "}
          <JsonKey text="highlights" />
          <JsonPunct text=": [" />
          {service.highlights.map((item, index) => (
            <span key={item}>
              {"\n    "}
              <JsonString text={item} />
              {index < lastIndex && <JsonPunct text="," />}
            </span>
          ))}
          {"\n  "}
          <JsonPunct text="]" />
          {"\n"}
          <JsonPunct text="}" />
        </code>
      </pre>
    </div>
  );
}

function JsonKey({ text }: { text: string }) {
  return (
    <>
      <JsonPunct text='"' />
      <span className="text-[var(--json-key)]">{text}</span>
      <JsonPunct text='"' />
    </>
  );
}

function JsonString({ text }: { text: string }) {
  return (
    <>
      <JsonPunct text='"' />
      <span className="text-[var(--json-string)]">{text}</span>
      <JsonPunct text='"' />
    </>
  );
}

function JsonPunct({ text }: { text: string }) {
  return <span className="text-[var(--chrome-muted)]">{text}</span>;
}

