using Azure.Identity;
using Azure.Monitor.Query;
using Azure.Monitor.Query.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Portfolio.Application.DTOs.Insights;
using Portfolio.Application.Interfaces;

namespace Portfolio.Infrastructure.Insights;

public sealed class AppInsightsService : IInsightsService
{
    // Merges traces, requests and exceptions into one chronological feed for the log viewer.
    private const string QueryTemplate = """
        union isfuzzy=true
            (AppTraces | project Timestamp=TimeGenerated, Type="trace", Level=tostring(SeverityLevel), Message=Message),
            (AppRequests | project Timestamp=TimeGenerated, Type="request", Level=iif(Success, "Info", "Warning"), Message=strcat(Name, " -> ", ResultCode, " (", round(DurationMs, 0), "ms)")),
            (AppExceptions | project Timestamp=TimeGenerated, Type="exception", Level="Error", Message=OuterMessage)
        | order by Timestamp desc
        | take {0}
        """;

    private readonly LogsQueryClient _client;
    private readonly AppInsightsOptions _options;
    private readonly ILogger<AppInsightsService> _logger;

    public AppInsightsService(IOptions<AppInsightsOptions> options, ILogger<AppInsightsService> logger)
    {
        _options = options.Value;
        _client = new LogsQueryClient(new DefaultAzureCredential());
        _logger = logger;
    }

    public async Task<InsightsLogsResponse> GetRecentLogsAsync(int take, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.WorkspaceId))
        {
            return new InsightsLogsResponse([], "Application Insights is not configured for this environment.");
        }

        try
        {
            var kql = string.Format(QueryTemplate, Math.Clamp(take, 1, 200));
            var response = await _client.QueryWorkspaceAsync(
                _options.WorkspaceId,
                kql,
                new QueryTimeRange(TimeSpan.FromHours(6)),
                cancellationToken: cancellationToken);

            var logs = response.Value.Table.Rows
                .Select(row => new InsightsLogEntry(
                    row["Timestamp"] is DateTimeOffset timestamp ? timestamp : DateTimeOffset.UtcNow,
                    row["Type"]?.ToString() ?? "trace",
                    row["Level"]?.ToString() ?? "Info",
                    row["Message"]?.ToString() ?? string.Empty))
                .ToList();

            return new InsightsLogsResponse(logs, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to query Application Insights logs.");
            return new InsightsLogsResponse([], "Unable to reach Application Insights right now.");
        }
    }
}
