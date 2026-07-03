using HotByte.DTOs;
using HotByte.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<IActionResult> GetAll(
            int pageNumber = 1,
            int pageSize = 10)
        {
            return Ok(
                await _service.GetAllAsync(
                    pageNumber,
                    pageSize));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            return Ok(
                await _service.GetByIdAsync(id));
        }

        [HttpPost]
        public async Task<IActionResult> Create(
            CreateMenuItemDto dto)
        {
            await _service.AddAsync(dto);
            return Ok("Menu Item Added");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            UpdateMenuItemDto dto)
        {
            await _service.UpdateAsync(id, dto);
            return Ok("Menu Updated");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return Ok("Deleted");
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search(
            string keyword)
        {
            return Ok(
                await _service.SearchAsync(keyword));
        }

        [HttpGet("filter")]
        public async Task<IActionResult> Filter(
            int? categoryId,
            bool? isVeg,
            decimal? minPrice,
            decimal? maxPrice)
        {
            return Ok(
                await _service.FilterAsync(
                    categoryId,
                    isVeg,
                    minPrice,
                    maxPrice));
        }
    }
}