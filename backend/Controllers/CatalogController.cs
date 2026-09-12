using FreshMart.Api.Data;
using FreshMart.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FreshMart.Api.Controllers;

[ApiController]
[Route("api")]
public class CatalogController(FreshMartDbContext db) : ControllerBase
{
    private static readonly PasswordHasher<User> PasswordHasher = new();
    [HttpGet("products")]
    public async Task<IActionResult> GetProducts([FromQuery] string? search, [FromQuery] int? categoryId)
    {
        var query = db.Products.Include(product => product.Category).AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search)) query = query.Where(product => product.Name.Contains(search));
        if (categoryId.HasValue) query = query.Where(product => product.CategoryId == categoryId.Value);
        return Ok(await query.OrderBy(product => product.Name).Select(product => new
        {
            product.Id,
            product.Name,
            product.Price,
            product.Unit,
            product.Featured,
            product.Image,
            product.CategoryId,
            Category = product.Category == null ? null : new { product.Category.Id, product.Category.Slug, product.Category.Label }
        }).ToListAsync());
    }

    [HttpPost("products")]
    public async Task<IActionResult> CreateProduct(ProductRequest request)
    {
        if (!await db.Categories.AnyAsync(category => category.Id == request.CategoryId)) return BadRequest("Category not found");
        var product = new Product { Name = request.Name.Trim(), Price = request.Price, Unit = request.Unit.Trim(), Featured = request.Featured, Image = request.Image.Trim(), CategoryId = request.CategoryId };
        db.Products.Add(product);
        await db.SaveChangesAsync();
        return Created($"api/products/{product.Id}", product);
    }

    [HttpPut("products/{id:int}")]
    public async Task<IActionResult> UpdateProduct(int id, ProductRequest request)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return NotFound();
        product.Name = request.Name.Trim(); product.Price = request.Price; product.Unit = request.Unit.Trim(); product.Featured = request.Featured; product.Image = request.Image.Trim(); product.CategoryId = request.CategoryId;
        await db.SaveChangesAsync();
        return Ok(product);
    }

    [HttpDelete("products/{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return NotFound();
        db.Products.Remove(product);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories() => Ok(await db.Categories.AsNoTracking().Select(category => new
    {
        category.Id,
        category.Slug,
        category.Label,
        category.Icon,
        category.Image,
        ProductCount = category.Products.Count
    }).ToListAsync());

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory(CategoryRequest request)
    {
        var category = new Category { Slug = request.Slug.Trim().ToLowerInvariant(), Label = request.Label.Trim(), Icon = request.Icon.Trim(), Image = request.Image.Trim() };
        db.Categories.Add(category);
        await db.SaveChangesAsync();
        return Created($"api/categories/{category.Id}", category);
    }

    [HttpPut("categories/{id:int}")]
    public async Task<IActionResult> UpdateCategory(int id, CategoryRequest request)
    {
        var category = await db.Categories.FindAsync(id);
        if (category is null) return NotFound();
        category.Slug = request.Slug.Trim().ToLowerInvariant(); category.Label = request.Label.Trim(); category.Icon = request.Icon.Trim(); category.Image = request.Image.Trim();
        await db.SaveChangesAsync();
        return Ok(category);
    }

    [HttpDelete("categories/{id:int}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await db.Categories.Include(item => item.Products).FirstOrDefaultAsync(item => item.Id == id);
        if (category is null) return NotFound();
        if (category.Products.Count > 0) return Conflict("Move or delete products in this category first");
        db.Categories.Remove(category);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers() => Ok(await db.Users.AsNoTracking().Select(user => new { user.Id, user.Name, user.Email, user.Role, user.CreatedAt }).ToListAsync());

    [HttpPost("users")]
    public async Task<IActionResult> CreateUser(UserRequest request)
    {
        if (await db.Users.AnyAsync(user => user.Email == request.Email.Trim().ToLowerInvariant())) return Conflict("Email already exists");
        var user = new User { Name = request.Name.Trim(), Email = request.Email.Trim().ToLowerInvariant(), PasswordHash = string.Empty, Role = request.Role == "admin" ? "admin" : "customer" };
        user.PasswordHash = PasswordHasher.HashPassword(user, request.Password);
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return Created($"api/users/{user.Id}", new { user.Id, user.Name, user.Email, user.Role, user.CreatedAt });
    }

    [HttpDelete("users/{id:int}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null) return NotFound();
        db.Users.Remove(user);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("users/{id:int}")]
    public async Task<IActionResult> UpdateUser(int id, UserRequest request)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null) return NotFound();
        var email = request.Email.Trim().ToLowerInvariant();
        if (await db.Users.AnyAsync(item => item.Id != id && item.Email == email)) return Conflict("Email already exists");
        user.Name = request.Name.Trim();
        user.Email = email;
        user.Role = request.Role == "admin" ? "admin" : "customer";
        if (!string.IsNullOrWhiteSpace(request.Password)) user.PasswordHash = PasswordHasher.HashPassword(user, request.Password);
        await db.SaveChangesAsync();
        return Ok(new { user.Id, user.Name, user.Email, user.Role, user.CreatedAt });
    }
    [HttpGet("products/{id:int}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var product = await db.Products.AsNoTracking()
            .Where(item => item.Id == id)
            .Select(item => new
            {
                item.Id, item.Name, item.Price, item.Unit, item.Featured, item.Image,
                Category = item.Category == null ? null : new { item.Category.Id, item.Category.Slug, item.Category.Label }
            }).FirstOrDefaultAsync();
        return product is null ? NotFound() : Ok(product);
    }
}
