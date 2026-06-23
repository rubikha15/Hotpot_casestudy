using HotByte.DTOs;
using HotByte.Models;
using HotByte.Repositories.Interfaces;
using HotByte.Services.Interfaces;

namespace HotByte.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repo;

        public CategoryService(ICategoryRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Category>>
            GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }

        public async Task<Category?>
            GetByIdAsync(int id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task AddAsync(CreateCategoryDto dto)
        {
            await _repo.AddAsync(new Category
            {
                CategoryName = dto.CategoryName
            });
        }

        public async Task UpdateAsync(
            int id,
            CreateCategoryDto dto)
        {
            var category =
                await _repo.GetByIdAsync(id);

            if (category == null)
                throw new Exception("Category not found");

            category.CategoryName =
                dto.CategoryName;

            await _repo.UpdateAsync(category);
        }

        public async Task DeleteAsync(int id)
        {
            await _repo.DeleteAsync(id);
        }
    }
}