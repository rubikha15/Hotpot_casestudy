using HotByte.Models;

namespace HotByte.Repositories.Interfaces
{
    public interface IMenuRepository
    {
        Task<IEnumerable<MenuItem>> GetAllAsync();

        Task<MenuItem?> GetByIdAsync(int id);

        Task AddAsync(MenuItem menuItem);

        Task UpdateAsync(MenuItem menuItem);

        Task DeleteAsync(int id);

        Task<IEnumerable<MenuItem>> SearchAsync(string keyword);

        Task<IEnumerable<MenuItem>> FilterAsync(
            int? categoryId,
            bool? isVeg,
            decimal? minPrice,
            decimal? maxPrice);
    }
}