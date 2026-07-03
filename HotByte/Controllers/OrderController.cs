using HotByte.DTOs;
using HotByte.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        // ================= GET ALL ORDERS =================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        // ================= GET ORDER BY ID =================
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _service.GetByIdAsync(id);

            if (result == null)
                return NotFound("Order not found");

            return Ok(result);
        }

        // ================= PLACE ORDER =================
        [HttpPost("{userId}")]
        public async Task<IActionResult> PlaceOrder(int userId, PlaceOrderDto dto)
        {
            await _service.PlaceOrderAsync(userId, dto);
            return Ok("Order placed successfully");
        }

        [HttpPut("{orderId}/status")]
        [Authorize(Roles = "Admin,Restaurant")]
        public async Task<IActionResult> UpdateStatus(int orderId, UpdateOrderStatusDto dto)
        {
            await _service.UpdateStatusAsync(orderId, dto.Status);
            return Ok("Order status updated successfully");
        }
    }
}