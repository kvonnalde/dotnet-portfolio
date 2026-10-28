namespace Portfolio.Infrastructure.Insights;

public sealed class AppInsightsOptions
{
    public const string SectionName = "AppInsights";

    // Workspace GUID ( "Workspace ID" / customerId) of the Log Analytics workspace backing this workspace-based Application Insights resource.
    public string WorkspaceId { get; set; } = string.Empty;
}
