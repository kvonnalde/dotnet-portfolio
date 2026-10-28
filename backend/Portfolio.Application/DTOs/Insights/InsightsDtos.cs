namespace Portfolio.Application.DTOs.Insights;

public sealed record InsightsLogEntry(DateTimeOffset Timestamp, string Type, string Level, string Message);

public sealed record InsightsLogsResponse(IReadOnlyList<InsightsLogEntry> Logs, string? Error);
