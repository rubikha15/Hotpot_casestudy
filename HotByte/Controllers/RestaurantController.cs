    using HotByte.Services.Interfaces;
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

        // GET all restaurants
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        // GET restaurant by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);

            if (result == null)
                return NotFound("Restaurant not found");

            return Ok(result);
        }

        // GET menu for a restaurant (FIXED DESIGN)
        [HttpGet("{id}/menu")]
        public async Task<IActionResult> GetMenu(int id)
        {
            var menu = await _service.GetMenuByRestaurantIdAsync(id);
            return Ok(menu);
        }
        
    }
}