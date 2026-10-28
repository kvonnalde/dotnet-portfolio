using Portfolio.Application.DTOs.Insights;

namespace Portfolio.Application.Interfaces;

public interface IInsightsService
{
    Task<InsightsLogsResponse> GetRecentLogsAsync(int take, CancellationToken cancellationToken);
}
