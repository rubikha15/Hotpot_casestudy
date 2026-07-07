using HotByte.DTOs;
using HotByte.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HotByte.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _service;

        public OrderController(IOrderService service)
        {
            _service = service;
        }

        [Authorize(Roles = "Admin,Restaurant,User")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [Authorize(Roles = "Admin,Restaurant,User")]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _service.GetByIdAsync(id);

            if (result == null)
                return NotFound("Order not found");

            return Ok(result);
        }

        [Authorize(Roles = "User")]
        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("UserId missing in token");

            int userId = int.Parse(userIdClaim);

            var orders = await _service.GetOrdersByUserIdAsync(userId);

            return Ok(orders);
        }

        [Authorize(Roles = "Restaurant")]
        [HttpGet("restaurant-orders")]
        public async Task<IActionResult> GetRestaurantOrders()
        {
            var restaurantIdClaim = User.FindFirst("RestaurantId")?.Value;

            if (string.IsNullOrEmpty(restaurantIdClaim))
                return Unauthorized("RestaurantId missing in token");

            int restaurantId = int.Parse(restaurantIdClaim);

            var orders = await _service.GetOrdersByRestaurantIdAsync(restaurantId);

            return Ok(orders);
        }

        [Authorize(Roles = "User")]
        [HttpPost("place-order")]
        public async Task<IActionResult> PlaceOrder(PlaceOrderDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("UserId missing in token");

            int userId = int.Parse(userIdClaim);

            await _service.PlaceOrderAsync(userId, dto);

            return Ok("Order placed successfully. Payment status is Pending.");
        }

        [Authorize(Roles = "Admin,Restaurant")]
        [HttpPut("{orderId}/status")]
        public async Task<IActionResult> UpdateStatus(int orderId, UpdateOrderStatusDto dto)
        {
            var order = await _service.GetByIdAsync(orderId);

            if (order == null)
                return NotFound("Order not found");

            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var restaurantIdClaim = User.FindFirst("RestaurantId")?.Value;

            if (role == "Restaurant")
            {
                if (string.IsNullOrEmpty(restaurantIdClaim))
                    return Unauthorized("RestaurantId missing in token");

                int loggedRestaurantId = int.Parse(restaurantIdClaim);

                if (order.RestaurantId != loggedRestaurantId)
                    return StatusCode(403, "Restaurant can update only their own order status");
            }

            await _service.UpdateStatusAsync(orderId, dto.Status);

            return Ok("Order status updated successfully");
        }
    }
}