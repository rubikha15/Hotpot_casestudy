using HotByte.DTOs;
using HotByte.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotByte.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _service;

        public AdminController(IAdminService service)
        {
            _service = service;
        }

        [HttpGet("users")]
        public async Task<IActionResult> Users()
        {
            return Ok(
                await _service.GetUsersAsync());
        }

        [HttpGet("restaurants")]
        public async Task<IActionResult> Restaurants()
        {
            return Ok(
                await _service.GetRestaurantsAsync());
        }

        [HttpGet("categories")]
        public async Task<IActionResult> Categories()
        {
            return Ok(
                await _service.GetCategoriesAsync());
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> Dashboard()
        {
            return Ok(
                await _service.GetDashboardAsync());
        }

        [HttpGet("revenue")]
        public async Task<IActionResult> Revenue()
        {
            return Ok(
                await _service.GetRevenueAsync());
        }
    }
}