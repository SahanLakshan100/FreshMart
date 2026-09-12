using FreshMart.Api.Data;
using FreshMart.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<FreshMartDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("FreshMart")));
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
    policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<FreshMartDbContext>();
    if (!await db.Users.AnyAsync(user => user.Role == "admin"))
    {
        var admin = new User
        {
            Name = "FreshMart Admin",
            Email = "admin@freshmart.lk",
            PasswordHash = string.Empty,
            Role = "admin"
        };
        admin.PasswordHash = new PasswordHasher<User>().HashPassword(admin, "admin123");
        db.Users.Add(admin);
        await db.SaveChangesAsync();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseAuthorization();
app.UseCors();

app.MapControllers();

app.Run();
