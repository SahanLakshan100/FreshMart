using Microsoft.EntityFrameworkCore;
using FreshMart.Api.Models;

namespace FreshMart.Api.Data;

public class FreshMartDbContext(DbContextOptions<FreshMartDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Cart> Carts => Set<Cart>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>().Property(product => product.Price).HasPrecision(18, 2);
        modelBuilder.Entity<Product>().HasIndex(product => product.Name);
        modelBuilder.Entity<Category>().HasIndex(category => category.Slug).IsUnique();
        modelBuilder.Entity<User>().HasIndex(user => user.Email).IsUnique();
        modelBuilder.Entity<Product>()
            .HasOne(product => product.Category)
            .WithMany(category => category.Products)
            .HasForeignKey(product => product.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Cart>().HasIndex(cart => cart.SessionId).IsUnique();
        modelBuilder.Entity<Cart>()
            .HasOne(cart => cart.User)
            .WithMany()
            .HasForeignKey(cart => cart.UserId)
            .OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<Order>().Property(order => order.Subtotal).HasPrecision(18, 2);
        modelBuilder.Entity<Order>().Property(order => order.Delivery).HasPrecision(18, 2);
        modelBuilder.Entity<Order>().Property(order => order.Total).HasPrecision(18, 2);
        modelBuilder.Entity<OrderItem>().Property(item => item.UnitPrice).HasPrecision(18, 2);
        modelBuilder.Entity<OrderItem>()
            .HasOne(item => item.Order)
            .WithMany(order => order.Items)
            .HasForeignKey(item => item.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
