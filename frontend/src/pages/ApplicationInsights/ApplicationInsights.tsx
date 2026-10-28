import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw, TerminalSquare } from "lucide-react";
import { fetchInsightsLogs, type InsightsLogEntry } from "../../services/insightsService";

const REFRESH_INTERVAL_MS = 8000;

const levelColor: Record<string, string> = {
  error: "text-red-400",
  warning: "text-amber-400",
  info: "text-slate-200",
};

const typeColor: Record<string, string> = {
  trace: "text-slate-400",
  request: "text-cyan-400",
  exception: "text-red-400",
};

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function ApplicationInsights() {
  const [logs, setLogs] = useState<InsightsLogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetchInsightsLogs(100);
      setLogs(response.logs);
      setError(response.error);
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

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [logs]);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Application Insights</h1>
          <p className="mt-2 text-slate-600">Live telemetry streamed from the deployed backend.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(event) => setAutoRefresh(event.target.checked)}
            />
            Auto-refresh
          </label>
          <button
            type="button"
            onClick={load}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-amber-300 hover:bg-amber-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-slate-800 bg-[#0c0c0c] shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 bg-[#1a1a1a] px-4 py-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-3 flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <TerminalSquare className="h-3.5 w-3.5" /> backend — application-insights.log
          </span>
        </div>

        <div
          ref={scrollRef}
          className="h-[28rem] overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed"
        >
          {loading && <p className="text-slate-500">Connecting to telemetry stream…</p>}

          {!loading && error && (
            <p className="text-amber-400">
              <span className="text-slate-500">$</span> {error}
            </p>
          )}

          {!loading && !error && logs.length === 0 && (
            <p className="text-slate-500">No telemetry recorded in the last 6 hours.</p>
          )}

          {logs.map((log, index) => (
            <div key={`${log.timestamp}-${index}`} className="flex gap-2 whitespace-pre-wrap break-all">
              <span className="shrink-0 text-slate-600">{formatTime(log.timestamp)}</span>
              <span className={`shrink-0 font-semibold uppercase ${typeColor[log.type] ?? "text-slate-400"}`}>
                [{log.type}]
              </span>
              <span className={levelColor[log.level.toLowerCase()] ?? "text-slate-200"}>{log.message}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Frontend telemetry isn't instrumented yet — only backend traces, requests and exceptions are shown here.
      </p>
    </section>
  );
}
