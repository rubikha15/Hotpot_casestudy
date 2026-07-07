using HotByte.DTOs;
using HotByte.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HotByte.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _service;

        public CartController(ICartService service)
        {
            _service = service;
        }

        // =========================
        // GET CART
        // =========================
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(int userId)
        {
            var cart = await _service.GetCartAsync(userId);

            if (cart == null)
                return NotFound("Cart not found");

            return Ok(cart);
        }

        // =========================
        // ADD ITEM
        // =========================
        [HttpPost("{userId}")]
        public async Task<IActionResult> AddItem(int userId, [FromBody] AddCartItemDto dto)
        {
            await _service.AddItemAsync(userId, dto);
            return Ok(new { message = "Item added to cart" });
        }

        // =========================
        // UPDATE QUANTITY
        // =========================
        [HttpPut("{cartItemId}")]
        public async Task<IActionResult> UpdateQty(int cartItemId, [FromBody] UpdateCartQtyDto dto)
        {
            await _service.UpdateQtyAsync(cartItemId, dto);
            return Ok(new { message = "Quantity updated" });
        }

        // =========================
        // DELETE ITEM
        // =========================
        [HttpDelete("{cartItemId}")]
        public async Task<IActionResult> Delete(int cartItemId)
        {
            await _service.DeleteItemAsync(cartItemId);
            return Ok(new { message = "Item deleted" });
        }

        // =========================
        // CLEAR CART
        // =========================
        [HttpDelete("clear/{userId}")]
        public async Task<IActionResult> Clear(int userId)
        {
            await _service.ClearCartAsync(userId);
            return Ok(new { message = "Cart cleared" });
        }
    }
}