using System.Text.Json;

namespace FreshMart.Api.Models;

public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public decimal Price { get; set; }
    public required string Unit { get; set; }
    public bool Featured { get; set; }
    public required string Image { get; set; }
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
}

public class Category
{
    public int Id { get; set; }
    public required string Slug { get; set; }
    public required string Label { get; set; }
    public string Icon { get; set; } = "fas fa-tag";
    public required string Image { get; set; }
    public List<Product> Products { get; set; } = [];
}

public class User
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public string Role { get; set; } = "customer";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public record ProductRequest(string Name, decimal Price, string Unit, bool Featured, string Image, int CategoryId);
public record CategoryRequest(string Slug, string Label, string Icon, string Image);
public record UserRequest(string Name, string Email, string Password, string Role);
public record AuthRequest(string Email, string Password);
public record OrderRequest(JsonElement Customer, JsonElement Shipping, string Payment, JsonElement Items, JsonElement Totals);

public class Order
{
    public int Id { get; set; }
    public required string OrderId { get; set; }
    public required string CustomerJson { get; set; }
    public required string ShippingJson { get; set; }
    public required string Payment { get; set; }
    public required string ItemsJson { get; set; }
    public required string TotalsJson { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
