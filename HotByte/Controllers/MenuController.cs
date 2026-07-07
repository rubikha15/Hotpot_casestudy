using HotByte.DTOs;
using HotByte.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HotByte.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuController : ControllerBase
    {
        private readonly IMenuService _service;

        public MenuController(IMenuService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(int pageNumber = 1, int pageSize = 10)
        {
            return Ok(await _service.GetAllAsync(pageNumber, pageSize));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _service.GetByIdAsync(id);

            if (result == null)
                return NotFound("Menu item not found");

            return Ok(result);
        }

        [Authorize(Roles = "Admin,Restaurant")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateMenuItemDto dto)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var restaurantIdClaim = User.FindFirst("RestaurantId")?.Value;

            if (role == "Restaurant")
            {
                if (string.IsNullOrEmpty(restaurantIdClaim))
                    return Unauthorized("RestaurantId missing in token");

                int loggedRestaurantId = int.Parse(restaurantIdClaim);

                if (dto.RestaurantId != loggedRestaurantId)
                    return StatusCode(403, "Restaurant can add menu only for their own restaurant");
            }

            await _service.AddAsync(dto);
            return Ok("Menu item added successfully");
        }

        [Authorize(Roles = "Admin,Restaurant")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateMenuItemDto dto)
        {
            var existingMenu = await _service.GetByIdAsync(id);

            if (existingMenu == null)
                return NotFound("Menu item not found");

            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var restaurantIdClaim = User.FindFirst("RestaurantId")?.Value;

            if (role == "Restaurant")
            {
                if (string.IsNullOrEmpty(restaurantIdClaim))
                    return Unauthorized("RestaurantId missing in token");

                int loggedRestaurantId = int.Parse(restaurantIdClaim);

                if (existingMenu.RestaurantId != loggedRestaurantId)
                    return StatusCode(403, "Restaurant can update only their own menu");
            }

            await _service.UpdateAsync(id, dto);
            return Ok("Menu updated successfully");
        }

        [Authorize(Roles = "Admin,Restaurant")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingMenu = await _service.GetByIdAsync(id);

            if (existingMenu == null)
                return NotFound("Menu item not found");

            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var restaurantIdClaim = User.FindFirst("RestaurantId")?.Value;

            if (role == "Restaurant")
            {
                if (string.IsNullOrEmpty(restaurantIdClaim))
                    return Unauthorized("RestaurantId missing in token");

                int loggedRestaurantId = int.Parse(restaurantIdClaim);

                if (existingMenu.RestaurantId != loggedRestaurantId)
                    return StatusCode(403, "Restaurant can delete only their own menu");
            }

            await _service.DeleteAsync(id);
            return Ok("Menu deleted successfully");
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search(string keyword)
        {
            return Ok(await _service.SearchAsync(keyword));
        }

        [HttpGet("filter")]
        public async Task<IActionResult> Filter(
            int? categoryId,
            bool? isVeg,
            decimal? minPrice,
            decimal? maxPrice)
        {
            return Ok(await _service.FilterAsync(categoryId, isVeg, minPrice, maxPrice));
        }
    }
}