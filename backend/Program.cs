using Microsoft.AspNetCore.Identity;
using PlateBalance.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("AppDb")
    ?? throw new InvalidOperationException("Connection string 'AppDb' not found.");

builder.Services.AddAuthorization();

builder.Services.AddControllers(options =>
{
    options.Conventions.Add(new ApiPrefixConvention("api"));
});
builder.Services.AddOpenApi();

builder.Services.AddDbContext<ApplicationDbContext>(
    options => options.UseSqlServer(connectionString));

builder.Services.AddIdentityApiEndpoints<User>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "API v1");
    });

    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await db.Database.MigrateAsync();
    }
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapGroup("/api/auth").WithTags("Auth").MapIdentityApi<User>();

app.MapControllers();

app.Run();
