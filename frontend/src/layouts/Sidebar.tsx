import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, ChevronRight, FileJson, FileText, Folder, FolderOpen } from "lucide-react";
import { profile } from "../data/profile";
import { workspacePages } from "../data/workspacePages";

type NavItem = {
  label: string;
  file: string;
  to: string;
  end?: boolean;
};

// Always-collapsed, childless folder used purely to mimic a real project tree.
const decorativeFolders = [".vscode"];

export default function Sidebar() {
  const [rootOpen, setRootOpen] = useState(true);
  const [contentOpen, setContentOpen] = useState(true);

  return (
    <aside aria-label="File explorer" className="workspace-sidebar flex h-full w-full flex-col overflow-hidden border-b lg:w-[260px] lg:border-b-0 lg:border-r">
      <div className="workspace-sidebar-rule flex h-9 shrink-0 items-center border-b px-4">
        <span className="workspace-sidebar-heading text-[11px] font-semibold uppercase tracking-[0.12em]">
          Explorer
        </span>
      </div>

      <nav aria-label="Portfolio files" className="min-h-0 flex-1 overflow-y-auto py-2 text-[13px]">
        <FolderRow
          depth={0}
          label={profile.name.toUpperCase()}
          open={rootOpen}
          onToggle={() => setRootOpen((current) => !current)}
        />

        {rootOpen && (
          <>
            <StaticFolderRow depth={1} label={decorativeFolders[0]} />

            <FolderRow
              depth={1}
              label="content"
              open={contentOpen}
              onToggle={() => setContentOpen((current) => !current)}
            />
            {contentOpen && workspacePages.map((item) => <FileRow key={item.to} depth={2} item={item} />)}

            <StaticFileRow depth={1} label="README.md" icon={FileText} color="text-[var(--file-color)]" />
            <StaticFileRow depth={1} label="package.json" icon={FileJson} color="text-amber-500" />
          </>
        )}
      </nav>
    </aside>
  );
}

// Always-collapsed folder row with no children, purely for visual realism.
function StaticFolderRow({ depth, label }: { depth: number; label: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex w-full items-center gap-1 py-[3px] pr-2 text-[var(--chrome-muted)]"
      style={{ paddingLeft: 8 + depth * 14 }}
    >
      <ChevronRight className="h-3.5 w-3.5 shrink-0" />
      <Folder className="h-4 w-4 shrink-0 text-[var(--folder-color)]" />
      <span className="truncate font-medium">{label}</span>
    </div>
  );
}

// Non-navigable file row, purely for visual realism.
function StaticFileRow({
  depth,
  label,
  icon: Icon,
  color,
}: {
  depth: number;
  label: string;
  icon: typeof FileText;
  color: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-1.5 py-[3px] pr-2 text-[var(--chrome-muted)]"
      style={{ paddingLeft: 8 + depth * 14 + 16 }}
    >
      <Icon className={`h-4 w-4 shrink-0 ${color}`} />
      <span className="truncate">{label}</span>
    </div>
  );
}

function FolderRow({
  depth,
  label,
  open,
  onToggle,
}: {
  depth: number;
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="workspace-sidebar-hover flex w-full items-center gap-1 py-[3px] pr-2 text-left"
      style={{ paddingLeft: 8 + depth * 14 }}
    >
      {open ? (
        <ChevronDown className="h-3.5 w-3.5 shrink-0" />
      ) : (
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
      )}
      {open ? (
        <FolderOpen className="h-4 w-4 shrink-0 text-[var(--folder-color)]" />
      ) : (
        <Folder className="h-4 w-4 shrink-0 text-[var(--folder-color)]" />
      )}
      <span className="truncate font-medium">{label}</span>
    </button>
  );
}

function FileRow({ depth, item }: { depth: number; item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      title={item.label}
      style={{ paddingLeft: 8 + depth * 14 + 16 }}
      className={({ isActive }) =>
        `flex items-center gap-1.5 py-[3px] pr-2 transition-colors ${
          isActive ? "workspace-sidebar-active" : "workspace-sidebar-hover"
        }`
      }
    >
      <FileText className="h-4 w-4 shrink-0 text-[var(--file-color)]" />
      <span className="truncate">{item.file}</span>
    </NavLink>
  );
}
