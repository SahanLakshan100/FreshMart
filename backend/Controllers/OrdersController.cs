using System.Text.Json;
using FreshMart.Api.Data;
using FreshMart.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace FreshMart.Api.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController(FreshMartDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create(OrderRequest request)
    {
        var order = new Order
        {
            OrderId = "FM-" + DateTime.UtcNow.ToString("yyyyMMddHHmmssfff"),
            CustomerJson = request.Customer.GetRawText(),
            ShippingJson = request.Shipping.GetRawText(),
            Payment = request.Payment,
            ItemsJson = request.Items.GetRawText(),
            TotalsJson = request.Totals.GetRawText()
        };
        db.Orders.Add(order);
        await db.SaveChangesAsync();
        return Ok(new { success = true, orderId = order.OrderId });
    }
}