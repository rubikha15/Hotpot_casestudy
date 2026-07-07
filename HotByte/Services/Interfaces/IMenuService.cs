using HotByte.DTOs;

namespace HotByte.Services.Interfaces
{
    public interface IMenuService
    {
        Task<IEnumerable<MenuItemResponseDto>> GetAllAsync(int pageNumber, int pageSize);

        Task<MenuItemResponseDto?> GetByIdAsync(int id);

        Task AddAsync(CreateMenuItemDto dto);

        Task UpdateAsync(int id, UpdateMenuItemDto dto);

        Task DeleteAsync(int id);

        Task<IEnumerable<MenuItemResponseDto>> SearchAsync(string keyword);

        Task<IEnumerable<MenuItemResponseDto>> FilterAsync(
            int? categoryId,
            bool? isVeg,
            decimal? minPrice,
            decimal? maxPrice
        );
    }
}