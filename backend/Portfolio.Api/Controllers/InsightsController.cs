using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.DTOs.Insights;
using Portfolio.Application.Interfaces;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InsightsController : ControllerBase
{
    private readonly IInsightsService _insightsService;

    public InsightsController(IInsightsService insightsService)
    {
        _insightsService = insightsService;
    }

    [HttpGet("logs")]
    public async Task<ActionResult<InsightsLogsResponse>> GetLogs(
        [FromQuery] int take,
        CancellationToken cancellationToken)
    {
        return Ok(await _insightsService.GetRecentLogsAsync(take == 0 ? 50 : take, cancellationToken));
    }
}
