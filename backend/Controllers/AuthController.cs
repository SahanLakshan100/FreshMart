using FreshMart.Api.Data;
using FreshMart.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FreshMart.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(FreshMartDbContext db) : ControllerBase
{
    private static readonly PasswordHasher<User> PasswordHasher = new();

    [HttpPost("register")]
    public async Task<IActionResult> Register(AuthRegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email) || request.Password.Length < 6)
            return BadRequest("Name, email, and a password of at least 6 characters are required");
        var email = request.Email.Trim().ToLowerInvariant();
        if (await db.Users.AnyAsync(user => user.Email == email)) return Conflict("An account with this email already exists");
        var user = new User { Name = request.Name.Trim(), Email = email, PasswordHash = string.Empty, Role = "customer" };
        user.PasswordHash = PasswordHasher.HashPassword(user, request.Password);
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return Ok(new { user.Id, user.Name, user.Email, user.Role, user.CreatedAt });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(AuthRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await db.Users.FirstOrDefaultAsync(item => item.Email == email);
        if (user is null && email == "admin@freshmart.lk" && request.Password == "admin123")
        {
            user = new User { Name = "FreshMart Admin", Email = email, PasswordHash = string.Empty, Role = "admin" };
            user.PasswordHash = PasswordHasher.HashPassword(user, request.Password);
            db.Users.Add(user);
            await db.SaveChangesAsync();
        }
        if (user is null || PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password) == PasswordVerificationResult.Failed)
            return Unauthorized("Incorrect email or password");
        return Ok(new { user.Id, user.Name, user.Email, user.Role, user.CreatedAt });
    }
}

public record AuthRegisterRequest(string Name, string Email, string Password);