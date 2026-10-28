using System.Net.Http.Headers;
using System.Threading.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Portfolio.Infrastructure.Data;
using Portfolio.Application.Interfaces;
using Portfolio.Application.Services;
using Portfolio.Infrastructure.Insights;
using Portfolio.Infrastructure.Rag;
using Portfolio.Infrastructure.Repositories;




var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<
    IProjectRepository,
    ProjectRepository>();

builder.Services.AddScoped<
    IProjectService,
    ProjectService>();

builder.Services.Configure<RagOptions>(builder.Configuration.GetSection(RagOptions.SectionName));
builder.Services.PostConfigure<RagOptions>(options =>
    options.KnowledgeFilePath = Path.Combine(builder.Environment.ContentRootPath, options.KnowledgeFilePath));

builder.Services.AddSingleton<KnowledgeBase>();
builder.Services.AddHttpClient<OpenAiClient>((sp, client) =>
{
    var rag = sp.GetRequiredService<IOptions<RagOptions>>().Value;
    client.BaseAddress = new Uri(rag.BaseUrl.TrimEnd('/') + "/");
    if (string.Equals(rag.ApiKeyHeader, "Authorization", StringComparison.OrdinalIgnoreCase))
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", rag.ApiKey);
    }
    else
    {
        client.DefaultRequestHeaders.TryAddWithoutValidation(rag.ApiKeyHeader, rag.ApiKey);
    }
    client.Timeout = TimeSpan.FromSeconds(60);
});
builder.Services.AddScoped<IChatService, RagChatService>();

builder.Services.Configure<AppInsightsOptions>(builder.Configuration.GetSection(AppInsightsOptions.SectionName));
builder.Services.AddScoped<IInsightsService, AppInsightsService>();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins).AllowAnyHeader().WithMethods("GET", "POST")));

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("chat", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1),
            }));
});

builder.Services.AddControllers();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<PortfolioDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors();
app.UseRateLimiter();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
