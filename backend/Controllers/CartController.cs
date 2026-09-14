using FreshMart.Api.Data;
using FreshMart.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FreshMart.Api.Controllers;

[ApiController]
[Route("api/cart")]
public class CartController(FreshMartDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string sessionId)
    {
        if (string.IsNullOrWhiteSpace(sessionId)) return BadRequest("sessionId is required");
        var cart = await db.Carts.AsNoTracking().FirstOrDefaultAsync(item => item.SessionId == sessionId);
        return Ok(new { items = cart is null ? "[]" : cart.ItemsJson });
    }

    [HttpPut]
    public async Task<IActionResult> Save(CartRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.SessionId)) return BadRequest("sessionId is required");
        var cart = await db.Carts.FirstOrDefaultAsync(item => item.SessionId == request.SessionId);
        if (cart is null)
        {
            cart = new Cart { SessionId = request.SessionId, UserId = request.UserId, ItemsJson = request.ItemsJson };
            db.Carts.Add(cart);
        }
        else
        {
            cart.UserId = request.UserId;
            cart.ItemsJson = request.ItemsJson;
            cart.UpdatedAt = DateTime.UtcNow;
        }
        await db.SaveChangesAsync();
        return Ok(new { success = true, cart.Id, cart.UpdatedAt });
    }
}

public record CartRequest(string SessionId, int? UserId, string ItemsJson);