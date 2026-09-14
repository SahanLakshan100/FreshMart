using System.Text.Json;
using FreshMart.Api.Data;
using FreshMart.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FreshMart.Api.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController(FreshMartDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetByEmail([FromQuery] string email)
    {
        if (string.IsNullOrWhiteSpace(email)) return BadRequest("email is required");

        var orders = await db.Orders.AsNoTracking().Include(order => order.Items).Where(order => order.CustomerEmail == email.Trim()).OrderByDescending(order => order.CreatedAt).ToListAsync();
        var history = orders.Select(order => new
            {
                order.OrderId,
                order.CreatedAt,
                order.Payment,
                Customer = new { order.CustomerName, order.CustomerEmail, order.CustomerPhone },
                Shipping = new { order.ShippingAddress, order.ShippingCity, order.ShippingPostalCode },
                Items = order.Items.Select(item => new { Id = item.Id, ProductId = item.ProductId, Name = item.ProductName, Price = item.UnitPrice, Qty = item.Quantity }),
                Totals = new { order.TotalItems, order.Subtotal, order.Delivery, order.Total }
            });

        return Ok(history);
    }

    [HttpPost]
    public async Task<IActionResult> Create(OrderRequest request)
    {
        var customerName = GetString(request.Customer, "name");
        var customerEmail = GetString(request.Customer, "email").Trim().ToLowerInvariant();
        var customerPhone = GetString(request.Customer, "phone");
        var shippingAddress = GetString(request.Shipping, "address");
        var shippingCity = GetString(request.Shipping, "city");
        var shippingPostalCode = GetString(request.Shipping, "postal");
        var order = new Order
        {
            OrderId = "FM-" + DateTime.UtcNow.ToString("yyyyMMddHHmmssfff"),
            CustomerName = customerName,
            CustomerEmail = customerEmail,
            CustomerPhone = customerPhone,
            ShippingAddress = shippingAddress,
            ShippingCity = shippingCity,
            ShippingPostalCode = shippingPostalCode,
            CustomerJson = request.Customer.GetRawText(),
            ShippingJson = request.Shipping.GetRawText(),
            Payment = request.Payment,
            ItemsJson = request.Items.GetRawText(),
            TotalsJson = request.Totals.GetRawText(),
            TotalItems = GetInt(request.Totals, "totalItems"),
            Subtotal = GetDecimal(request.Totals, "subtotal"),
            Delivery = GetDecimal(request.Totals, "delivery"),
            Total = GetDecimal(request.Totals, "total")
        };
        db.Orders.Add(order);
        await db.SaveChangesAsync();

        foreach (var item in request.Items.EnumerateArray())
        {
            db.OrderItems.Add(new OrderItem
            {
                OrderId = order.Id,
                ProductId = GetInt(item, "id"),
                ProductName = GetString(item, "name"),
                UnitPrice = GetDecimal(item, "price"),
                Quantity = GetInt(item, "qty")
            });
        }
        await db.SaveChangesAsync();
        return Ok(new { success = true, orderId = order.OrderId });
    }

    private static string GetString(JsonElement element, string propertyName) => element.TryGetProperty(propertyName, out var value) ? value.GetString() ?? string.Empty : string.Empty;
    private static int GetInt(JsonElement element, string propertyName) => element.TryGetProperty(propertyName, out var value) && value.TryGetInt32(out var number) ? number : 0;
    private static decimal GetDecimal(JsonElement element, string propertyName) => element.TryGetProperty(propertyName, out var value) && value.TryGetDecimal(out var number) ? number : 0;
}