using HotByte.DTOs;
using HotByte.Models;

namespace HotByte.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllAsync();

        Task<Category?> GetByIdAsync(int id);

        Task AddAsync(CreateCategoryDto dto);

        Task UpdateAsync(int id,
            CreateCategoryDto dto);

        Task DeleteAsync(int id);
    }
}