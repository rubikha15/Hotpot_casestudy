using HotByte.DTOs;
using HotByte.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotByte.Controllers
{
    [ApiController]
    [Route("api/restaurants")]
    public class RestaurantController : ControllerBase
    {
        private readonly IRestaurantService _service;

        public RestaurantController(IRestaurantService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);

            if (result == null)
                return NotFound("Restaurant not found");

            return Ok(result);
        }

        [HttpGet("{id}/menu")]
        public async Task<IActionResult> GetMenu(int id)
        {
            return Ok(await _service.GetMenuByRestaurantIdAsync(id));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddRestaurant(CreateRestaurantDto dto)
        {
            await _service.AddAsync(dto);
            return Ok("Restaurant added successfully");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRestaurant(int id)
        {
            await _service.DeleteAsync(id);
            return Ok("Restaurant deleted successfully");
        }
    }
}