import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Globe,
  ListTree,
  RefreshCw,
  TerminalSquare,
} from "lucide-react";
import { fetchInsightsLogs, type InsightsLogEntry } from "../../services/insightsService";

const REFRESH_INTERVAL_MS = 8000;

type TypeFilter = "all" | "trace" | "request" | "exception";

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "trace", label: "Traces" },
  { value: "request", label: "Requests" },
  { value: "exception", label: "Exceptions" },
];

const typeMeta: Record<string, { icon: typeof Globe; text: string; chip: string }> = {
  trace: { icon: ListTree, text: "text-slate-400", chip: "bg-slate-500/10 text-slate-300 ring-slate-500/20" },
  request: { icon: Globe, text: "text-cyan-300", chip: "bg-cyan-500/10 text-cyan-300 ring-cyan-500/20" },
  exception: { icon: AlertTriangle, text: "text-rose-300", chip: "bg-rose-500/10 text-rose-300 ring-rose-500/20" },
};

const levelDot: Record<string, string> = {
  error: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.7)]",
  warning: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]",
  info: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
};

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        checked ? "bg-emerald-500" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function ApplicationInsights() {
  const [logs, setLogs] = useState<InsightsLogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filter, setFilter] = useState<TypeFilter>("all");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetchInsightsLogs(100);
      setLogs(response.logs);
      setError(response.error);
      setLastUpdated(new Date());
    } catch {
      setError("Unable to reach the backend telemetry endpoint.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = window.setInterval(load, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [autoRefresh, load]);

  const filteredLogs = useMemo(
    () => (filter === "all" ? logs : logs.filter((log) => log.type === filter)),
    [logs, filter],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [filteredLogs]);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Application Insights</h1>
          <p className="mt-2 text-slate-600">Live telemetry streamed from the deployed backend.</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            Auto-refresh
            <Toggle checked={autoRefresh} onChange={setAutoRefresh} />
          </label>
          <button
            type="button"
            onClick={load}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-amber-300 hover:bg-amber-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#121218] to-[#0a0a0d] shadow-2xl shadow-black/40 ring-1 ring-black/5">
        <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <TerminalSquare className="h-3.5 w-3.5" /> backend — application-insights.log
          </span>

          <span className="ml-1 flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Live
          </span>

          <div className="ml-auto flex items-center gap-1 rounded-full bg-white/5 p-1">
            {TYPE_FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  filter === option.value
                    ? "bg-white/15 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {lastUpdated && (
            <span className="text-[11px] text-slate-500">Updated {formatTime(lastUpdated.toISOString())}</span>
          )}
        </div>

        <div
          ref={scrollRef}
          className="h-[28rem] overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent"
        >
          {loading && <p className="text-slate-500">Connecting to telemetry stream…</p>}

          {!loading && error && (
            <p className="text-amber-400">
              <span className="text-slate-500">$</span> {error}
            </p>
          )}

          {!loading && !error && filteredLogs.length === 0 && (
            <p className="text-slate-500">No telemetry recorded in the last 6 hours.</p>
          )}

          {filteredLogs.map((log, index) => {
            const meta = typeMeta[log.type] ?? typeMeta.trace;
            const Icon = meta.icon;
            return (
              <div
                key={`${log.timestamp}-${index}`}
                className="group flex items-start gap-2.5 rounded-md px-2 py-1 -mx-2 transition-colors hover:bg-white/[0.04]"
              >
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${levelDot[log.level.toLowerCase()] ?? "bg-slate-500"}`} />
                <span className="shrink-0 text-slate-600">{formatTime(log.timestamp)}</span>
                <span
                  className={`flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ring-1 ${meta.chip}`}
                >
                  <Icon className="h-3 w-3" />
                  {log.type}
                </span>
                <span className="whitespace-pre-wrap break-all text-slate-200">{log.message}</span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Frontend telemetry isn't instrumented yet — only backend traces, requests and exceptions are shown here.
      </p>
    </section>
  );
}
