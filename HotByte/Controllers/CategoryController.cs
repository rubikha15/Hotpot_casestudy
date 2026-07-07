using HotByte.DTOs;
using HotByte.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HotByte.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _service;

        public CategoryController(ICategoryService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateCategoryDto dto)
        {
            await _service.AddAsync(dto);
            return Ok("Category Added Successfully");
        }
    }
}