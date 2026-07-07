using HotByte.DTOs;

namespace HotByte.Services.Interfaces
{
    public interface IRestaurantService
    {
        Task<IEnumerable<RestaurantResponseDto>> GetAllAsync();

        Task<RestaurantResponseDto?> GetByIdAsync(int id);

        Task<IEnumerable<MenuItemResponseDto>> GetMenuByRestaurantIdAsync(int restaurantId);

        Task AddAsync(CreateRestaurantDto dto);

        Task DeleteAsync(int id);
    }
}