import { useState } from "react";
import { FileText, LayoutDashboard, Sparkles } from "lucide-react";
import { projects, type PortfolioProject } from "../../data/projects";

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "AI", "Full Stack", ...new Set(projects.flatMap((project) => [
    ...project.tags.filter((tag) => tag !== "Azure OpenAI"),
    project.category,
  ]))];
  const filtered = projects.filter((project) => {
    if (filter === "All") return true;
    if (filter === "AI") return project.tags.includes("Azure OpenAI");
    if (filter === "Full Stack") return project.tags.includes("React") && project.tags.includes(".NET");
    return project.category === filter || project.tags.includes(filter);
  });
  const featured = filtered.find((project) => project.featured);
  const others = filtered.filter((project) => project !== featured);

  return (
    <section className="max-w-3xl">
      <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-[var(--chrome-text)]">
        <span aria-hidden="true">🚀</span> Projects
      </h1>
      <p className="mt-2 text-[var(--chrome-muted)]">
        A collection of applications, experiments, and solutions built with modern technologies.
      </p>

      <hr className="my-5 border-[var(--chrome-border)]" />

      <div role="group" aria-label="Filter projects" className="flex flex-wrap items-start gap-x-1.5 gap-y-2 font-mono text-[13px]">
        <span aria-hidden="true" className="pt-1 text-[var(--chrome-muted)]">-</span>
        {filters.map((item) => {
          const selected = filter === item;
          const label = item === "All" ? `All(${projects.length})` : item;
          return (
            <button
              key={item}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(item)}
              className={`rounded px-1 py-0.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0078d4] ${
                selected
                  ? "bg-emerald-500/15 font-semibold text-emerald-600"
                  : "text-[var(--chrome-text)] hover:bg-[var(--chrome-hover)]"
              }`}
            >
              [{label}]
            </button>
          );
        })}
      </div>

      <p role="status" className="sr-only">{filtered.length} projects shown</p>

      {featured && (
        <section aria-labelledby="featured-project-heading" className="mt-8">
          <h2 id="featured-project-heading" className="border-b border-[var(--chrome-border)] pb-2 text-xl font-bold text-[var(--chrome-text)]">
            Featured Projects
          </h2>
          <ProjectEntry project={featured} featured />
        </section>
      )}
      {others.length > 0 && (
        <section aria-labelledby="other-projects-heading" className="mt-8">
          <h2 id="other-projects-heading" className="border-b border-[var(--chrome-border)] pb-2 text-xl font-bold text-[var(--chrome-text)]">
            {featured ? "Other Projects" : "Matching Projects"}
          </h2>
          <div className="divide-y divide-[var(--chrome-border)]">
            {others.map((project) => <ProjectEntry key={project.title} project={project} />)}
          </div>
        </section>
      )}
      {filtered.length === 0 && <p className="py-8 text-[var(--chrome-muted)]">No projects match this filter.</p>}
    </section>
  );
}

function ProjectEntry({ project, featured = false }: { project: PortfolioProject; featured?: boolean }) {
  return (
    <article aria-label={project.title} className="grid gap-4 py-6 first:pt-4 sm:grid-cols-[minmax(0,1fr)_180px] sm:items-start">
      <div className="min-w-0">
        <h3 className="text-lg font-bold text-[var(--chrome-text)]">
          {project.title}
          {featured && <span className="ml-1.5 font-normal text-[var(--chrome-muted)]">(Featured)</span>}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--chrome-muted)]">{project.description}</p>
        <ul className="mt-3 space-y-1.5 text-sm text-[var(--chrome-text)]">
          <li className="flex gap-2">
            <span aria-hidden="true" className="text-[var(--chrome-muted)]">-</span>
            <span><strong>Tech Stack:</strong> {project.tags.join(", ")}</span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true" className="text-[var(--chrome-muted)]">-</span>
            <span><strong>Features:</strong> {project.highlights.join(", ")}</span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true" className="text-[var(--chrome-muted)]">-</span>
            <span>
              <strong>Links:</strong>{" "}
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-[#0078d4] underline underline-offset-2 hover:no-underline">
                  Live Demo
                </a>
              ) : (
                <span className="text-[var(--chrome-muted)]" title="Live demo not available yet">Live Demo</span>
              )}
              {" | "}
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-[#0078d4] underline underline-offset-2 hover:no-underline">
                  GitHub
                </a>
              ) : (
                <span className="text-[var(--chrome-muted)]" title="GitHub link not available yet">GitHub</span>
              )}
              {project.caseStudyUrl && (
                <>
                  {" | "}
                  <a href={project.caseStudyUrl} target="_blank" rel="noreferrer" className="text-[#0078d4] underline underline-offset-2 hover:no-underline">
                    Case Study
                  </a>
                </>
              )}
            </span>
          </li>
        </ul>
      </div>
      <ProjectThumbnail project={project} />
    </article>
  );
}

function ProjectThumbnail({ project }: { project: PortfolioProject }) {
  const applications = project.preview === "applications";
  return (
    <figure className={`min-w-0 overflow-hidden rounded-md border border-[var(--chrome-border)] ${applications ? "bg-[#eef2ff]" : "bg-[#17163c]"}`}>
      <div aria-hidden="true" className={`flex items-center gap-1 border-b px-2 py-1.5 ${applications ? "border-[#dce2f0] bg-[#f9faff]" : "border-white/10 bg-[#24204d]"}`}>
        {["bg-rose-400", "bg-amber-400", "bg-emerald-400"].map((color) => <span key={color} className={`h-1.5 w-1.5 rounded-full ${color}`} />)}
      </div>
      <div aria-hidden="true" className="flex min-h-28">
        <div className={`flex w-6 shrink-0 flex-col items-center gap-3 py-3 ${applications ? "bg-[#2563eb] text-white/80" : "bg-[#201d4a] text-[#a5b4fc]"}`}>
          <LayoutDashboard className="h-3 w-3" />
          <FileText className="h-3 w-3" />
          <Sparkles className="h-3 w-3" />
        </div>
        <div className="min-w-0 flex-1 p-2.5">
          <p className={`text-[11px] font-bold leading-tight ${applications ? "text-[#172554]" : "text-[#c4b5fd]"}`}>
            {applications ? "Your next chapter starts here." : "Turn ideas into clear plans."}
          </p>
          <div className="mt-2.5 grid grid-cols-3 gap-1">
            {[0, 1, 2].map((col) => (
              <div key={col} className={`h-6 rounded ${applications ? "bg-white" : "bg-[#332e65]"}`} />
            ))}
          </div>
          <div className="mt-2 space-y-1.5">
            {[0, 1].map((row) => (
              <div key={row} className={`h-3 rounded ${applications ? "bg-white/80" : "bg-white/5"}`} />
            ))}
          </div>
        </div>
      </div>
      <figcaption className={`truncate px-2 py-1.5 text-[9px] ${applications ? "text-[#64748b]" : "text-[#a5a0ca]"}`}>
        Illustrative preview &middot; {project.title}
      </figcaption>
    </figure>
  );
}
