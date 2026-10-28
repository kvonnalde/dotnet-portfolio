import { API_URL } from "../config/api";

export interface InsightsLogEntry {
  timestamp: string;
  type: "trace" | "request" | "exception" | string;
  level: string;
  message: string;
}

export interface InsightsLogsResponse {
  logs: InsightsLogEntry[];
  error: string | null;
}

export async function fetchInsightsLogs(take = 100): Promise<InsightsLogsResponse> {
  const response = await fetch(`${API_URL}/api/insights/logs?take=${take}`);

  if (!response.ok) {
    throw new Error("Failed to load Application Insights logs.");
  }

  return response.json();
}
