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

// Accent glow + badge styling per service, used on the dark "code card" so each service still reads distinctly.
const servicePanelAccents: Record<string, { ring: string; dot: string; chip: string }> = {
  "Web App Development": { ring: "ring-blue-500/20", dot: "bg-blue-400", chip: "bg-blue-500/10 text-blue-300 ring-blue-500/20" },
  "Cloud & DevOps": { ring: "ring-sky-500/20", dot: "bg-sky-400", chip: "bg-sky-500/10 text-sky-300 ring-sky-500/20" },
  "AI Integration": { ring: "ring-indigo-500/20", dot: "bg-indigo-400", chip: "bg-indigo-500/10 text-indigo-300 ring-indigo-500/20" },
  "Report Development": { ring: "ring-emerald-500/20", dot: "bg-emerald-400", chip: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20" },
  "Low-Code No-Code Development": { ring: "ring-violet-500/20", dot: "bg-violet-400", chip: "bg-violet-500/10 text-violet-300 ring-violet-500/20" },
  Automation: { ring: "ring-amber-500/20", dot: "bg-amber-400", chip: "bg-amber-500/10 text-amber-300 ring-amber-500/20" },
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

// Renders the service data as a modern dark "code card" — same terminal language as the Application Insights page.
function ServiceJsonBlock({ service }: { service: Service }) {
  const lastIndex = service.highlights.length - 1;
  const panel = servicePanelAccents[service.title] ?? { ring: "ring-slate-500/20", dot: "bg-slate-400", chip: "bg-slate-500/10 text-slate-300 ring-slate-500/20" };

  return (
    <div className={`overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-[#121218] to-[#0a0a0d] shadow-lg shadow-black/30 ring-1 ${panel.ring}`}>
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2 backdrop-blur">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <span className="ml-1 truncate text-[11px] text-slate-500">{slugify(service.title)}.json</span>
        <span className={`ml-auto flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${panel.chip}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${panel.dot}`} />
          service
        </span>
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
      <span className="text-cyan-300">{text}</span>
      <JsonPunct text='"' />
    </>
  );
}

function JsonString({ text }: { text: string }) {
  return (
    <>
      <JsonPunct text='"' />
      <span className="text-emerald-300">{text}</span>
      <JsonPunct text='"' />
    </>
  );
}

function JsonPunct({ text }: { text: string }) {
  return <span className="text-slate-500">{text}</span>;
}

