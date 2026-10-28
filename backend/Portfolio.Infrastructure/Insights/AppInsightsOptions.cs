namespace Portfolio.Infrastructure.Insights;

public sealed class AppInsightsOptions
{
    public const string SectionName = "AppInsights";

    // ARM resource ID of the Application Insights component to query (e.g. /subscriptions/.../components/my-app-insights).
    public string ResourceId { get; set; } = string.Empty;
}
